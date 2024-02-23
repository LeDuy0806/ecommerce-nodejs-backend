'use strict'
const { StatusCodes, getReasonPhrase } = require('http-status-codes')

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = getReasonPhrase(StatusCodes.CONFLICT), statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}
class ForbidenError extends ErrorResponse {
  constructor(message = getReasonPhrase(StatusCodes.FORBIDDEN), statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = getReasonPhrase(StatusCodes.BAD_REQUEST), statusCode = StatusCodes.BAD_REQUEST) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = getReasonPhrase(StatusCodes.UNAUTHORIZED), statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = getReasonPhrase(StatusCodes.NOT_FOUND), statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  ForbidenError,
  AuthFailureError,
  NotFoundError,
  BadRequestError
}
