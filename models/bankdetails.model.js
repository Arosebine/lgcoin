const mongoose = require('mongoose');




const bankSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        unique: true, 
    },
    account_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5
    },
    account_number: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5
    },
    bank_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,

    },
    account_type: {
        type: String,
        required: [true, 'account type is required' ],
        trim: true,
        lowercase: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
});



module.exports = mongoose.model('Bank_detail', bankSchema);
