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
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  emailVerifiedAt: {
    type: Date
  },
  verificationToken: {
    type: String
  },
  bloodVerifiedAt: {
    type: Date
  },
  bloodVerifiedBy: {
    type: String,
    default: ''
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  active: {
    type: Number,
    default: 1
  },
  role: {
    type: String,
    default: 'donor',
    enum: ['donor', 'hosipital', 'admin']
  },
  accessToken: {
    type: String
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
