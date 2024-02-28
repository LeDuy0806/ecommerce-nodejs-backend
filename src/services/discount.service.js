'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')
const { discount } = require('../models/discount.model')
const {
  checkDiscountExists,
  findAllDiscountCodeUnselect,
  findAllDiscountCodesSelect
} = require('../models/repositories/discount.repo')

class DiscountService {
  static async createDiscount(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used
    } = payload

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired')
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('Start date cannot be greater than end date')
    }

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId)
      })
      .lean()
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw BadRequestError('discount exists!')
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_descreption: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  static async updateDiscountCode() {}

  static async getAllProductsWithDiscountCode({ code, shopId, page, limit, userId }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId
      })
      .lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('discount not found!')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let product

    if (discount_applies_to === 'all') {
      product = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      product = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
          _id: { $in: discount_product_ids }
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    return product
  }
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true
      },
      select: ['discount_code', 'discount_name'],
      model: discount
    })

    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount not found')
    }

    const {
      discount_is_active,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) {
      throw new BadRequestError('Discount code is not active')
    }
    if (!discount_max_uses) {
      throw new BadRequestError('Discount code has been out')
    }
    if (new Date() < discount_start_date || new Date() > discount_end_date) {
      throw new BadRequestError('Discount code has expired')
    }

    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity
      }, 0)
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(`Discount requires a minimum order value : ${discount_min_order_value}`)
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsed = discount_users_used.filter((user) => user.userId === userId)
      if (userUsed.length > discount_max_uses_per_user) {
        throw new BadRequestError('Discount code has been used over the limit per user ' + discount_max_uses_per_user)
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value) / 100

    return {
      totalOrder,
      discountAmount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shopId, code }) {
    const deleted = await discount.findOneAndDelete({
      discount_shopId: shopId,
      discount_code: code
    })

    return deleted
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code not found`)
    }
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
    return result
  }
}

module.exports = DiscountService
