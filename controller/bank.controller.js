const Bank = require('../models/bankdetails.model');
const User = require('../models/user.model');






exports.bankSignup = async (req, res) => {
    try {
        const { username, account_name, account_number, bank_name, account_type } = req.body;
        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'User does not exist',
            })};      
    
        const bank = await Bank.create(
            {
                account_name,
                username,
                account_number,
                bank_name,
                account_type,
                user: user.id,
            }
        );
        res.status(201).json({
            status: 'success',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail,  You have already registered your bank details, if not correct. kindly update it',
            message: err.message,
        });
       
    }
};



exports.bankDetails = async (req, res) => {
    try {
        const bank = await Bank.find({});
        res.status(200).json({
            status: 'success',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
       
    }
};



// get bank details by username
exports.getBankDetailsByUsername = async (req, res) => {
    try {
        const username  = req.params.username;
        const bank = await Bank.find
        ({
            username: username
        });
        res.status(200).json({
            status: 'success',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });

    }
};




exports.updateBankDetails = async (req, res) => {

    try {
        const { username, account_name, account_number, bank_name, account_type } = req.body;
        const bank = await Bank
            .findOneAndUpdate(
                { 
                    username: username
                },
                {
                    account_name,
                    account_number,
                    bank_name,
                    account_type,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        res.status(200).json({
            status: 'success',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
       
    }
}



exports.deleteBankDetails = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username: username })
        const bank = await Bank
            .findOneAndDelete(
                { 
                    username: username
                }
            );
        res.status(200).json({
            status: 'successfully deleted',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
       
    }
}




exports.getBankDetails = async (req, res) => {
    try {
        const bank = await Bank.find();
        res.status(200).json({
            status: 'success',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
       
    }
}




exports.updateBankDetailsById = async (req, res) => {
    
        try {
            const { account_name, account_number, bank_name } = req.body;
            const bank = await Bank
                .findOneAndUpdate(
                    { _id: req.params.id
                    },
                    {
                        account_name,
                        account_number,
                        bank_name,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            res.status(200).json({
                status: 'success',
                data: {
                    bank,
                },
            });
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err.message,
            });
        }
    }




exports.deleteBankDetailsById = async (req, res) => {
    try {
        const bank = await Bank
            .findOneAndDelete(
                { _id: req.params.id
                }
            );
        res.status(200).json({
            status: 'success',
            data: {
                bank,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
       
    }
}



// Path: models\bankdetails.model.js
const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    account_name: {
        type: String,
        required: [true, 'Please enter your account name'],
    },
    account_number: {
        type: String,
        required: [true, 'Please enter your account number'],
    },
    bank_name: {

        type: String,
        required: [true, 'Please enter your bank name'],
    },
    account_type: {
        type: String,
        required: [true, 'Please enter your account type'],
    },
    user: {

        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Bank details must belong to a user'],
    },
});



