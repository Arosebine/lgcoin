const mongoose = require('mongoose');




const forgotPassSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,

    },
    token: {
        type: String,
        lowercase: true,
    },
    expiredAt: {
        type: Date,
        default: Date.now(),
    }
}, {timestamps: true});



module.exports = mongoose.model('ForgotPass', forgotPassSchema);