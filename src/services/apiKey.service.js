'use strict'

const { randomBytes } = require('crypto')

// Models
const apiKeyModel = require('../models/apiKey.model')

class ApiKeyService {
  static findByKey = async (key) => {
    // const newKey = await apiKeyModel.create({ key: randomBytes(64).toString('hex'), permissions: ['0000'] })
    // console.log('apiKey::', newKey)
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
  }
}

module.exports = ApiKeyService
