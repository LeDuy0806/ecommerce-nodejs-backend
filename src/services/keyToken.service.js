'use strict'

const { Types } = require('mongoose')
const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      //lv 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey,
      // });
      // return tokens ? tokens.publicKey : null;
      //lv xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken
        },
        option = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id)
  }

  static findByRefreshTokenUsed = async (refreshTokenUsed) => {
    return await keyTokenModel.findOne({ refreshTokenUsed })
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  static deleteByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId })
  }
}

module.exports = KeyTokenService
