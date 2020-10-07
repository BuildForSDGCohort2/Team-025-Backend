/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendVerificationMail } = require('../services/mail');
const { Request } = require('../models/request');
const Appointment = require('../models/appointment');


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
    return res.status(201).json({
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
        message: 'invalid credentials',
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

exports.getStatistics = async (req, res, next) => {
  const requests = await Request.countDocuments({
    bloodReceiverId: res.locals.loggedInUser._id
  });
  const donations = await Appointment.countDocuments({
    user: res.locals.loggedInUser._id
  });
  const lastDonation = await Appointment.findOne({
    user: res.locals.loggedInUser._id
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: {
      bloodGroup: res.locals.loggedInUser.bloodGroup,
      requests,
      donations,
      lastDonation
    }
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
    // const user = await User.findById(userId);
    res.status(200).json({
      status: 'success',
      message: 'User has been updated',
      data: update
    });
  } catch (error) {
    // next(error);
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
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


exports.recover = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: `The email address ${req.body.email} is not associated with any account. `,
        date: []
      });
    }


    // Save the updated user object
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `A reset email has been sent to ${user.email}.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.reset = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Password reset token is invalid or has expired.',
        date: []
      });
    }

    // Redirect user to form with the email address
    res.render('reset', { user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Password reset token is invalid or has expired.',
        date: []
      });
    }

    // Set the new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isVerified = true;

    // Save the updated user object
    await user.save();


    res.status(200).json({
      status: 'success',
      message: 'Your password has been updated.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};