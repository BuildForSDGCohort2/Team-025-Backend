const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.resetPasswordmailer = async (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  const frontend = process.env.FRONTEND_DOMAIN;

  const link = `${frontend}/verification/email?token=${token}&email=${user.email}`;

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
    from: 'passwordreset@demo.com',
    to: user.email,
    subject: 'Node.js Password Reset',
    text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
           + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
           + 'http://' + 'localhost:4000' + '/api/v1/recover/'}${token}\n\n`
           + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  });

  await User.findByIdAndUpdate(user._id, { verificationToken: token });

  return info.messageId;
};
