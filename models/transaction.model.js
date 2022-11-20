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
    customer_email: {
        type: String,
    }, 
    customer_phone: {
        type: String,
    }, 
    customer_name: {
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