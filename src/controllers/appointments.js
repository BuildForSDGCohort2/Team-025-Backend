const Nexmo = require('nexmo');
const httpStatus = require('http-status-codes');
const Appointment = require('../models/appointment');
const { Blood, BloodStatus } = require('../models/blood');
const Hospital = require('../models/hospital');
const { Request, BloodRequestStatus } = require('../models/request');
const blood = require('../models/blood');
const debug = require('debug')('app:requestContoller');

const all = (req, res) => {
  // Returns all appointments of user
  const user = res.locals.loggedInUser;
  Appointment.find({ user: user._id }).populate('hospital beneficiary').exec((err, appointments) => res.status(201).json({
    status: 'success',
    message: 'appointment successful',
    data: appointments
  }));
};

const allHBank = async (req, res) => {
  const user = res.locals.loggedInUser;
  const hospital = await Hospital.findOne({ user: user._id });

  Blood.find({ hospital: hospital._id }).populate('hospital beneficiary donor appointment').exec((err, banks) => res.status(200).json({
    status: 'success',
    message: 'banks successful',
    data: banks
  }));
};

const allHAppointments = async (req, res) => {
  const user = res.locals.loggedInUser;
  const hospital = await Hospital.findOne({ user: user._id });
  const appointments = await Appointment.find({ hospital: hospital._id })
    .populate('user', 'firstname lastname email phone state lg address bloodGroup', null, { sort: { createdAt: -1 } })
    .populate('beneficiary', 'firstname lastname email phone state lg address', null, { sort: { createdAt: -1 } })
    .populate('hospital', 'name state phone email lg address', null, { sort: { createdAt: -1 } });

  return res.status(200).json({
    status: 'success',
    message: 'appointment successful',
    data: appointments
  });
};

const allHPendingRequests = async (req, res) => {
  const user = res.locals.loggedInUser;
  const hospital = await Hospital.findOne({ user: user._id });
  const requests = await Request.find({ hospital: hospital._id, status: BloodRequestStatus.PENDING })
    .populate('bloodReceiverId', 'firstname lastname email phone state lg address bloodGroup', null, { sort: { createdAt: -1 } });

  return res.status(200).json({
    status: 'success',
    message: 'requests successful',
    data: requests
  });
};


const oneHAppointment = async (req, res) => {
  const user = res.locals.loggedInUser;
  const { id } = req.params;
  const hospital = await Hospital.findOne({ user: user._id });
  Appointment.findOne({ hospital: hospital._id, _id: id }).populate('hospital beneficiary user bloodId').exec((err, appointment) => res.status(201).json({
    status: 'success',
    message: 'appointment successful',
    data: appointment
  }));
};

const getHPant = async (req, res) => {
  const user = res.locals.loggedInUser;
  const { id } = req.params;
  const hospital = await Hospital.findOne({ user: user._id });
  Blood.findOne({ hospital: hospital.id, _id: id }).populate('hospital beneficiary donor appointment request').exec((err, pantData) => res.status(200).json({
    status: 'success',
    message: 'Pant successful',
    data: pantData
  }));
};

const one = (req, res) => {
  const user = res.locals.loggedInUser;
  const { id } = req.params;
  Appointment.findOne({ user: user._id, _id: id }).populate('hospital beneficiary').exec((err, appointment) => res.status(201).json({
    status: 'success',
    message: 'appointment successful',
    data: appointment
  }));
};

const create = (req, res) => {
  const {
    state, lg, hospital, date, comment, type
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
      .exec((_err, appointment) => res.status(200).json({
        status: 'success',
        message: 'successfully',
        appointment
      }));

    const from = 'Vonage APIs';
    const to = '2348079398930';

    nexmo.message.sendSms(from, to, msg, (error, responseData) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } else {
        // eslint-disable-next-line no-console
        console.dir(responseData);
      }
    });
  });
};

const approveAppointment = async (req, res) => {
  const user = res.locals.loggedInUser;
  const { appointmentId, hospitalId } = req.params;
  const appointment = await Appointment.findOne({ hospital: hospitalId, _id: appointmentId, status: 'pending' }).populate('hospital');
  if (!appointment) {
    return res.status(401).json({
      status: 'error',
      message: 'appointment not found'
    });
  }

  if (appointment.hospital.user.toString() !== user._id.toString()) {
    return res.status(401).json({
      status: 'error',
      message: 'you dont have access to appointment'
    });
  }

  // approve appointment
  const updatedAp = await Appointment.findOneAndUpdate({ _id: appointmentId }, { status: 'approved', progress: '75' }, { new: true }).populate('hospital beneficiary user');

  if (appointment.type === 'receiver') {
    await Request
      .updateOne({
        appointment: appointmentId,
        hospital: hospitalId
      }, { status: BloodRequestStatus.APPROVED, progress: '75' });
  }

  return res.status(201).json({
    status: 'success',
    message: 'appointment accepted',
    data: updatedAp
  });
};

const updateBlood = async (req, res) => {
  try {
    let request;
    let pant;

    const { status, pantId, request: requestId } = req.body;
    const user = res.locals.loggedInUser;

    const hospital = await Hospital.findOne({ user: user._id });

    pant = await Blood.findOne({ _id: pantId, status: BloodStatus.BOOKED, hospital: hospital._id }).populate('hospital donor appointment');
    request = await Request.findOne({ _id: pant.request, status: BloodRequestStatus.APPROVED });
    if (status === 'BOOKED') {
      request = await Request.findOne({ _id: requestId, status: BloodRequestStatus.PENDING });
      pant = await Blood.findOne({ _id: pantId, status: BloodStatus.AVAILABLE, hospital: hospital._id }).populate('hospital donor appointment');
    }


    if (!pant && !request) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'error',
        error: 'sorry, could not update'
      });
    }

    pant.status = status;
    if (status === 'BOOKED') {
      pant.beneficiary = request.bloodReceiverId;
      pant.request = requestId;
    }
    const savedPant = await pant.save();


    request.status = BloodRequestStatus.COMPLETED;
    request.progress = '100';
    if (requestId && status === 'BOOKED') {
      request.status = BloodRequestStatus.APPROVED;
      request.progress = '75';
      request.bloodOwnerId = savedPant.donor._id;
      request.bloodOwnerBloodGroup = savedPant.donor.bloodGroup;
      request.bloodId = pantId;
    }
    await request.save();

    return res.status(201).json({
      status: 'success',
      message: 'pant successful',
      data: await Blood.findOne({ _id: pantId }).populate('hospital beneficiary donor appointment request')
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const completeAppointment = async (req, res) => {
  const user = res.locals.loggedInUser;
  const { appointmentId, hospitalId } = req.params;
  const { fullLocation, unit, description } = req.body;

  const appointment = await Appointment.findOne({ hospital: hospitalId, _id: appointmentId, status: 'approved' }).populate('hospital user');

  if (!appointment) {
    return res.status(401).json({
      status: 'error',
      message: 'appointment not found'
    });
  }

  if (appointment.hospital.user.toString() !== user._id.toString()) {
    return res.status(401).json({
      status: 'error',
      message: 'you dont have access to appointment'
    });
  }

  // get request
  const request = await Request.findOne({ appointment: appointmentId, hospital: hospitalId });
  // add blood details
  const blood = new Blood({
    fullLocation,
    shortLocation: fullLocation,
    unit,
    description,
    bloodGroup: appointment.user.bloodGroup,
    status: appointment.type === 'receiver' ? BloodStatus.BOOKED : BloodStatus.AVAILABLE,
    beneficiary: appointment.beneficiary,
    donor: appointment.user._id,
    hospital: hospitalId,
    createdBy: user._id,
    appointment: appointmentId,
    request: appointment.type === 'receiver' ? request._id : null,
    updatedAt: Date.now()
  });

  const savedBlood = await blood.save();

  // complete appointment
  const updatedAp = await Appointment
    .findOneAndUpdate(
      { _id: appointmentId },
      {
        status: 'completed',
        progress: '100',
        updatedAt: Date.now(),
        bloodId: savedBlood._id
      },
      { new: true }
    )
    .populate('hospital beneficiary user bloodId');

  if (appointment.type === 'receiver') {
    await Request
      .updateOne({
        appointment: appointmentId,
        hospital: hospitalId
      }, {
        status: BloodRequestStatus.COMPLETED, progress: '100', bloodId: savedBlood._id, updatedAt: Date.now()
      });
  }

  return res.status(201).json({
    status: 'success',
    message: 'appointment accepted',
    data: updatedAp
  });
};

const getStatistics = async (req, res) => {
  const user = res.locals.loggedInUser;
  const hospital = await Hospital.findOne({ user: user._id });

  const completed = await Appointment.countDocuments({
    status: 'completed',
    hospital: hospital._id
  });

  const pending = await Appointment.countDocuments({
    status: 'pending',
    hospital: hospital._id
  });

  const approved = await Appointment.countDocuments({
    status: 'approved',
    hospital: hospital._id
  });

  const bank = await Blood.countDocuments({
    hospital: hospital._id
  });

  res.status(200).json({
    status: 'success',
    data: {
      bank,
      completed,
      pending,
      approved
    }
  });
};

module.exports = {
  one,
  all,
  create,
  getHPant,
  approveAppointment,
  completeAppointment,
  allHAppointments,
  oneHAppointment,
  getStatistics,
  allHBank,
  allHPendingRequests,
  updateBlood
};
