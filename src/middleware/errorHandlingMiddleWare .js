const errorHandlingMiddleWare = (error, req, res, next) => {
  const statusCode = error.statusCode || 500

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
    stack: error.stack
  })
}
module.exports = {
  errorHandlingMiddleWare
}
