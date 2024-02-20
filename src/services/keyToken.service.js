'use strict'

const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, privateKey, publicKey }) => {
    try {
      const token = await keytokenModel.create({
        user: userId,
        privateKey,
        publicKey
      })
      return token ? token.publicKey : null
    } catch (error) {
      return error
    }
  }
}

module.exports = KeyTokenService
