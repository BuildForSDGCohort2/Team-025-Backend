const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['donor', 'hosipital', 'admin']
  },
  accessToken: {
    type: String
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
