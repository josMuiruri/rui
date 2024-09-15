const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Errors to be sent to the client
const sendErrorProd = (err, res) => {
  // operational errs
  if (isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknown errors: don't leak error details
  } else {
    // log error
    console.error('Error', err);

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
