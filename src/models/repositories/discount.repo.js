'use strict'

const { getUnSelectData, getSelectData } = require('../../utils')

const findAllDiscountCodeUnselect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unselect, model }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(getUnSelectData(unselect))

  return documents
}

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select))

  return documents
}

const checkDiscountExists = async ({ model, filter }) => {
  const foundDiscount = await model.findOne(filter).lean()
  return foundDiscount
}

module.exports = {
  findAllDiscountCodeUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExists
}
