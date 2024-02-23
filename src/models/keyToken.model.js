'use strict'

const { Schema, model } = require('mongoose')

const { COLLECTION_NAMES, DOCUMENT_NAMES } = require('../constants/db.constant')

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop'
    },
    privateKey: {
      type: String,
      require: true
    },
    publicKey: {
      type: String,
      require: true
    },
    refreshTokenUsed: {
      type: Array,
      default: []
    },
    refreshToken: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.KEYS
  }
)

module.exports = model(DOCUMENT_NAMES.KEY, keyTokenSchema)
