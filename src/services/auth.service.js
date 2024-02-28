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
const { createTokenPair, verifyJWT } = require('../utils/auth.util')
const { getInfoData } = require('../utils/lodash.util')
const {
  BadRequestError,
  ForbidenError,
  ConflictRequestError,
  AuthFailureError,
  NotFoundError
} = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const keyTokenModel = require('../models/keyToken.model')

class AuthService {
  static handleRefreshToken = async ({ user, keyStore, refreshToken }) => {
    // console.log('refreshToken :>> ', refreshToken)

    const { userId, email, roles } = user

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId)

      await KeyTokenService.deleteByKey(keyStore.user)

      throw new ForbidenError('Some thing wrong happened!')
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered')
    }

    const foundShop = await findByEmail({ email })

    if (!foundShop) {
      throw new AuthFailureError('Shop not registered')
    }

    const tokens = await createTokenPair({ userId, email, roles }, keyStore.publicKey, keyStore.privateKey)

    await keyTokenModel.updateOne(
      { refreshToken: refreshToken },
      {
        $set: {
          refreshToken: tokens.refreshToken
        },
        $addToSet: {
          refreshTokenUsed: `${refreshToken}`
        }
      }
    )

    return {
      user: { userId, email },
      tokens
    }
  }

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id)
  }

  static login = async ({ email, password }) => {
    //check email exists in db
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Email not found')
    }

    //check password
    const isMatch = await bcrypt.compare(password, foundShop.password)
    if (!isMatch) {
      throw new AuthFailureError('Password is incorrect')
    }

    // Create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // Create token pair
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
        roles: foundShop.roles
      },
      publicKey,
      privateKey
    )

    // Create keyToken
    const keyStore = await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    if (!keyStore) {
      return {
        code: 'xxx',
        message: 'Create keyToken failed'
      }
    }

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }
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
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   }
      // })
      const publicKey = crypto.randomBytes(64).toString('hex')
      const privateKey = crypto.randomBytes(64).toString('hex')

      // Create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
          roles: newShop.roles
        },
        publicKey,
        privateKey
      )

      // Create keyToken
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      })

      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'Create keyToken failed'
        }
      }

      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop
        }),
        tokens
      }
    }
    return {
      code: 200,
      metaData: null
    }
  }
}

module.exports = AuthService
