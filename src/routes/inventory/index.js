'use strict'

const express = require('express')

const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../utils/auth.util')
const inventoryController = require('../../controllers/inventory.controller')

const router = express.Router()

router.use(authentication)

router.post('', asyncHandler(inventoryController.addStockToInventory))

module.exports = router
