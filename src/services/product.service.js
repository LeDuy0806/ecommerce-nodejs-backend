'use strict'

const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findProduct,
  findAllProducts,
  updateProductById
} = require('../models/repositories/product.repo')
const { removeUndefineObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.model')

//define Fator classs to create product

class ProductFactory {
  static productRegistry = {}

  static registerProduct(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
    return await new productClass(payload).createProduct()
  }

  //update product
  static async updateProduct(type, ProductId, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
    return new productClass(payload).updateProduct(ProductId)
  }

  // QUERY
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftForShop({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }
  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb']
    })
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unselect: ['__v'] })
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    ;(this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes)
  }

  //create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId })

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        quantity: this.product_quantity,
        stock: this.product_quantity
      })
    }

    return newProduct
  }

  //update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product })
  }
}

//define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create clothing error')
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('create new Product error')
    return newProduct
  }

  async updateProduct(productId) {
    const objectParams = removeUndefineObject(this)
    // console.log('objectParams::', objectParams)

    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing
      })
    }
    const updatedProduct = super.updateProduct(productId, objectParams)
    return updatedProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop })
    if (!newElectronic) throw new BadRequestError('create electronic error')
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('create new Product error')
    return newProduct
  }
}

//register product type
ProductFactory.registerProduct('Clothing', Clothing)
ProductFactory.registerProduct('Electronics', Electronic)

module.exports = ProductFactory
