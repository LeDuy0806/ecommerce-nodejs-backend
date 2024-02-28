'use strict'

const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Discount created successfully',
      metaData: await DiscountService.createDiscount({ ...req.body, shopId: req.user.userId })
    }).send(res)
  }

  getAllProductWithDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'All products with discount code',
      metaData: await DiscountService.getAllProductsWithDiscountCode(req.query)
    }).send(res)
  }

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'All discount codes',
      metaData: await DiscountService.getAllDiscountCodesByShop(req.query)
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    // console.log(req.body)
    new SuccessResponse({
      message: 'Discount amount calculated successfully',
      metaData: await DiscountService.getDiscountAmount(req.body)
    }).send(res)
  }

  cancelDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Discount cancelled successfully',
      metaData: await DiscountService.cancelDiscountCode(req.body)
    }).send(res)
  }

  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Discount code deleted successfully',
      metaData: await DiscountService.deleteDiscountCode({ shopId: req.user.userId, code: req.body.code })
    }).send(res)
  }
}

module.exports = new DiscountController()
