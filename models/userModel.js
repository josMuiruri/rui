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
});

// when updating & creating password
userSchema.pre('save', async function (next) {
  // doc (current user)
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // deleting passworConfirm
  this.passwordConfirm = undefined;
  next();
});

// instance method available on all user docs
userSchema.methods.correctPassword = catchAsync(
  async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
