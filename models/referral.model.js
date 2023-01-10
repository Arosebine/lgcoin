const mongoose = require('mongoose');





const referralSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
    },
    referralCode: {
        type: String,
    },
    username: {
        type: String,
    },
    
},
{
    timestamps: true,
}
);


module.exports = mongoose.model('Referral', referralSchema);

