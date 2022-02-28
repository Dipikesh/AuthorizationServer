const createError = require('http-errors')
const { userSchema } = require('../model/user.model')
const hashing = require('../utils/generator')
const { otpSchema } = require('../model/otp.model')

//SignUp User ,first it query about whether this email id exist or not , then proceed
exports.signupUser = async body => {
  try {
    const { email, name, password } = body
    const result = await userSchema.findOne({ email, isVerified: true })
    if (result) {
      throw createError(400, 'Email Already Exists')
    }
    var { hash, salt } = await hashing.genHash(password)
    const user = new userSchema({ email, name, password: { hash, salt } })
    const doc = await userSchema.updateOne(
      { email },
      { email, name, password: { hash, salt } },
      { upsert: true }
    )
    if (doc.nModified || doc.upserted) {
      console.log('User Registered')
      return
    }
  } catch (err) {
    throw err
  }
}

exports.loginUser = async body => {
  try {
    const { email, password } = body
    const result = await userSchema.findOne({ email })
    if (!result) throw createError(400, 'Invalid Email')
    if (result && !result.isVerified) {
      throw createError(400, 'Please Verify Your Email before Login')
    }
    const { hash, salt } = result.password
    if (!(await hashing.validateHash(password, hash, salt)))
      throw createError(401, 'Invalid Credentials')

    return result
  } catch (err) {
    throw err
  }
}

exports.verifyUser = async body => {
  try {
    const { email, otp } = body
    const user = await userSchema.findOne({ email }, { password: 0 })
    if (!user) {
      throw createError(400, 'Wrong Email Id')
    }
    if (user.isVerified) {
      throw createError(400, 'Email is already verified')
    }
    const otpData = await otpSchema.findOne({ email })
    if (!otpData) {
      throw createError(404, 'Something Went Wrong')
    }
    if (otpData.expiresAt < Date.now()) {
      await otpSchema.deleteOne({ email })
      throw createError(400, 'Otp Has expired')
    }
    const { hash, salt } = otpData.otp
    if (!(await hashing.validateHash(otp, hash, salt))) {
      throw createError(400, 'Otp does not match')
    }
    const doc = await userSchema.updateOne(
      { email },
      { $set: { isVerified: true } }
    )
    if (!doc.nModified)
      throw createError(500, 'Something Went Wrong, Please try again')

    await otpSchema.deleteOne({ email })

    return true
  } catch (err) {
    throw err
  }
}

exports.saveOtp = async (email, otp) => {
  try {
    const { hash, salt } = await hashing.genHash(otp)
    console.log('hash', hash)
    await otpSchema.updateOne(
      { email },
      {
        email,
        otp: { hash, salt },
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
      },
      { upsert: true }
    )
    return
  } catch (err) {
    throw err
  }
}

exports.isUserExist = async email => {
  try {
    const user = await userSchema.findOne({ email }, { password: 0 })
    if (!user) throw createError(404, 'Email does not exist')
    if (user && !user.isVerified) {
      throw createError(400, 'Email is not verified, Please Verify it first')
    }
    return user
  } catch (err) {
    throw err
  }
}

exports.saveToken = async (_id, token) => {
  try {
    const res = await userSchema.findOne({ _id })
    console.log('result', res)
    const result = await userSchema.updateOne(
      { _id },
      {
        $set: { resetToken: token, resetTokenExpiresAt: Date.now() + 3600000 }
      },
      { upsert: false }
    )
    if (!result.n) {
      console.log('No user found')
      throw createError(404, 'Email does not exist')
    }
    if (result.n && !result.nModified) {
      console.log('Can not insert Token in database')
      throw createError(500, 'Internal Server Error')
    }

    return true
  } catch (err) {
    throw err
  }
}

exports.resetPassword = async (token, password) => {
  try {
    const user = await userSchema.findOne({ resetToken: token })
    if (!user) throw createError(400, 'Invalid Token')
    if (!user.resetTokenExpiresAt > Date.now()) {
      throw createError(400, 'Link Expired')
    }
    const { hash, salt } = await hashing.genHash(password)
    const updatePassword = await userSchema.updateOne(
      { _id: user._id },
      { $set: { password: { hash, salt } } }
    )
    if (!updatePassword.nModified) {
      console.log('Password has not changed')
      throw createError(500, 'Something Went Wrong')
    }
    return
  } catch (err) {
    throw err
  }
}
