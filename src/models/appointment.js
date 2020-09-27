const mongoose = require('mongoose');

const { Schema } = mongoose;
const model = mongoose.model.bind(mongoose);
const { ObjectId } = mongoose.Schema.Types;

const AppointmentSchema = new Schema({
  comment: String,
  progress: { type: String, default: '0' },
  status: {
    type: String,
    default: 'start',
    enum: ['start', 'accepted', 'rejected', 'pending', 'completed']
  },
  date: Date,
  user: { type: ObjectId, ref: 'User' },
  hospital: { type: ObjectId, ref: 'Hospital' },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

const Appointment = model('Appointment', AppointmentSchema);

module.exports = Appointment;
