const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');
const sendEmail = require('../utils/emailsender');





exports.userSignup = async (req, res) => { 
    try {
        const { username, first_name, last_name, email, image, password } = req.body;
        console.log(req.body);
        // validation
        if ((username, first_name && last_name && email && password && image)) {
            res.status(400).send("All input is required");
        };
        const bankAcct = Math.floor(Math.random() * 10000000000);
        const pic = await cloudinary.uploader.upload(req.file.path);

        const user = await User.create({ 
          username,
          wallet: bankAcct,
          first_name, 
          last_name, 
          email,
          image: pic.secure_url, 
          password,
         });
        res.status(201).json({
            status: 'success',
            data: {
                user,
            },
        });
        await sendEmail({
          email: user.email,
          subject: `${user.first_name} Registered Successfully`,
          message: `<div>
                   <h1>Hello ${user.first_name}</h1>
                   <h2>Username: ${user.username} </h2><br><br>
                   <h2>Wallet Number: ${user.wallet} </h2><br><br>
                   <h2>Wallet Balace: ${user.wallet_balance} </h2><br><br>
                   <h2>Referral Code: ${user.referralCode} </h2><br><br>
                   <p>You can use your referral code to invite your friends and colleagues and earns N1,200 and your wallet will be credited within 24hrs if the referral successfully subscribe.</p>
                   </div>`
                  
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
        console.log(err);
    }
};


exports.userLogin = async (req, res) => {
  const { password, username } = req.body;
  try {
    // validation
    if (!(password && username)) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    // check if user exist in database
    const checkUser = await User.findOne({ username: username });
    // if user doesn't exist throw error
    if (!checkUser) {
      return res.status(404).json({ message: 'user not found' });
    }
    // if user exist in database, check if user password is correct
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    // if user password is not correct throw error ==> invalid credentials
    if (!checkPassword) {
      return res.status(400).json({ message: 'invalid credentials' });
    }
    // if user password is correct tokenize the payload
    const payload = {
      _id: checkUser._id,
    };
    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '2d',
    });
    // store token in cookie ====> web browser local storage
    res.cookie('access-token', token);
    return res
      .status(202)
      .json({ message: 'User logged in successfully', token: token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: 'internal server error' });
  }
};


//query all and remove _id
exports.queryAll = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { _id: 0, __v: 0, createdAt: 0, password: 0 }
    );
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// query all and search using regex by name
exports.queryAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { first_name: { $regex: req.params.first_name, $options: 'i' } },
      { _id: 0 }
    );
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.isAdmin = async (req, res, next) => {

    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'You are not an admin' });
    }
    next();
};

exports.userLogout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
};


// update the image 
exports.updateImage = async (req, res) => {
  try {
    const pic = await cloudinary.uploader.upload(req.file.path)
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { image: pic.secure_url },
      { new: true }
    );
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// update the password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { password: req.params.password },
      { new: true }
    );
    res.status(200).json({ user });

    // remove token from database
    const token = await jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '2d',
      }
    );

    // store token in cookie ====> web browser local storage
    res.cookie('access-token', token);

    return res
     .status(202)
     .json({ message: 'User updated the password successfully', token: token });

  } catch (err) {
    console.log(err);
    return res
     .status(500)
     .json({ error: err.message, message: 'internal server error' });
  }
};



// 