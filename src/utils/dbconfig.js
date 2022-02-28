const mongoose = require('mongoose')
require(`dotenv`).config()

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Mongoose server listening')
    })
    .catch(err => {
      console.log('Error while connecting', err)
    })

  var db = mongoose.connection

  db.on('disconnected', () => {
      console.log('Mongoose connection is disconnected.')
  })

  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
}
