

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;

// Path: models\user.model.js
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            }
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
}
);

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
}
);


userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
}
);

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

userSchema.methods.sendPasswordResetEmail = async function () {

    const resetToken = this.createPasswordResetToken();

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: this.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });

        return true;
    } catch (err) {
        return false;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;














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



