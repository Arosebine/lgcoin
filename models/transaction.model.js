const mongoose = require('mongoose');




const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },    
    amount: {
        type: String,
    }, 
    currency: {
        type: String,
    }, 
    tx_ref: {
        type: String,
    }, 
    status: {
        type: String,
    }, 
    customer: {
        type: String,
    }, 
    email: {
        type: String,
    }, 
    phone_number: {
        type: String,
    }, 
    name: {
        type: String,
    },
    user: {
        type: String,
    },



},
{
    timestamps: true,
}
);

    


module.exports = mongoose.model('Transaction', transactionSchema);