const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests - 1000 req per 1hr
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json());

// ROUTES

// Mounting the routers
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

// handling unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server!`, 404));
});

// err handling middleware
app.use(globalErrorHandler);
module.exports = app;
