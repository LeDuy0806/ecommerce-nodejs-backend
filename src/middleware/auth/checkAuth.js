'use strict'

const { findByKey } = require('../../services/apiKey.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKeyValidator = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    const objKey = await findByKey(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objKey = objKey
    next()
  } catch (error) {
    next(error)
  }
}

const permissionsValidator = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }

    console.log('permissions', req.objKey.permissions)

    const invalidPermission = !req.objKey.permissions.includes(permission)

    if (invalidPermission) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }

    return next()
  }
}

module.exports = {
  apiKeyValidator,
  permissionsValidator
}
