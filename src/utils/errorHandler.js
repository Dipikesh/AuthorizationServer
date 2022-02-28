const createError = require('http-errors')
const app = require('../app.js').server

const exitHandler = () => {
  if (app) {
    app.close(() => {
      console.log('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const ExceptionHandler = error => {
  console.log('unexpected  ' + error.stack)

  exitHandler()
}
const RejectionHandler = error => {
  console.log('Rejection  ' + error.stack)

  exitHandler()
}
process.on('uncaughtException', ExceptionHandler)
process.on('unhandledRejection', RejectionHandler)

isOperational = err => {
  const errorType = createError.isHttpError(err)

  if (errorType || err.isJoi || err.name === 'MongooseError') return true
  else return false
}

exports.errorHandler = (err, req, res, next) => {
  console.log(err)
  if (!isOperational(err)) {
    console.log(`shutting down due to ${err.stack}`)
    process.exit(1)
  } else {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message
      }
    })
  }
}
