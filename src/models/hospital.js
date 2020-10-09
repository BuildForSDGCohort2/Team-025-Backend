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
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    appointments: [{
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    }]
  }
);

const Hospital = mongoose.model('Hospital', HospitalSchema);

module.exports = Hospital;
