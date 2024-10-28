const multer = require('multer');
const sharp = require('sharp');
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

// to test if the file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.array('images', 3);

exports.resizeProductImages = (req, res, next) => {
  console.log(req.files);
  next();
};

exports.aliasCostlyProducts = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-price';
  req.query.fields = 'name,price,description';
  next();
};

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,description';
  next();
};

exports.getAllProducts = factory.getAll(Product);

exports.getProduct = factory.getOne(Product, { path: 'reviews' });

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 3.1 } },
    },
    {
      $group: {
        _id: { $toUpper: '$brand' },
        numProducts: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // converting a string to a no.
  const year = req.params.year * 1;

  const plan = await Product.aggregate([
    { $unwind: '$productTimeSold' },
    {
      $match: {
        productTimeSold: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$productTimeSold' },
        numProductStats: { $sum: 1 },
        products: { $push: '$name' },
      },
    },
    {
      // months to be displayed
      $addFields: { month: '$_id' },
    },
    {
      // desc order
      $sort: { numProductStats: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
