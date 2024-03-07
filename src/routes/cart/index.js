'use strict'

const express = require('express')

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../utils/auth.util')
const cartController = require('../../controllers/cart.controller')

const router = express.Router()

router.use(authentication)

router.post('/', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('/', asyncHandler(cartController.listToCart))
router.delete('/', asyncHandler(cartController.deleteCartItem))

module.exports = router
