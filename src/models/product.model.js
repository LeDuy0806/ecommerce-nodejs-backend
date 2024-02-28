'use strict'
const { model, Schema, Types } = require('mongoose')
const { default: slugify } = require('slugify')
const { COLLECTION_NAMES, DOCUMENT_NAMES } = require('../constants/db.constant')

const productSchema = new Schema(
  {
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: Number, require: true },
    product_slug: String,
    product_quantity: { type: Number, require: true },
    product_type: {
      type: String,
      require: true,
      enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.SHOP },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    //more
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must above 1.0'],
      max: [5, 'Rating must above 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
  },
  {
    collection: COLLECTION_NAMES.PRODUCTS,
    timestamps: true
  }
)

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

// define the product type=Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.SHOP }
  },
  {
    collection: 'clothes',
    timestamps: true
  }
)

// define the product type=eletronics
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAMES.SHOP }
  },
  {
    collection: 'electronics',
    timestamps: true
  }
)

module.exports = {
  product: model(DOCUMENT_NAMES.PRODUCT, productSchema),
  electronic: model('electronic', electronicSchema),
  clothing: model('clothing', clothingSchema)
}
