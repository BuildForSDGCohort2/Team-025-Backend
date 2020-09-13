/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

UserSchema = new mongoose.Schema(

{
  Name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required:true
  },
  bloodgroup:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  }

});

const UserRole = {
  BloodDonor: "BloodDonor",
  BloodBank: "BloodBank",
  Hospital: "Hospital",
  Admin: "Admin"
};

// const UserSchema = new mongoose.Schema(
//   {
//     "schema_version": "2",
//     email: {
//       type: String,
//       unique: true,
//       required: "Your email is required",
//       lowercase: true,
//       maxlength: 64,
//       trim: true
//     },

//     password: {
//       type: String,
//       required: "Your password is required",
//       maxlength: 100
//     },

//     firstName: {
//       type: String,
//       required: "First Name is required",
//       trim: true,
//       maxlength: 64
//     },

//     lastName: {
//       type: String,
//       required: "Last Name is required",
//       trim: true,
//       maxlength: 64
//     },

//     bloodGroup:{
//       type: String,
//       required: true
//     },

//     description: {
//       type: String,
//       trim: true,
//       maxlength: 255
//     },
//     address: {
//       type: String,
//       trim: true,
//       maxlength: 255
//     },
//     country: {
//       type: String,
//       trim: true,
//       maxlength: 64
//     },
//     state: {
//       type: String,
//       trim: true,
//       maxlength: 64
//     },
//     city: {
//       type: String,
//       trim: true,
//       maxlength: 64
//     },
//     phoneNumber: {
//       type: String,
//       trim: true,
//       maxlength: 32
//     },
//     postalCode: {
//       type: String,
//       trim: true,
//       maxlength: 12
//     },
//     isVerified: {
//       type: Boolean,
//       default: false
//     },

//     role: {
//       type: UserRole,
//       default: UserRole.BloodDonor
//     },

//     resetPasswordToken: {
//       type: String,
//       required: false
//     },

//     resetPasswordExpires: {
//       type: Date,
//       required: false
//     }
//   },
//   { timestamps: true }
// ).set("toJSON", {
//   transform(doc, ret, options) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//   }
// });

// module.exports = mongoose.model("user", UserSchema);

module.exports = {
  User: mongoose.model("User", UserSchema),
  UserRole
};
