const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')

const app = express()

// init middlewares
app.use(morgan('dev')) // log requests
app.use(helmet()) // secure express app by setting various HTTP headers
app.use(compression()) // compress all responses
app.use(express.json()) // parse json request body
app.use(express.urlencoded({ extended: true })) // parse urlencoded request body

// init databases
require('./databases/init.mongodb')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init routes
app.use('/', require('./routes'))

// error handler

module.exports = app
