'use strict'
const { model, Schema, Types } = require('mongoose')
const { DOCUMENT_NAMES, COLLECTION_NAMES } = require('../constants/db.constant')

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAMES.PRODUCT
    },
    inven_location: {
      type: String,
      default: 'unKnow'
    },
    inven_stock: {
      type: Number,
      require: true
    },
    inven_shopId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAMES.SHOP
    },
    inven_reservations: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.INVENTORIES
  }
)
module.exports = { inventory: model(DOCUMENT_NAMES.INVENTORY, inventorySchema) }
