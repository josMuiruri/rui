const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

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
    // shutting down the app with an err (1)
    process.exit(1);
  });
});
