'use strict'

const router = require('express').Router()

const authController = require('../../controllers/auth.controller')

// Sign up
router.post('/shop/signup', authController.signUp)

module.exports = router
