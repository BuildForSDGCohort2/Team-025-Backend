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
    appointments: [{
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    }]
  }
);
module.exports = mongoose.model('Hospital', HospitalSchema);
