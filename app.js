const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// setting a view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// serving static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Data Sanitization against NoSQL query injection - req.body,
// req.queryString & req.params filter out all the sign ($ and .)
app.use(mongoSanitize());

// Data sanitization against XSS - clean user input from malicious html code
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['price', 'quantity', 'ratingsQuantity'],
  }),
);

// ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base');
})

// Mounting the routers
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// handling unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server!`, 404));
});

// err handling middleware
app.use(globalErrorHandler);
module.exports = app;
