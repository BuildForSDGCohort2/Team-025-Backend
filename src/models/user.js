/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(

  {
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    bloodgroup: {
      type: String,
      required: true
    },
    address: {
      type: String

    }
  }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
