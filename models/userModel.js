const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validate.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // works on save & create
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

// only has the password if it has been modified (or is new)
userSchema.pre('save', async function (next) {
  // doc (current user)
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // deleting passworConfirm
  this.passwordConfirm = undefined;
  next();
});

// compare password instance
// instance method should not be wrapped in a global error handler
// since the global err handler would return a promise & potentially
// modify the intended behavior of password comparison
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// instance method available on all user docs
// check change password instance
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime())
  return JWTTimestamp < changedTimestamp
  } 
  // NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;