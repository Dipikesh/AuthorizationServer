const express = require(`express`)
const createError = require(`http-errors`)
const cors = require('cors')
const helmet = require('helmet')
require(`dotenv`).config()
const app = express()
const { errorHandler } = require('./utils/errorHandler')
var cookieParser = require('cookie-parser');


app.use(helmet())
app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }))
app.options(
  '*',
  cors({ origin: true, optionsSuccessStatus: 200, credentials: true })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require('./utils/dbconfig').connect();

app.use('/', require('./routes'))



app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use(errorHandler)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = server;


