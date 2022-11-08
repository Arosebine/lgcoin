const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');





exports.userSignup = async (req, res) => { 
    try {
        const { first_name, last_name, email, image, password } = req.body;
        console.log(req.body);
        // validation
        if (!(first_name && last_name && email && password && image)) {
            res.status(400).send("All input is required");
        };

        const pic = await cloudinary.uploader.upload(req.file.path);

        const user = await User.create({ 
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};


exports.userLogin = async (req, res) => {
  const { password, email } = req.body;
  try {
    // validation
    if (!(password && email)) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    // check if user exist in database
    const checkUser = await User.findOne({ email: email });
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


exports.isAuth = async (req, res, next) => {
    try {
        // 0      1
        // Bearer token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
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


