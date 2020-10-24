/* eslint-disable linebreak-style */
const { User } = require('../../models/user');
const { Request } = require('../../models/request');
const Appointment = require('../../models/appointment');
const { Blood } = require('../../models/blood');
const Hospital = require('../../models/hospital');
const { hashPassword } = require('../../utils/authHelper');

const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    return res.status(200).json({
      status: 'success',
      message: 'hospitals record successful',
      data: hospitals
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const getHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(401).json({
        status: 'error',
        message: 'hospital not found'
      });
    }
    const appointments = await Appointment.find({ hospital: hospitalId });
    const requests = await Request.find({ hospital: hospitalId });
    const bloods = await Blood.find({ hospital: hospitalId });
    const user = await User.findOne({ _id: hospital.user });
    user.password = '';
    user.accessToken = '';
    user.verificationToken = '';
    return res.status(200).json({
      status: 'success',
      message: 'hospital record successful',
      data: {
        ...hospital._doc, appointments, requests, bloods, user
      }
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const createHospital = async (req, res) => {
  try {
    const {
      firstname, lastname, state, address, phone, lg, email, latitude, name
    } = req.body;

    // check user existence
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return res.status(401).json({
        status: 'error',
        message: 'Email already exist',
        data: []
      });
    }

    // create user
    const hashedPassword = await hashPassword('Password2020');
    const newUserData = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      state,
      lg,
      address,
      bloodGroup: 'A+',
      emailVerifiedAt: new Date(),
      role: 'hospital'
    };
    const newUser = new User(newUserData);
    await newUser.save();

    // create hospital
    const newHospital = {
      email,
      name,
      phone,
      state,
      lg,
      address,
      latitude,
      longitude: latitude,
      user: newUser._id
    };

    const hospital = new Hospital(newHospital);
    await hospital.save();

    return res.status(201).json({
      status: 'success',
      message: 'hospital has been created',
      data: hospital
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const updateHospital = async (req, res) => {
  try {
    const {
      name, email, state, address, phone, lg, latitude
    } = req.body;
    const { hospitalId } = req.params;
    const updatedHospital = await Hospital.findByIdAndUpdate(hospitalId, {
      name, email, state, address, phone, lg, latitude, longitude: latitude
    }, { new: true });
    return res.status(201).json({
      status: 'success',
      message: 'hospital has been updated',
      data: updatedHospital
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

module.exports = {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital
};
