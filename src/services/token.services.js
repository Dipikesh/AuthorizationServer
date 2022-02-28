const jwt = require(`jsonwebtoken`)
const createError = require(`http-errors`)
const fs = require('fs')
const path = require('path')
const pathToPrivKey = path.join(__dirname,'..', 'utils/id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8') 

function signAccessToken (userId) {
  return new Promise((resolve, reject) => {
    const _id = userId
   

    const payload = {
      sub: _id,
      iat: Date.now(),
      type: `at`
    }

    const options = {
      expiresIn: `7d`,
      algorithm: `RS256`
    }

    jwt.sign(payload, PRIV_KEY, options, (err, token) => {
      if (err) {
        logger.error(err.message)
        return reject(
          createError(500, { code: 'ISE', message: 'internal server error' })
        )
      }
      return resolve(token)
    })
  })
}

module.exports = { signAccessToken }
