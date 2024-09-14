const express = require('express');
const morgan = require('morgan');

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// ROUTES

// Mounting the routers
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

// handling unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can not find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
