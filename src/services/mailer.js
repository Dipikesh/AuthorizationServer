const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const createError = require('http-errors')
require(`dotenv`).config()


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

exports.sendEmail = (receiverEmail, body, subject) => {
  return new Promise(async (resolve, reject) => {
    try {
      const accessToken = await oAuth2Client.getAccessToken()

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: `initiatetenet@gmail.com`,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
        },
        tls: { rejectUnauthorized: false }
      })

      const mailOptions = {
        from: 'orvide.com ✉ <initiatetenet@gmail.com>',
        to: receiverEmail,
        subject: subject,
        text: body
      }

      const result = await transport.sendMail(mailOptions)
      console.log('Email has been successfully sent to ' + receiverEmail)
      resolve(result)
    } catch (error) {
      console.log('Mailer Error: ' , error)
      reject(createError(500, 'Internal Server Error'))
    }
  })
}
