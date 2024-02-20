'use strict'

const bcrypt = require('bcrypt')
const { randomBytes } = require('crypto')

// Services
const KeyTokenService = require('./keyToken.service')

// Constants
const { SHOP_ROLES } = require('../constants/roles.constant')

// Models
const shopModel = require('../models/shop.model')

// Utils
const { createTokenPair } = require('../utils/auth.util')
const { getInfoData } = require('../utils/lodash.util')

class AuthService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Check email exists
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxx',
          message: 'Shop already registered'
        }
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
        const privateKey = randomBytes(64).toString('hex')
        const publicKey = randomBytes(64).toString('hex')

        // Create keyToken
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          privateKey,
          publicKey
        })

        if (!keyStore) {
          return {
            code: 'xxx',
            message: 'Create keyToken failed'
          }
        }

        // Create token pair
        const tokens = await createTokenPair(
          {
            userId: newShop._id,
            email
          },
          publicKey,
          privateKey
        )

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

      return {
        code: '200',
        metadata: null
      }
    } catch (error) {
      console.log(error)
      return {
        code: 'xxx',
        message: error.messages,
        status: 'error'
      }
    }
  }
}

module.exports = AuthService
