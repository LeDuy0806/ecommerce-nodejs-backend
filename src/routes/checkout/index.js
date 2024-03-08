'use strict'

const express = require('express')

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../utils/auth.util')
const checkoutController = require('../../controllers/checkout.controller')

const router = express.Router()

router.use(authentication)

router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router
