'use strict'

const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      require: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },
    cart_products: { type: Array, require: true, default: [] },
    /*
     {
         product_id: { type: String, require: true },
         product_shopId: { type: String, require: true },
         product_name: { type: String, require: true },
         product_price: { type: Number, require: true },
         product_quantity: { type: Number, require: true }
     }
     */
    cart_count_product: { type: Number },
    cart_userId: { type: String, require: true }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  }
)

//Export the model
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema)
}
