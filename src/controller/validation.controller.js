const userValidation = require('../validation/auth.validation')
exports.signupUser = async (req, res, next) => {
  const { error } = await userValidation.registerUser().validate(req.body)
  if (error) return next(error)
  else next()
}

exports.loginUser = async (req, res, next) => {
  const { error } = await userValidation.loginUser().validate(req.body)
  if (error) return next(error)
  else next()
}

exports.forgetPassword = async (req, res, next) => {
  const { error } = await userValidation.forgetPassword().validate(req.body)
  if (error) return next(error)
  else next()
}

exports.verifyUser = async (req, res, next) => {
    const { error } = await userValidation.verifyEmail().validate(req.body);
if (error) return next(error)
else next()

}


exports.resetPassword = async (req, res, next) => {
  const { error } = await userValidation.resetPassword().validate(req.body)
if (error) return next(error)
else next()

}