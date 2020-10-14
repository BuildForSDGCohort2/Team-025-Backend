const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

exports.resetPasswordSuccess = async (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  const frontend = process.env.FRONTEND_DOMAIN;

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SENDINBLUE_USER,
      pass: process.env.SENDINBLUE_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  // this is the message body for mail when password change succcessfully
  const info = await transporter.sendMail({
    from: '"BloodNation 👻" <info@bloodnation.com>',
    to: user.email,
    subject: 'Your password has been changed',
    text: `${'Hello,\n\n' + 'This is a confirmation that the password for your account '}${
      user.email
    } has just been changed.\n`
  });

  await User.findByIdAndUpdate(user._id, { verificationToken: token });

  return info.messageId;
};
