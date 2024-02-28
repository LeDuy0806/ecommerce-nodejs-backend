'use strict'

const { Created, SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type, ...payload } = req.body
    new SuccessResponse({
      message: 'Create new Product successfully',
      metaData: await ProductService.createProduct(product_type, { ...payload, product_shop: req.user.userId })
    }).send(res)
  }

  //update product
  updateProduct = async (req, res, next) => {
    const { product_type, ...payload } = req.body
    const productId = req.params.id
    new SuccessResponse({
      message: 'Update product successfully',
      metaData: await ProductService.updateProduct(product_type, productId, {
        ...payload,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  // PUT
  /**
   * @desc Publish product by shop
   * @param {String} product_id
   * @route PUT /api/v1/products/publish/:id
   * @access Private
   * @returns {JSON} Product published
   */
  publishProductByShop = async (req, res, next) => {
    const product_id = req.params.id
    new SuccessResponse({
      message: 'Publish product successfully',
      metaData: await ProductService.publishProductByShop({ product_shop: req.user.userId, product_id })
    }).send(res)
  }

  /**
   * @desc Unpublish product by shop
   * @param {String} product_id
   * @route PUT /api/v1/products/unpublish/:id
   * @access Private
   * @returns {JSON} Product unpublished
   * */
  unPublishProductByShop = async (req, res, next) => {
    const product_id = req.params.id
    new SuccessResponse({
      message: 'Unpublish product successfully',
      metaData: await ProductService.unPublishProductByShop({ product_shop: req.user.userId, product_id })
    }).send(res)
  }

  // END PUT

  // QUERY
  /**
   * @desc Get all drafts for shop
   * @param {Number } limit
   * @param {Number} skip
   * @route GET /api/v1/products/drafts
   * @access Private
   * @returns {JSON} All drafts for shop
   */
  getAllDraftsForShop = async (req, res, next) => {
    const { limit, skip } = req.query
    new SuccessResponse({
      message: 'Get all drafts for shop successfully',
      metaData: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId, limit, skip })
    }).send(res)
  }

  /**
   * @desc Get all publish for shop
   * @param {Number } limit
   * @param {Number} skip
   * @route GET /api/v1/products/publish
   * @access Private
   * @returns {JSON} All publish for shop
   * */
  getAllPublishForShop = async (req, res, next) => {
    const { limit, skip } = req.query
    new SuccessResponse({
      message: 'Get all publish for shop successfully',
      metaData: await ProductService.findAllPublishForShop({ product_shop: req.user.userId, limit, skip })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product successfully',
      metaData: await ProductService.searchProductByUser(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product successfully',
      metaData: await ProductService.findAllProducts(req.params)
    }).send(res)
  }
  findProduct = async (req, res, next) => {
    const product_id = req.params.id
    new SuccessResponse({
      message: 'Get product successfully',
      metaData: await ProductService.findProduct({ product_id })
    }).send(res)
  }
  // END QUERY
}

module.exports = new ProductController()
