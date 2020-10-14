const httpStatus = require('http-status-codes');
const debug = require('debug')('app:requestContoller');
const { ObjectId } = require('mongodb');
const { Request, BloodRequestStatus } = require('../models/request');
const Appointment = require('../models/appointment');
const Hospital = require('../models/hospital');
const { Blood, BloodStatus } = require('../models/blood');
const { Notification } = require('../models/notification');

/**
 *CREATE A NEW BLOOD REQUEST TOO BE GIVEN OUT FREE OR PAID FOR
 *@route POST api/v1/request
 *@desc Add a New Blood Request to be solicited for or sold to users
 *@access Private
 */
// eslint-disable-next-line complexity
// Create a request for unavailable blood
const createRequest = async (req, res) => {
  try {
    const {
      comments,
      bloodReceiverId,
      hospital,
      bloodGroup
    } = req.body;

    const createdBy = res.locals.loggedInUser;

    const bloodRequest = new Request({
      createdBy,
      comments,
      bloodReceiverId,
      hospital,
      bloodGroup
    });

    const savedRequest = await bloodRequest.save();

    if (savedRequest) {
      const notification = new Notification({
        to: bloodRequest.hospital,
        title: 'you have new blood request',
        metadata: {
          message: `${bloodRequest.createdBy.firstName} sent you a request`,
          at: bloodRequest.createdBy.address
        },
        createdBy
      });
      await notification.save();
      const { io } = req.app;

      if (io) {
        io.emit('notification', notification);
      }
    }
    return res.status(httpStatus.CREATED).json({
      status: 'success',
      message: 'new request saved successfully!',
      data: bloodRequest
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      error: `problem saving request to db: ${error}`
    });
  }
};

/**
 * @route GET api/v1/request/{id}
 * @desc Get the details of a blood request
 * @access Public
 */
const getRequest = async (req, res) => {
  try {
    const bloodRequest = await Request.findOne({
      _id: req.params.requestId,
      bloodReceiverId: res.locals.loggedInUser._id
    })
      .populate('bloodId', 'price shortLocation status', null, { sort: { createdAt: -1 } })
      .populate('createdBy', 'firstname lastname', null, { sort: { createdAt: -1 } })
      .populate('hospital', 'name address state lg latitude longitude email phone ', null, { sort: { createdAt: -1 } })
      .populate('bloodOwnerId', 'firstname lastname phone email address state lg', null, { sort: { createdAt: -1 } })
      .populate('appointment');
    return res.status(httpStatus.OK).json({
      message: 'success',
      data: bloodRequest
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `Sorry, an error occur: ${error}`
    });
  }
};

/**
 * @route GET api/v1/request/{id}
 * @desc Get the details of a blood request
 * @access Public
 */
const getPublicRequest = async (req, res) => {
  try {
    const bloodRequest = await Request.findOne({
      $or: [
        { _id: req.params.requestId, status: BloodRequestStatus.PENDING },
        { _id: req.params.requestId, bloodOwnerId: res.locals.loggedInUser._id },
        { _id: req.params.requestId, bloodReceiverId: res.locals.loggedInUser._id }
      ]
    })
      .populate('bloodId', 'price shortLocation status', null, { sort: { createdAt: -1 } })
      .populate('createdBy', 'firstname lastname email phone state lg address', null, { sort: { createdAt: -1 } })
      .populate('bloodOwnerId', 'firstname lastname email phone state lg address', null, { sort: { createdAt: -1 } })
      .populate('bloodReceiverId', 'firstname lastname email phone state lg address', null, { sort: { createdAt: -1 } })
      .populate('appointment', 'createdAt', null, { sort: { createdAt: -1 } })
      .populate('hospital', 'state lg name phone email address', null, { sort: { createdAt: -1 } });
    return res.status(httpStatus.OK).json({
      message: 'success',
      data: bloodRequest
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `Sorry, an error occur: ${error}`
    });
  }
};

/**
 * @route GET api/v1/requests
 * @desc All Available Blood Request
 *  @access Public
 */
const getAllRequests = async (_req, res) => {
  try {
    const bloodRequests = await Request.find({ bloodReceiverId: res.locals.loggedInUser._id })
      .populate('bloodId', 'price shortLocation status', null, { sort: { createdAt: -1 } })
      .populate('hospital', 'name state phone lg', null, { sort: { createdAt: -1 } })
      .populate('createdBy', 'firstName lastName', null, { sort: { createdAt: -1 } });

    return res.status(httpStatus.OK).json({
      status: 'success',
      message: 'request success',
      data: bloodRequests
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      error: `An error has occurred: ${error}`
    });
  }
};

/**
 * @route GET api/v1/requests
 * @desc All Available Public Blood Request
 *  @access Public
 */
const getAllPublicRequests = async (_req, res) => {
  try {
    const bloodRequests = await Request.find({ status: BloodRequestStatus.PENDING })
      .where('bloodReceiverId')
      .ne(res.locals.loggedInUser._id)
      .populate('bloodId', 'price shortLocation status', null, { sort: { createdAt: -1 } })
      .populate('createdBy', 'firstname lastname email phone state lg address', null, { sort: { createdAt: -1 } })
      .populate('bloodReceiverId', 'firstname lastname email phone state lg address', null, { sort: { createdAt: -1 } })
      .populate('hospital', 'name state phone email lg address', null, { sort: { createdAt: -1 } });

    return res.status(httpStatus.OK).json({
      status: 'success',
      message: 'Success',
      data: bloodRequests
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      error: `An error has occurred: ${error}`
    });
  }
};

/**
 * @route GET api/v1/request/{user_id}
 * @desc get all requests by a user
 *  @access Public
 */
// /request/:email,
const getMyRequests = async (req, res) => {
  const { createdBy } = req.params;
  createdBy = req.user.email;

  const requests = await Request.find({ createdBy }).sort({ _id: -1 });

  if (!requests) {
    return res.status(httpStatus.CONFLICT).json({
      message: 'You have no request'
    });
  }
  res.status(httpStatus.OK).json({
    message: 'success',
    requests
  });
};

/**
 * @route POST api/v1/request/{request_id}
 * @desc Update a request status to completed
 *  @access Public
 */
// router.post('/request/:request_id',
const completeRequest = async (req, res) => {
  const { requestId } = req.params;

  const appointment = await Appointment.findOneAndUpdate(
    { _id: requestId },
    { $set: { status: 'completed', progress: '100' } },
    { new: true, useFindAndModify: false }
  ).exec();

  await Request.updateOne({ _id: ObjectId(requestId) },
    {
      $set: {
        status: BloodRequestStatus.COMPLETED,
        appointment,
        progress: 100
      }
    }, (error, result) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: 'error',
          message: 'request not found',
          error: []
        });
      } else {
        res.status(httpStatus.OK).json({
          status: 'success',
          message: 'Request status completed'
        });
      }
    });
};

/**
 * @route POST api/v1/comment/{request_id}
 * @desc Update a request status to completed
 *  @access Public
 */
// router.post('/request/:request_id',
const acceptRequest = async (req, res) => {
  const { requestId } = req.params;

  const {
    date, comment
  } = req.body;

  // check if request exists and pending
  const request = await Request.findOne({ _id: requestId, status: BloodRequestStatus.PENDING }).populate('hospital');

  if (!request) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: 'error',
      message: 'request not found',
      error: []
    });
  }

  // create appointment
  const newappointment = new Appointment({
    state: request.hospital.state,
    lg: request.hospital.lg,
    hospital: request.hospital._id,
    user: res.locals.loggedInUser._id,
    type: 'receiver',
    beneficiary: request.bloodReceiverId,
    comment,
    status: 'accepted',
    progress: '50',
    date
  });

  await newappointment.save();

  await Request.updateOne({ _id: ObjectId(requestId), status: BloodRequestStatus.PENDING },
    {
      $set: {
        status: BloodRequestStatus.ACCEPTED,
        bloodOwnerId: res.locals.loggedInUser._id,
        progress: 50,
        hospital: request.hospital._id,
        appointment: newappointment._id,
        bloodOwnerBloodGroup: res.locals.loggedInUser.bloodGroup
      }
    }, (error, result) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: 'error',
          error
        });
      } else {
        res.status(httpStatus.OK).json({
          status: 'success',
          message: 'request acccepted succesfully'
        });
      }
    });
};

/**
 * @route POST api/v1/request/{request_id}
 * @desc Reject a request
 *  @access Public
 */
// router.post('/request/:request_id',
const rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  const {
    comment
  } = req.body;

  // check if request exists and pending
  const request = await Request.findOne({
    _id: requestId,
    status: BloodRequestStatus.PENDING
  }).populate('hospital');

  if (!request) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: 'error',
      message: 'request not found',
      error: []
    });
  }

  const appointment = await Appointment.findOneAndUpdate(
    { _id: requestId },
    { $set: { status: 'rejected', progress: '25' } },
    { new: true, useFindAndModify: false }
  ).exec();

  await Request.updateOne({ _id: ObjectId(requestId), status: BloodRequestStatus.PENDING },
    {
      $set: {
        status: BloodRequestStatus.DECLINED,
        bloodOwnerId: res.locals.loggedInUser._id,
        progress: 25,
        appointment,
        comment
        // hospital: request.hospital._id,
        // bloodOwnerBloodGroup: res.locals.loggedInUser.bloodGroup
      }
    }, (error, result) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: 'error',
          error
        });
      } else {
        res.status(httpStatus.OK).json({
          status: 'success',
          message: 'request declined'
        });
      }
    });
};

/**
 * @route POST api/v1/comment/{request_id}
 * @desc Update a request status to completed
 *  @access Public
 */
// router.post('/request/:request_id',
const hospitalAcceptRequest = async (req, res) => {
  const { requestId } = req.params;

  const {
    date, comment
  } = req.body;

  // check if request exists and pending
  const request = await Request.findOne({ _id: requestId, status: BloodRequestStatus.PENDING }).populate('hospital');

  if (!request) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: 'error',
      message: 'request not found',
      error: []
    });
  }

  // create appointment
  const newappointment = new Appointment({
    state: request.hospital.state,
    lg: request.hospital.lg,
    hospital: request.hospital._id,
    user: res.locals.loggedInUser._id,
    type: 'receiver',
    beneficiary: request.bloodReceiverId,
    comment,
    status: 'accepted',
    progress: '50',
    date
  });

  await newappointment.save();

  await Request.updateOne({ _id: ObjectId(requestId), status: BloodRequestStatus.PENDING },
    {
      $set: {
        status: BloodRequestStatus.ACCEPTED,
        bloodOwnerId: res.locals.loggedInUser._id,
        progress: 50,
        hospital: request.hospital._id,
        appointment: newappointment._id,
        bloodOwnerBloodGroup: res.locals.loggedInUser.bloodGroup
      }
    }, (error, result) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: 'error',
          error
        });
      } else {
        res.status(httpStatus.OK).json({
          status: 'success',
          message: 'request acccepted succesfully'
        });
      }
    });
};

module.exports = {
  createRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  getRequest,
  getAllRequests,
  getPublicRequest,
  getAllPublicRequests,
  hospitalAcceptRequest
};
