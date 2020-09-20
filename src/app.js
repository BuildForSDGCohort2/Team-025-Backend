/* eslint-disable linebreak-style */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const flash = require('connect-flash');
const bodyParser = require('body-parser');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const User = require('./models/user');
const bloodbank = require('./models/bloodbank');
const hospital = require('./models/hospital');
const appointment = require('./models/appointment')

require('dotenv').config({
  path: path.join(__dirname, '/.env')
});

const app = express();

// Database Connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://lutitech:luti4148@bloodbank.fqjdo.mongodb.net/bloodnation?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
  console.log('Databasae Connected');
}).catch((err) => {
  console.log('error in connecting database');
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


app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token'];
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: 'JWT token has expired, please login to obtain a new one' });
    }
    res.locals.loggedInUser = await User.findById(userId); next();
  } else {
    next();
  }
});

/**  Passport Config */

app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);


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
