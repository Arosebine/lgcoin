const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
 





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
    default: shortid.generate(),
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
    trim: true,
    complexity: {
      min: 8,
      max: 64
    }

  
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  
  image: {
    type: String,
    default: '',
  
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