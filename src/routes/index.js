'use strict'

const router = require('express').Router()

// // Middleware
// const { apiKeyValidator, permissionsValidator } = require('../middleware/auth/checkAuth')

// // check API key and permissions
// router.use(apiKeyValidator, permissionsValidator('0000'))

router.use('/api/v1', require('./auth'))
router.use('/api/v1/product', require('./product'))
router.use('/api/v1/discount', require('./discount'))
router.use('/api/v1/cart', require('./cart'))
router.use('/api/v1/checkout', require('./checkout'))
router.use('/api/v1/inventory', require('./inventory'))

module.exports = router
