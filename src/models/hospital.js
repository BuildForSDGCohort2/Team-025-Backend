const mongoose = require('mongoose');

const { Schema } = mongoose;

const HospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    lg: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    latitude: String,
    longitude: String,
    bloodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blood'
    },
    bloodOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bloodReceiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    availableBloodQuantity: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: new Date()
    },
    updatedAt: {
      type: Date,
      default: new Date()
    },
    appointments: [{
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    }],
    requests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request'
    }]
  }
);
module.exports = mongoose.model('Hospital', HospitalSchema);
