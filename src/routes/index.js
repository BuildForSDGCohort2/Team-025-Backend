const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user');
const { index } = require('../controllers/index');
const { users } = require('../controllers/users');
const { login } = require('../controllers/login');
const { signup } = require('../controllers/signup');

const router = express.Router();

/* GET home page. */
router.get('/', index);

/* Get Signup Page */
router.get('/signup', users);

// SignUp post request
router.post('/signup', async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    password: req.body.password
  });

  await User.findOne({ name: newUser.name })
    .then(async (profile) => {
      if (!profile) {
        bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
          if (err) {
            console.log('Error is', err.message);
          } else {
            newUser.password = hash;
            await newUser
              .save()
              .then(() => {
                res.status(200).send(newUser);
              })
              .catch((err) => {
                console.log('Error is ', err.message);
              });
          }
        });
      } else {
        res.send('User already exists...');
      }
    })
    .catch((err) => {
      console.log('Error is', err.message);
    });
});

// Login routes

router.get('/login', login);


router.post('/login', async (req, res) => {
  const newUser = {};
  newUser.name = req.body.name;
  newUser.password = req.body.password;

  await User.findOne({ name: newUser.name })
    .then((profile) => {
      if (!profile) {
        res.send('User not exist');
      } else {
        bcrypt.compare(
          newUser.password,
          profile.password,
          async (err, result) => {
            if (err) {
              console.log('Error is', err.message);
            } else if (result == true) {
              res.send('User authenticated');
            } else {
              res.send('User Unauthorized Access');
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log('Error is ', err.message);
    });
});
router.get('/logout', index);


module.exports = router;
