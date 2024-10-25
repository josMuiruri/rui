const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // product data from collection
  const products = await Product.find();

  // render tempalte using product data
  res.status(200).render('overview', {
    title: 'All Products',
    products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!product) {
    return next(new AppError('There is no product with that name', 404));
  }

  res.status(200).render('product', {
    title: product.name,
    product,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('sign-up', {
    title: 'Sign-up',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
