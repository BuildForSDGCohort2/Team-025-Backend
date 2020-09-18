const { Appointment, Slot } = require('../models/appointment');
const Nexmo = require('nexmo');

const appointmentController = {
  all(req, res) {
    // Returns all appointments
    Appointment.find({}).exec((err, appointments) => res.json(appointments));
  },
  create(req, res) {
    const requestBody = req.body;

    const newslot = new Slot({
      slot_time: requestBody.slot_time,
      slot_date: requestBody.slot_date,
      created_at: Date.now()
    });
    newslot.save();
    // Creates a new record from a submitted form
    const newappointment = new Appointment({
      name: requestBody.name,
      email: requestBody.email,
      phone: requestBody.phone,
      slots: newslot._id
    });

    const nexmo = new Nexmo({
      apiKey: '41929a6c',
      apiSecret: 'YvX2lYk6utkevmfaI'
    });

    const msg = `${requestBody.name
    } `
      + 'this message is to confirm your appointment at'
      + ` ${
        requestBody.appointment}`;

    // and saves the record to
    // the data base
    newappointment.save((err, saved) => {
      // Returns the saved appointment
      // after a successful save
      Appointment.find({ _id: saved._id })
        .populate('slots')
        .exec((err, appointment) => res.json(appointment));

      const from = 'Vonage APIs';
      const to = '2348079398930';

      nexmo.message.sendSms(from, to, msg, (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          console.dir(responseData);
        }
      });
    });
  }
};

module.exports = appointmentController;
