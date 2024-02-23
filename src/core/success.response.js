'use strict'

const { StatusCodes, getReasonPhrase } = require('http-status-codes')
class SuccessResponse {
  constructor({
    message,
    ReasonStatusCode = getReasonPhrase(StatusCodes.OK),
    statusCode = StatusCodes.OK,
    metaData = {}
  }) {
    this.message = !message ? ReasonStatusCode : message
    this.status = statusCode
    this.metaData = metaData
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class Ok extends SuccessResponse {
  constructor({ message, metaData = {} }) {
    super({ message, metaData })
  }
}
class Created extends SuccessResponse {
  constructor({
    message,
    ReasonStatusCode = getReasonPhrase(StatusCodes.CREATED),
    statusCode = StatusCodes.CREATED,
    metaData = {}
  }) {
    super({ message, ReasonStatusCode, statusCode, metaData })
  }
}

module.exports = {
  Ok,
  Created,
  SuccessResponse
}
