'use strict'
const { NotFoundError } = require('../../core/error.response')
const { getSelectData, getUnSelectData } = require('../../utils')
const { product, electronic, clothing } = require('../product.model')
const { Types } = require('mongoose')

const findAllDraftForShop = async ({ query, limit, skip }) => {
  console.log(query)
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id })
  if (!foundShop) throw new NotFoundError('Product not found')
  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({ product_shop, _id: product_id })
  if (!shop) return null
  shop.isDraft = true
  shop.isPublished = false
  const { modifiedCount } = await shop.updateOne(shop)
  return modifiedCount
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew
  })
}
const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  console.log(regexSearch)
  const result = await product
    .find(
      {
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch }
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return result
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const result = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean()
  return result
}

const findProduct = async ({ product_id, unselect }) => {
  const result = await product.findById(product_id).select(getUnSelectData(unselect)).lean()
  return result
}

const getProductById = async (productId) => {
  return await product.findOne({ _id: productId }).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId)
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId
        }
      }
    })
  )
}
module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer
}
