/* eslint-disable linebreak-style */
const Appointment = require('../../models/appointment');

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    return res.status(200).json({
      status: 'success',
      message: 'appointments record successful',
      data: appointments
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId).populate('user bloodId hospital beneficiary');
    if (!appointment) {
      return res.status(401).json({
        status: 'error',
        message: 'appointment not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'appointment record successful',
      data: appointment
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

module.exports = {
  getAppointments,
  getAppointment
};
