'use strict'

const router = require('express').Router()

// Middleware
const { apiKeyValidator, permissionsValidator } = require('../middleware/auth.middleware')

// check API key and permissions
router.use(apiKeyValidator, permissionsValidator('0000'))

router.use('/api/v1', require('./auth'))

module.exports = router
