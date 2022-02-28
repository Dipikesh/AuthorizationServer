const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        hash: mongoose.Schema.Types.String,
        salt: mongoose.Schema.Types.String
    },
    isVerified: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    resetToken: {
        type: mongoose.Schema.Types.String
    }
});

exports.userSchema = mongoose.model('user', schema);
