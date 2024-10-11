const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

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

  res.status(200).render('product', {
    title: product.name,
    product,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login into your account'
  })
}