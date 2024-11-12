const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// proxy
app.enable('trust proxy');

// setting a view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// implement CORS
app.use(cors());

app.options('*', cors());

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());
app.use(
  helmet(),
  // helmet.contentSecurityPolicy({
  //   directives: {
  //     defaultSrc: ["'self'"],
  //     scriptSrc: ["'self'", 'https://js.stripe.com'],
  //     frameSrc: ["'self'", 'https://js.stripe.com', 'https://vercel.live'],
  //     imgSrc: ["'self'", 'https://rui-orpin.vercel.app', 'data:'], // Allow images from Vercel and data URIs
  //     connectSrc: ["'self'", 'https://rui-orpin.vercel.app'],
  //   },
  // }),
);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; frame-src https://js.stripe.com; script-src 'self' https://js.stripe.com;",
  );
  next();
});

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

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());

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

// // test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.cookies);
//   next();
// });

// Add Content Security Policy to allow Stripe script
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com', 'https://vercel.live'],
    },
  }),
);

app.use(compression());

// Mounting the routers
app.use('/', viewRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// handling unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server!`, 404));
});

// err handling middleware
app.use(globalErrorHandler);
module.exports = app;
