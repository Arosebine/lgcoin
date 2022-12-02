const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');
const sendEmail = require('../utils/emailsender');
const Transaction = require('../models/transaction.model');
const referralCodeGenerator = require('referral-code-generator');





exports.userSignup = async (req, res) => { 
    try {
        const { username, first_name, last_name, email, password } = req.body;
        console.log(req.body);
        // validation
        if (!( username && first_name && last_name && email && password )) {
            res.status(400).send("All input is required");
        };
        const bankAcct = Math.floor(Math.random() * 10000000000);
        // const pic = await cloudinary.uploader.upload(req.file.path);

        const user = await User.create({ 
          username,
          wallet: bankAcct,
          first_name, 
          last_name,          
          email,
          password,
         });
         await sendEmail({
           email: user.email,
           subject: `${user.first_name}, Verify your email`,
           message: `the link ${process.env.EMAIL_URL}/${user.id}, <br>
                       Kindly click on the link to verify your email`
                   
         });
        res.status(201).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
        console.log(err);
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const id  = req.params.id;
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not found',
                data: {
                    user,
                },
            });
          };
          // update the user's status 
           await User.findByIdAndUpdate(
            { _id: user._id 
              
            },
            { $set: { status: 'active' } },
            { new: true }        
            );
            await sendEmail({
                email: user.email,
                subject: 'Account verification successful',
                message: `Your account has been verified successfully. You can now proceed to login
                <br>
                <div>
                    <h1>Hello ${user.first_name}</h1>
                    <h3>Username: ${user.username} </h3>
                    <h3>Wallet Number: ${user.wallet} </h3>
                    <h3>Wallet Balace: ${user.wallet_balance} </h3>
                    <h3>Referral Code: ${user.referralCode} </h3>
                    <p>You can use your referral code to invite your friends and colleagues and earns N1,200 and your wallet will be credited within 24hrs if the referral successfully subscribe.</p>
                    </div>`              
              });
        res.status(200).json({
            status: 'success',            
            message: 'User verified successfully',
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
     // check if status is pending
    if (checkUser.status === 'pending') {
      return res.status(400).json({ message: 'Your account is still pending, check your email box to verify your email' });
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
      expiresIn: '1h',
    });
    // store token in cookie ====> web browser local storage
    res.cookie('access-token', token);
    res.status(200).json({ message: 'user logged in successfully', user: checkUser, token: token });
      
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
    const id = req.params.id;
    const user = await User.find({ _id: id });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    const { image } = req.body;
    const pic = await cloudinary.uploader.upload(req.file.path);
    const imageUser = await User.findByIdAndUpdate(
      { _id: id,
         image: pic.secure_url
     },
     { new: true }
    );
    res.status(200).json({ message: 'image updated successfully', imageUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



// update the password
exports.updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById({_id: id });
    if (!user) {
      throw new Error('user does not exist');
    }
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatePassword = await User.findByIdAndUpdate(
      { _id: id, 
        password: hashedPassword
      },
      
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Your password has been updated successfully", updatePassword });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: 'internal server error' });
  }
};







// view all the transactions 

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find(
      {},
      {
        _id: 0,
        createdAt: 0,
      }
    );
    res.status(200).json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
    return;
  }
};

    





