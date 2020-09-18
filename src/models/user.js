/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }
);

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
