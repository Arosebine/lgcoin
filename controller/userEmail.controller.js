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






exports.search_sales = async (req, res) => {
  try {
    const query = {
      title: req.query.title,
      product: req.query.product,
      brand: req.query.brand,
      category: req.query.category,
    };
    const cursor = Item.find(query);
    const items = await cursor.toArray();
    res.send(items);
  } catch (error) {
    console.log(error);
  }
};




// to know the food Item selling fast in the cart
exports.cart_item = async (req, res) => {

  try {
    const cart = req.session.cart;
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(400).send("Invalid item");
    }
    else {
      for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === itemId) {
          cart[i].quantity++;
          cart[i].save();
          res.send("item added in the cart");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};




// to know the food Item selling fast in the cart
exports.cart_delete = async (req, res) => {

  try {
    const cart = req.session.cart;
    const itemId = req.params.itemId;
    const

     item = await Item.findById(itemId);

     for (let i = 0; i < cart.length; i++) {

      if (cart[i]._id === itemId) {
        cart.splice(i, 1);
        cart.save();
        res.send("item deleted from the cart");
      }
    }
  } catch (error) {
    console.log(error);
  }
};



// to update the quantity of the cart item
exports.cart_update = async (req, res) => {

  try {
    const cart = req.session.cart;
    const itemId = req.params.itemId;
    const

     item = await Item.findById(itemId);

     for (let i = 0; i < cart.length; i++) {

      if (cart[i]._id === itemId) {
        cart[i].quantity--;
        cart[i].save();
        res.send("item updated in the cart");
      }
    }
  } catch (error) {

    console.log(error);
  }
};



//to know the cart items quantity
exports.cart_quantity = async (req, res) => {

  try {
    const cart = req.session.cart;
    res.send(cart);
  } catch (error) {

    console.log(error);
  }
};



// to know the total cost of the cart items
exports.cart_totalCost = async (req, res) => {

  try {
    const cart = req.session.cart;
    const

     totalCost = 0;

     for (let i = 0; i < cart.length; i++) {

      if (cart[i].quantity > 0) {
        totalCost += cart[i].price * cart[i].quantity;
      }
    }

    res.send(totalCost);
  } catch (error) {

    console.log(error);
  }
};



//to delete a cart item
exports.cart_delete = async (req, res) => {

  try {
    const cart = req.session.cart;
    const itemId = req.params.itemId;
    for (let i = 0; i < cart.length; i++) {

      if (cart[i]._id === itemId) {
        cart[i].delete();
        res.send("item deleted from the cart");
      }
    }
  } catch (error) {

    console.log(error);
  }
};



// to clear the cart
exports.clear_cart = async (req, res) => {

  try {
    req.session.cart = [];
    res.send("cart cleared");
  } catch (error) {

    console.log(error);
  }
}