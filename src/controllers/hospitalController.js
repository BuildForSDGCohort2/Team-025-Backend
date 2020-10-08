const httpStatus = require('http-status-codes');
const debug = require('debug')('app:requestContoller');
const { ObjectId } = require('mongodb');
const Hospital = require('../models/hospital');
const { Request, BloodRequestStatus } = require('../models/request');
const Appointment = require('../models/appointment');

exports.one = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findOne({ _id: id });
    if (!hospital) {
      return res.status(401).json({
        status: 'error',
        message: 'no hospital in this local government',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'hospital record gotten successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.byLg = async (req, res) => {
  try {
    const { lg } = req.params;
    const hospitals = await Hospital.find({ lg });
    if (!hospitals) {
      return res.status(401).json({
        status: 'error',
        message: 'no hospital in this local government',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'hospital record gotten successfully',
      data: hospitals
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

exports.all = async (req, res) => {
  try {
    const hospital = await Hospital.find();
    if (!hospital) {
      return res.status(401).json({
        status: 'error',
        message: 'no hospital in this local government',
        data: []
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'All hospital record gotten successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};


/**
 *CREATE A NEW HOSPITAL TOO BE SAVED TO THE HOSPITAL COLLECTION
 *@route POST api/v1/hospitals
 *@desc Add a New Hospital Facility where users can donate or receive blood
 *@access Private
 */
exports.createHospital = async (req, res) => {
  try {
    // const { id } = req.user;
    const user = res.locals.loggedInUser
    const { email } = req.body;
    const hospital = new Hospital({
      createdBy: user,
      email,
      ...req.body
    });
    const hosp = await Hospital.findOne({ email });
    if (hosp) {
      return res.status(httpStatus.CONFLICT).json({
        status: 'error',
        message: 'Hospital already exist',
        data: []
      });
    }
    await hospital.save();
    return res.status(httpStatus.CREATED).json({
      status: 'success',
      message: 'Hospital successfully created',
      data: hospital
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

/**
 * @route PUT api/v1/hospitals/hospital/{id}
 * @desc Modify or Update Hospital details
 * @access Public
 */
exports.modifyHospitalDetail = async (req, res) => {
  try {
    const update = req.body;

    const { hospitalId } = req.params;
    const hospital = await Hospital.findOneAndUpdate(
      { _id: hospitalId },
      { $set: update, updatedBy: req.user.id },
      { new: true, useFindAndModify: false }
    ).exec();

    return res.status(httpStatus.OK).json({
      status: 'success',
      message: 'Hospital successfully updated',
      data: hospital
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};


/**
 * @route GET api/v1/hospitals/{id}
 * @desc Get the records of a particular hospital
 * @access Public
 */
exports.getHospitalRecords = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      _id: req.params.id
    });
    return res.status(httpStatus.OK).json({
      status: 'success',
      message: 'Got Hospital records successfully',
      data: hospital
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message.toString(),
      data: []
    });
  }
};

