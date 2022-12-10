const Transaction = require('../models/transaction.model');
const sendEmail = require('../utils/emailsender');
const User = require('../models/user.model');





// to receive event and Flutterwave data from convoy webhook
exports.lgcoinFlutterwave = async (req, res) => {
    try {
        const { event, data } = req.body;
        console.log(event);
        console.log(data);
        if(event === 'charge.completed'){
            const coinbuying = await Transaction.create({
                amount: data.amount,
                currency: data.currency,
                tx_ref: data.tx_ref,
                status: data.status,
                customer: data.customer.email,
                email: data.customer.email,
                phone_number: data.customer.phone_number,
                name: data.customer.name,
            });
            await sendEmail({
                email: coinbuying.email,
                subject: `${coinbuying.name}, Thank you for buying ${coinbuying.amount} ${coinbuying.currency} worth of LG Coin`,
                message: `Hello ${coinbuying.name}, <br>
                        You have successfully bought ${coinbuying.amount} ${coinbuying.currency} worth of LG Coin. <br>
                        Your transaction reference is ${coinbuying.tx_ref}. <br>
                        Kindly click on the link to verify your email`
            });
            // to update user wallet
            const user = await User.findOne({ email: coinbuying.email });
            const newWallet = user.wallet + coinbuying.amount;
            res.status(201).json({ coinbuying });
        }

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
        console.log(err);
    }
}







// to receive event and Paystack data from convoy webhook
exports.lgcoinPaystack = async (req, res) => {
    try {
        const { event, data } = req.body;
        console.log(event);
        console.log(data);
        if(event === 'charge.success'){
            const coinbuying = await Transaction.create({
                amount: data.amount,
                currency: data.currency,
                tx_ref: data.reference,
                status: data.status,
                customer: data.customer.first_name,
                email: data.customer.email,
                phone_number: data.customer.phone,
                name: data.customer.last_name,

            });
            await sendEmail({
                email: coinbuying.email,
                subject: `${coinbuying.name}, Thank you for buying ${coinbuying.amount} ${coinbuying.currency} worth of LG Coin`,
                message: `Hello ${coinbuying.name}, <br>
                        You have successfully bought ${coinbuying.amount} ${coinbuying.currency} worth of LG Coin. <br>
                        Your transaction reference is ${coinbuying.tx_ref}. <br>
                        Kindly click on the link to verify your email`
            });
            // to update user wallet
            const user = await User.findOne({ email: coinbuying.email });
            const newWallet = user.wallet + coinbuying.amount;
            res.status(201).json({ coinbuying });
        }

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
        console.log(err);
    }
}