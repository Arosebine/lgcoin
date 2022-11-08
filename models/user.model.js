const mongoose = require('mongoose');
const bcrypt = require('bcrypt');





const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    unique: false
  },
  last_name: {
    type: String,
    required: true,
    unique: false
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
    unique: true,   
  },
  role: {
    type: String,
    required: false,
    enum: ['user', 'admin'],
    default: 'user',
    index: true,
  },
  profile: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: {},
    index: true,
  },
  image: {
    type: String,
    default: '',
    index: true,
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