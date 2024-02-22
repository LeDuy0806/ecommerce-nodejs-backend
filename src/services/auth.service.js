'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')

// Services
const KeyTokenService = require('./keyToken.service')

// Constants
const { SHOP_ROLES } = require('../constants/roles.constant')

// Models
const shopModel = require('../models/shop.model')

// Utils
const { createTokenPair } = require('../utils/auth.util')
const { getInfoData } = require('../utils/lodash.util')
const { BadRequestError } = require('../core/error.response')

class AuthService {
  static signUp = async ({ name, email, password }) => {
    // Check email exists
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Email already exists')
    }

    // Create new shop
    const hashedPassword = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [SHOP_ROLES.SHOP]
    })

    if (newShop) {
      // Create privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
      })

      // Create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email
        },
        publicKey,
        privateKey
      )

      // Create keyToken
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
        refreshToken: tokens.refreshToken
      })

      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'Create keyToken failed'
        }
      }

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop
          }),
          tokens
        }
      }
    }
  }
}

module.exports = AuthService
