const Nexmo = require('nexmo');
const Appointment = require('../models/appointment');

const appointmentController = {
  all(req, res) {
    // Returns all appointments of user
    const user = res.locals.loggedInUser;
    Appointment.find({ user: user._id }).populate('hospital').exec((err, appointments) => res.status(201).json({
      status: 'success',
      message: 'appointment successful',
      data: appointments
    }));
  },
  one(req, res) {
    // Returns all appointments of user
    const user = res.locals.loggedInUser;
    const { id } = req.params;
    Appointment.findOne({ user: user._id, _id: id }).populate('hospital').exec((err, appointment) => res.status(201).json({
      status: 'success',
      message: 'appointment successful',
      data: appointment
    }));
  },
  create(req, res) {
    const { state, lg, hospital, date, comment, type
    } = req.body;
    const user = res.locals.loggedInUser;

    // Creates a new record from a submitted form
    const newappointment = new Appointment({
      state,
      lg,
      hospital,
      user: user._id,
      comment,
      type,
      date
    });

    const nexmo = new Nexmo({
      apiKey: '41929a6c',
      apiSecret: 'YvX2lYk6utkevmfaI'
    });

    const msg = `${user.name
    } `
      + 'this message is to confirm your appointment at'
      + ` ${
        date}`;

    // and saves the record to
    // the data base
    newappointment.save((err, saved) => {
      // Returns the saved appointment
      // after a successful save
      Appointment.find({ _id: saved._id })
        .populate('hospital')
        .exec((err, appointment) => res.status(200).json({
          status: 'success',
          message: 'successfully',
          appointment
        }));

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
