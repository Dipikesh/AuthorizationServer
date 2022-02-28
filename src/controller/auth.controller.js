const mailerService = require('../services/mailer')
const authService = require('../services/auth.services')
const genOtp = require('../utils/generator');
const tokenServices = require('../services/token.services')

//This Function takes request and let services interact with core code
//  and it send the response back to user
exports.signupUser = async (req, res, next) => {
  try {
    console.log('body', req.body)

    const otp = await genOtp.value(6)
    const result = await authService.signupUser(req.body)
    const otpSave = await authService.saveOtp(req.body.email, otp)
    const sendOtp = await mailerService.sendEmail(
      req.body.email,
      otp,
      'Email Verification'
    )
    res.status(201).json({
      success: true,
      message: `Otp has been sent to ${req.body.email}`
    })
  } catch (err) {
    next(err)
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body)
    if (user) {
        const token = await tokenServices.signAccessToken(user._id);
      if (token) {
        res.cookie('authorization', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, 
          httpOnly: true
        })
        res
          .status(200)
          .json({ id:user._id,message: 'You are now logged in' })
      }
    }
  } catch (err) {
    next(err)
  }
}

exports.forgetPassword = async (req, res, next) => {
    try {
        const user = await authService.isUserExist(req.body.email);
        const token = await tokenServices.signAccessToken(user._id);
        const saveTokenToDb = await authService.saveToken(user._id, token);
        const resetLink = `http://localhost:8000/reset-link/${token}`
        await mailerService.sendEmail(req.body.email,resetLink,"Reset Password");

        
    } catch (err) {
        next(err);
  }
}

exports.verifyUser = async (req, res, next) => {
  try {
    const email = await authService.verifyUser(req.body)
    res.status(200).json({
      message: 'Email verified successfully'
    })
  } catch (err) {
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        console.log("token is", token);
        const { password } = req.body;
        const result = await authService.resetPassword(token,password);
        res.status(200).json({
           "message" : "Password has been reset successfully"
       })
    }
    catch (err) {
        next(err);
    }
}
