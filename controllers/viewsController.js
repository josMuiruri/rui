const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const products = await Product.find();

  res.status(200).render('overview', {
    title: 'All Products',
    products,
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  res.status(200).render('product', {
    title: 'Product',
  });
});
