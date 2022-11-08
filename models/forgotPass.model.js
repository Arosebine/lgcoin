const mongoose = require('mongoose');




const forgotPassSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
}, {timestamps: true});



module.exports = mongoose.model('ForgotPass', forgotPassSchema);