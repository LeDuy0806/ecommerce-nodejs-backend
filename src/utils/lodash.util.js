'use strict'

const { pick } = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields)
}

module.exports = {
  getInfoData
}
