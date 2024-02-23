'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    // await JWT.verify(accessToken, publicKey, (err, decode) => {
    //   if (err) {
    //     console.log('Error verify: ', err)
    //   } else {
    //     console.log('decode verify: ', decode)
    //   }
    // })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log('Co loi', error)
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  console.log('userId: ', userId)

  if (!userId) {
    throw new AuthFailureError('Invalid request')
  }

  const keyStore = await findByUserId(userId)
  console.log('keyStore: ', keyStore)

  if (!keyStore) {
    throw new NotFoundError('Not found keyStore')
  }

  let accessToken = req.headers[HEADER.AUTHORIZATION]
  accessToken = accessToken.split(' ')[1]
  if (!accessToken) {
    throw new AuthFailureError('Invalid request')
  }
  try {
    const decoded = JWT.verify(accessToken, keyStore.publicKey)

    if (decoded.userId !== userId) {
      throw new AuthFailureError('Invalid request')
    }

    req.keyStore = keyStore
    req.user = decoded
    console.log('decoded: ', decoded)

    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = { createTokenPair, authentication, verifyJWT }
