const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  otp: {
    hash: mongoose.Schema.Types.String,
    salt: mongoose.Schema.Types.String
    },
    createdAt: Date,
    expiresAt: Date
})

exports.otpSchema = mongoose.model('otps', schema);
