/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendVerificationMail } = require('../services/mail');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email already exist',
        data: []
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    await sendVerificationMail(newUser);
    res.status(201).json({
      status: 'success',
      message: 'signup successfully',
      data: { ...newUser, accessToken }
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.reSendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email does not exist',
        data: []
      });
    }
    await sendVerificationMail(user);
    res.status(201).json({
      status: 'success',
      message: 'verification mail sent successfully',
      data: []
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.confirmVerification = async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email does not exist',
        data: []
      });
    }
    if (token !== user.verificationToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Verification token is not valid',
        data: []
      });
    }
    const { userId, exp } = await jwt.verify(token, process.env.JWT_SECRET);
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        status: 'error',
        message: 'Verification token has expired',
        data: []
      });
    }
    await User.findByIdAndUpdate(userId, { verificationToken: '', emailVerifiedAt: new Date() });
    res.status(201).json({
      status: 'success',
      message: 'verification successful',
      data: []
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email does not exist',
        data: []
      });
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Email does not exist',
        data: []
      });
    }
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    const data = { ...user._doc, accessToken };
    delete data.password;
    res.status(200).json({
      status: 'success',
      message: 'login successfully',
      data
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: 'User has been updated'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: 'User has been deleted'
    });
  } catch (error) {
    next(error);
  }
};
