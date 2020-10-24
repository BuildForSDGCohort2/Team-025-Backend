/* eslint-disable linebreak-style */
const { User } = require('../../models/user');
const { Request } = require('../../models/request');
const Appointment = require('../../models/appointment');
const { Blood } = require('../../models/blood');

const getUsers = async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const users = await User.find({});
    const filteredUser = users.filter((user) => user._id.toString() !== loginUserId.toString());
    return res.status(200).json({
      status: 'success',
      message: 'users record successful',
      data: filteredUser
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('requests appointments');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'user not found'
      });
    }
    const appointments = await Appointment.find({ user: userId });
    const requests = await Request.find({ bloodReceiverId: userId });
    const bloods = await Blood.find({ donor: userId });
    return res.status(200).json({
      status: 'success',
      message: 'users record successful',
      data: {
        ...user._doc, appointments, requests, bloods
      }
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      firstname, lastname, state, address, phone, lg
    } = req.body;
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      firstname, lastname, state, address, phone, lg
    }, { new: true });
    return res.status(201).json({
      status: 'success',
      message: 'User has been updated',
      data: updatedUser
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const disableUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      active: 0
    }, { new: true });
    return res.status(201).json({
      status: 'success',
      message: 'User has been disabled',
      data: updatedUser
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const enableUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      active: 1
    }, { new: true });
    return res.status(201).json({
      status: 'success',
      message: 'User has been enabled',
      data: updatedUser
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const getAdminStatistics = async (req, res) => {
  try {
    const users = await User.countDocuments({});
    const requests = await Request.countDocuments({});
    const appointments = await Appointment.countDocuments({});
    const bloods = await Blood.countDocuments({});

    return res.status(200).json({
      status: 'success',
      message: 'statisctis successful',
      data: {
        user: +users - 1,
        requests,
        appointments,
        bloods
      }
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  disableUser,
  enableUser,
  getAdminStatistics
};
