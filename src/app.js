/* eslint-disable linebreak-style */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const User = require('./models/user');
const routes = require('./routes/index');

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require('admin-bro-mongoose'))

const router = express.Router();
routes(router);

require('dotenv').config();

const app = express();

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => {
  console.log('Database Connected Successfully');
}).catch((err) => {
  console.log('error in connecting database', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(cors());

/**  Passport Config */

app.use(passport.initialize());


app.use('/api/v1', router);
// app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
