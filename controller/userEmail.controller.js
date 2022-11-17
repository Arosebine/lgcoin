const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');
const sendEmail = require("../utils/emailsender");
const crypto = import("crypto");
const Token = require("../models/forgotPass.model");
const ShortUniqueId = require('short-unique-id');





exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, image, password } = req.body;
        console.log(req.body);
        // validation
        if ((first_name && last_name && email && password && image)) {
            res.status(400).send("All input is required");
        };

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res.status(400).send("User with given email already exist!");
      const bankAcct = Math.floor(Math.random() * 10000000000);
      const pic = await cloudinary.uploader.upload(req.file.path);

    const user = await User.create({
      wallet: bankAcct,
      first_name,
      last_name,
      email,
      password,
      image: pic.secure_url,
    });
    const uid = new ShortUniqueId();

    let token = await new Token({
      userId: user._id,
      email: req.body.email,
      token:  uid.stamp(32),
    }).save();

    const message = `${process.env.CLIENT_URL}/user/verify/${user.id}/${token.token}`;
    await sendEmail({
            email: token.email,
            subject: `${user.first_name} verify your email`,
            message: `<div>
                   <h1>Hello ${user.first_name}</h1>
                   <h2>"Verify your email", ${message} </h2><br><br>
                   <p>It shows that you have just registered on our platform but If you did not, please ignore this email.</p>
                   </div>`,
                   });

    res.send("An Email sent to your account please verify");
  } catch (error) {
    console.log(error);
  }
};



exports.verify_token = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
};