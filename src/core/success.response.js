'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201
}

const ReasonStatusCodes = {
  OK: 'Created',
  CREATED: 'Success'
}
class SuccessResponse {
  constructor({ message, ReasonStatusCode = ReasonStatusCodes.OK, statusCode = StatusCode.OK, metaData = {} }) {
    this.message = !message ? ReasonStatusCodes.OK : message
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
    ReasonStatusCode = ReasonStatusCodes.CREATED,
    statusCode = StatusCode.CREATED,
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
