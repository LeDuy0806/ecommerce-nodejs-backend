'use strict'
const { model, Schema, Types } = require('mongoose')
const { DOCUMENT_NAMES, COLLECTION_NAMES } = require('../constants/db.constant')

const orderSchema = new Schema(
  {
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout = {
            totalPrice,
            totalApllyDiscount,
            totalApllyDiscount,
            feeship
        }
    */
    order_shipping: { type: Object, default: {} },
    /*
    street,
    city,
    state,
    country
  */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#0000128022024' },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending'
    }
  },

  {
    timestamps: true,
    collection: COLLECTION_NAMES.ORDERS
  }
)
module.exports = model(DOCUMENT_NAMES.ORDER, orderSchema)
