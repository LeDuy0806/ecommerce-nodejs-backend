'use strict'

const { pick } = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields)
}

const getSelectData = ({ fields = [] }) => {
  return fields.join(' ')
}

const getUnSelectData = ({ fields = [] }) => {
  return fields.map((field) => `-${field}`).join(' ')
}

module.exports = {
  getInfoData
}
