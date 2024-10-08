const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'A product name should not exceed 50 characters '],
      minlength: [5, 'A product name should not be less than 5 characters '],
    },
    slug: String,
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 1.2,
      max: [5, 'rating must be below or equal to 5'],
      min: [1, 'rating must be above or equal 1.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    // summary: {
    //   type: String,
    //   trim: true,
    //   required: [true, 'A product must have a summary'],
    // },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'A product must have a brand'],
    },
    cashiers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    productTimeSold: {
      type: Date,
      // required: [true, 'The time when a product was sold must be present'],
    },
    salesInMonth: {
      type: String,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// not saved to db
// productSchema.virtual('salesInWeeks').get(function () {
//   return this.monthlySale / 7;
// });

// indexing
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

// virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Doc middleware
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cashiers',
    select: '-__v -passwordChangedAt',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
