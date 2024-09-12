const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  ratingsAverage: {
    type: Number,
    default: 0.0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A product must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
