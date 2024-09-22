const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// if only a user exists & the password is correct
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // read the email & password from the body
  // const { email, password } = req.body;
  const { email, password } = req.body;

  // 1) check if email & password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) check if user exists && password is correct
  // selecting the password
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password',
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    // security measure(no reveling the incorrect; password or email)
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) everything is ok; send token to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token & checking if present
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token no longer exist', 401),
    );
  }

  // check if user changed password
  if (currentUser.ChangedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password was recently changed! Please log in again.', 401),
    );
  }
  // Grant access to the protect route
  req.user = currentUser;
  next();
});
