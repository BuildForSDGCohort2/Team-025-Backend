const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserRole = {
  User: 'user',
  Hospital: 'hospital',
  Admin: 'admin'
};

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
  state: {
    type: String,
    default: ''
  },
  lg: {
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
  // role: {
  //   type: String,
  //   default: 'user',
  //   enum: ['user', 'hosipital', 'admin']
  // },
  role: {
    type: UserRole,
    default: UserRole.User
  },
  accessToken: {
    type: String
  },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    }
  ]
});

const User = mongoose.model('User', UserSchema);

// module.exports = User;

module.exports = {
  User,
  UserRole
};
