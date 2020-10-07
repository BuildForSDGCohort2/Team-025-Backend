const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.sendVerificationMail = async (user) => {

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

  const info = await transporter.sendMail({
    from: '"BloodNation 👻" <info@bloodnation.com>',
    to: user.email,
    subject: 'Welcome to BloodNation',
    // text: 'Hello world?',
    html: `
    <h2 style="color: red;">Welcome to BloodNation</h2>
    <p>Hey there,</p>

    <p>My name is Dino, and I'm the Co-Founder of BloodNation.</p>

    <p>I couldn't be happier to welcome you to the BloodNation community and to help you start donating blood across the nation.</p>

    <p>No matter the distance or state you reside, you can be sure that you'll find the bloodbank or hospital that you need... and maybe a few that you didn't even know you needed yet!</p>

    <p>Click this link to complete your registration <a href="${link}">Confirm Registration</a></p>

    <p>Regards<br/>Dino Rhythms</p>
    `
  });

  await User.findByIdAndUpdate(user._id, { verificationToken: token });

  return info.messageId;
};



/* send email
const subject = 'Password change request';
const to = user.email;
const from = process.env.FROM_EMAIL;
const link = `http://${req.headers.host}/api/auth/reset/${user.resetPasswordToken}`;
const html = `<p>Hi ${user.username}</p>
              <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

await sendEmail({
  to, from, subject, html
});

res.status(200).json({ message: `A reset email has been sent to ${user.email}.` });
} catch (error) {
res.status(500).json({ message: error.message });
}
};


const subject = 'Your password has been changed';
    const to = user.email;
    const from = process.env.FROM_EMAIL;
    const html = `<p>Hi ${user.username}</p>
                  <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`;

    await sendEmail({
      to, from, subject, html
    });
*/

