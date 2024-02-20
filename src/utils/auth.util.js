'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // generate access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '15m'
    })

    // generate refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7d'
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(err)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error(error)
  }
}

module.exports = { createTokenPair }
