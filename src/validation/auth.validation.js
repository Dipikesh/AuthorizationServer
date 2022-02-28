const Joi = require(`@hapi/joi`)

module.exports = {
  verifyEmail: () => {
    return Joi.object({
      email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
          'string.email': `Invalid Email`,
          'any.required': `Email is required`
        }),
      otp: Joi.string()
        .required()
        .max(8)
        .messages({
          'any.required': `OTP is required`
        })
    })
  },
  registerUser: () => {
    return Joi.object({
      name: Joi.string()
        .required()
        .messages({
          'any.required': `name is Required!`,
          'string.base': `name should be type of 'text'`
        }),
      email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
          'string.email': `Invalid Email`,
          'any.required': `Email is required`
        }),
      password: Joi.string()
        .required()
        .messages({
          'any.required': `Password is Required!`
        }),
      confirmPassword: Joi.ref(`password`)
    })
  },
  loginUser: () => {
      return Joi.object({
        email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
          'string.email': `Invalid Email`,
          'any.required': `Email is required`
        }),
        password: Joi.string()
          .required()
          .messages({
            'any.required': `Password is Required!`
          })
    })
        
  },
  forgetPassword:()=> {  return Joi.object({
        email: Joi.string()
          .required()
          .messages({
            'any.required': `Email is Required!`
          })
    })
        
  },
  resetPassword: () => {
    return Joi.object({
      password: Joi.string().required().message({ 'any.required': 'Password is Required' }),
      confirmPassword: Joi.ref(`password`)

    })
  }

}
