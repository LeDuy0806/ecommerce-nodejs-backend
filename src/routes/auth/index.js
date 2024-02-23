'use strict'

const router = require('express').Router()

const authController = require('../../controllers/auth.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../utils/auth.util')

// Sign up
router.post('/shop/signup', asyncHandler(authController.signUp))
router.post('/shop/login', asyncHandler(authController.login))

router.use(authentication)

router.post('/shop/logout', asyncHandler(authController.logout))
router.post('/shop/refresh-token', asyncHandler(authController.handleRefeshToken))

module.exports = router
