const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

exports.resetPasswordmailer = async (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  const frontend = process.env.FRONTEND_DOMAIN;

  const link = `${frontend}/reset?token=${token}&email=${user.email}`;

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
    subject: 'Password Reset',
    html: `
        <p> You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p> Please click on the following link, or paste this into your browser to complete the process:
        <a href="${link}"> Reset</a></p>
        <p> If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `
  });

  await User.findByIdAndUpdate(user._id, { verificationToken: token });

  return info.messageId;
};
