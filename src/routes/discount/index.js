'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../utils/auth.util')

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllProductWithDiscountCode))

router.use(authentication)

router.post('/', asyncHandler(discountController.createDiscount))
router.get('/', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router
