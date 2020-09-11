const express = require('express');
const passport = require('passport');
const User = require('../models/user')
const { index } = require('../controllers/index');
const { users } = require('../controllers/users');
const { login } = require('../controllers/login');
const { signup } = require('../controllers/signup');

const router = express.Router();

/* GET home page. */
router.get('/', index);

/* Get Signup Page */
router.get('/signup', users);

router.post('/signup', (req, res) => {
  const newUser = User({ email: req.body.email });
  User.signup(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash(error, err.message);
      res.render('signup');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('succeess', `Welcome to BloodNation${user.username}`);
      res.render('/profileForm');
    });
  });
});

router.get('/login', login);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}), (req, res) => {

});

router.get('/logout', index);


module.exports = router;
