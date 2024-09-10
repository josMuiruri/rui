const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABESE.replace(
  '<PASSWORD>',
  process.env.DATABESE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log('DB connection successful'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`App running on port {port}`);
})