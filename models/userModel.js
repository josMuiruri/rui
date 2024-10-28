const crypto = require('crypto');
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
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'cashier', 'chief-cashier', 'admin'],
    default: 'user',
  },
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
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

// hook -update changedPassword
userSchema.pre('save', function (next) {
  // if pass property is not modified do not manipulate changedPasswordAt
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// query middleware
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
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
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime());
    return JWTTimestamp < changedTimestamp;
  }
  // NOT changed
  return false;
};

// generate password instance
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // send plain text to the user
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
