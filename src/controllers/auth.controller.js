'use strict'

const { asyncHandler } = require('../helpers/asyncHandler')
const AuthService = require('../services/auth.service')

class AuthController {
  signUp = asyncHandler(async (req, res, next) => {
    console.log(`[P]:: `, req.body)
    return res.status(201).json(await AuthService.signUp(req.body))
  })
}

module.exports = new AuthController()
