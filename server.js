const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;

// saving the server to variable so that it can be closed
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// handling unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // close the server
  server.close(() => {
    // shutting down the app with an err (1) - (optionall)
    process.exit(1);
  });
});
