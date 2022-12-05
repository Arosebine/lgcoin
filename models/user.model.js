const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const referralCodeGenerator = require('referral-code-generator');

 





const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5
  },
  wallet: {
    type: String,
  },
  referralCode: {
    type: String,
    default: referralCodeGenerator.custom('lowercase', 6, 8, 'lgcoins' ),
  
  },
   wallet_balance: {
    type: Number,
    default: '0',
  },
  first_name: {
    type: String,  

  },
  last_name: {
    type: String,
    
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64,
    
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  referral: {
    type: String,
  },
  status: {
         type: String,
         enum: ['pending', 'active'],
         default: 'pending',
      }, 
  
  image: {
    type: String,
    default: '',
  
  },
   referralCount: {
        type: Number,
        default: 0,
    },

}, {timestamps: true});


userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);    
        cb(null, isMatch);
    });
};


module.exports = mongoose.model("User", userSchema);