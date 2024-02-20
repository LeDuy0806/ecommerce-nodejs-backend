'use strict'
require('dotenv').config()
const { DATABASE } = require('../constants/db.constant')

const dev = {
  uri: DATABASE.LOCAL
}

const pro = {
  uri: DATABASE.CLOUD
}

const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
if (env === 'dev') {
  console.log('MongoDB Local')
} else {
  console.log('MongoDB Cloud')
}
module.exports = config[env]
