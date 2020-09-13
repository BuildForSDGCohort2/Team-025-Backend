const mongoose = require('mongoose');
const debug = require('debug')('app:db');

mongoose.set('useCreateIndex', true);

const dbName = process.env.DBNAME || 'bloodnation';
const url = process.env.MONGO_URI || `mongodb://localhost:27017/${dbName}`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

const dbConnection = mongoose.connect(url, options)
  .then(() => {
    debug(`Connected to ${dbName} Database successfully..`);
  })
  .catch((err) => {
    debug(`Error Connecting to Database: ${dbName}`);
    debug(`${err.stack}`);
  });

module.exports = dbConnection;
