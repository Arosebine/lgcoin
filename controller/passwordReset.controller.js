const User  = require("../models/user.model");
const Token = require("../models/forgotPass.model");
const sendEmail = require("../utils/emailsender");
const crypto = require("crypto");
const Joi = require("joi");





exports.passwordReset = async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        
           const token = await new Token({
                userId: user._id,
                email: req.body.email,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail({
            email: user.email,
            subject: `${user.first_name} ${user.last_name} Requested Reset Password Successfully`,
            message: `<div>
                   <h1>HELLO ${user.first_name}</h1>
                   <h2>"password reset", ${link} </h2><br><br>
                   <p>If you did not request a password reset, please ignore this email.</p>
                   </div>`,
                   });
                   
        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occurred");
        console.log(error);
    }
};




exports.assignedPassword = async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.send("password reset successfully.");
    } catch (error) {
        res.send("An error occurred");
        console.log(error);
    }
};



// reset password 
exports.resetPassword = async (req, res) => {
    try {
        const schema = Joi.object({
            currentPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).send("invalid link or expired");

        const validPassword = await user.comparePassword(
            req.body.currentPassword
        );
        if (!validPassword) return res.status(400).send("invalid password");

        user.password = req.body.newPassword;
        await user.save();
    

        res.send("password reset successfully.");
    } catch (error) {
        res.send("An error occurred");
        console.log(error);
    }
}