'use strict'

const { Created, Ok, SuccessResponse } = require('../core/success.response')
const AuthService = require('../services/auth.service')

class AuthController {
  handleRefeshToken = async (req, res, next) => {
    const { refreshToken } = req.body

    new SuccessResponse({
      message: 'Refresh token successfully',
      metaData: await AuthService.handleRefreshToken({
        refreshToken
      })
    }).send(res)
  }

  signUp = async (req, res, next) => {
    console.log(`[P]:: `, req.body)
    new Created({
      message: 'Sign up successfully',
      metaData: await AuthService.signUp(req.body)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login successfully',
      metaData: await AuthService.login(req.body)
    }).send(res)
  }

  logout = async (req, res, next) => {
    console.log(req.keyStore)

    new SuccessResponse({
      message: 'Logout successfully',
      metaData: await AuthService.logout(req.keyStore)
    }).send(res)
  }
}

module.exports = new AuthController()
