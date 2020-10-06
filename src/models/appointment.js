const mongoose = require('mongoose');

const { Schema } = mongoose;
const model = mongoose.model.bind(mongoose);
const { ObjectId } = mongoose.Schema.Types;

const AppointmentSchema = new Schema({
  comment: String,
  progress: { type: String, default: '25' },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected', 'approved', 'completed']
  },
  date: Date,
  type: {
    type: String,
    enum: ['bank', 'receiver']
  },
  user: { type: ObjectId, ref: 'User' },
  beneficiary: { type: ObjectId, ref: 'User' },
  hospital: { type: ObjectId, ref: 'Hospital' },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

const Appointment = model('Appointment', AppointmentSchema);

module.exports = Appointment;
