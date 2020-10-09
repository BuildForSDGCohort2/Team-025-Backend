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
 *@route POST api/v1/request/{id}
 *@desc Add a New Blood Request for an item in bloodbank / hospital
 *@access Private
 */
// Create a request for blood in the Blood Bank
const createRequestForAvailableBlood = async (req, res) => {
  try {
    const { bloodId, auctionType } = req.body;

    const blood = await Blood.findOne({ _id: bloodId });
    if (!blood) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Blood type your request for is not available' });
    }
    const request = await Request.findOne({ bloodId, createdBy: req.user.id });
    if (request) {
      return res.status(httpStatus.CONFLICT).json({ message: 'Request already received' });
    }
    const bloodRequest = new Request({
      createdBy: req.user.id,
      bloodownerId: blood.createdBy,
      auctionType,
      bloodId
    });
    const savedRequest = await bloodRequest.save();
    if (blood.requests.indexOf(savedRequest.id) < 0) {
      blood.requests.push(savedRequest.id);

      const notification = new Notification({
        to: bloodRequest.bloodownerId,
        title: 'you have new blood request',
        metadata: {
          message: `${bloodRequest.createdBy.firstName} sent you a request`,
          at: bloodRequest.createdBy.address
        },
        createdBy: req.user.id
      });
      await notification.save();
      const { io } = req.app;

      if (io) {
        io.emit('notification', notification);
      }
      // return res.status(httpStatus.OK).json({ ...bloodRequest.toJSON() });
    }
    await blood.save();
    const { _id, createdBy } = savedRequest;
    return res.status(httpStatus.CREATED).json({
      id: _id,
      createdBy,
      message: 'request saved successfully!',
      data: { ...savedRequest }
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `problem saving request to db: ${error}`
    });
  }
};

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
 * VOLUNTEER TO DONATE TO A BLOOD REQUEST
 * @route GET api/v1/donate/{request_id}
 * @desc Volunteer to donate for a Blood Request
 *  @access Public
 */
// volunteer to donate blood for a new request
const volunteerToDonate = async (req, res) => {
  const {
    createdBy, bloodGroup, status, email, createdAt
  } = req.body;
  createdBy = req.user.firstname;
  const { request_id } = req.params;

  const addVolunteer = {
    _id: ObjectId(),
    createdBy,
    status,
    email,
    bloodGroup,
    createdAt
  };

  Request.updateOne({ _id: ObjectId(request_id) }, {
    $push: { volunteers: addVolunteer }
  }, (error, result) => {
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    } else {
      res.status(httpStatus.OK).json({ message: 'VOLUNTEER ADDED' });
    }
  });
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
 * @route PUT api/v1/request/{request_id}
 * @desc Modify or Update Blood Request
 * @access Public
 */
const modifyRequest = async (req, res) => {
  try {
    const update = req.body;
    const { request_id } = req.params;

    const bloodRequest = await Request.findOneAndUpdate(
      { _id: request_id },
      { $set: { ...update, updatedBy: req.user.id } },
      { new: true, useFindAndModify: false }
    )
      .populate('bloodId', 'price shortLocation status')
      .populate('bloodownerId', 'firstName');
    const blood = await Blood.findOneAndUpdate(
      { _id: bloodRequest.bloodId },
      { $set: { status: BloodStatus.PENDING_DELIVERY } },
      { new: true, useFindAndModify: false }
    );
    bloodRequest.bloodId.status = blood.status;

    const notification = new Notification({
      to: bloodRequest.createdBy,
      title: 'blood-request-approved',
      metadata: {
        message: `${bloodRequest.bloodownerId.firstName} approved your request`,
        at: bloodRequest.updatedAt
      },
      createdBy: req.user.id
    });
    await notification.save();
    const { io } = req.app;

    if (io) {
      io.emit('notification', notification);
    }
    return res.status(httpStatus.OK).json({
      message: 'request modified successfully',
      ...bloodRequest.toJSON()
    });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `An error has occurred: ${error}`
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
 * @route POST api/v1/request/{request_id}
 * @desc Reply to a Blood Request
 *  @access Public
 */
const replyRequest = async (req, res) => {
  const {
    comment, createdBy, createdAt, email
  } = req.body;
  const { request_id } = req.params;

  const newComment = {
    _id: ObjectId(),
    createdBy: req.user.firstname,
    comment,
    createdAt,
    email
  };

  Request.updateOne({ _id: ObjectId(request_id) }, {
    $push: { comments: newComment }
  },
  (error, result) => {
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    } else {
      res.status(httpStatus.OK).json({
        message: 'successfully reply to a request'
      });
    }
  });
};

/**
 * @route POST api/v1/request/{request_id}
 * @desc add volunteer to a Blood Request
 *  @access Public
 */
const addVolunteer = async (req, res) => {
  const {
    createdBy, bloodGroup, status, email, createdAt
  } = req.body;
  const { request_id } = req.params;

  const addVolunteer = {
    _id: ObjectId(),
    fullName,
    status,
    email,
    bloodGroup,
    createdAt
  };

  Request.updateOne({ _id: ObjectId(request_id) }, {
    $push: { volunteers: addVolunteer }
  },
  (error, result) => {
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    } else {
      res.status(httpStatus.OK).json({
        message: 'You have a new volunteer'
      });
    }
  });
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
 * @route POST api/v1/request/{request_id}/{volunteer_id}
 * @desc successfully donated to a Blood Request
 *  @access Public
 */
// router.post('/donated/:request_id/:volunteer_id',
const donated = async (req, res) => {
  const { request_id, volunteer_id } = req.params;

  await Request.updateOne({
    _id: ObjectId(request_id), 'volunteers._id': ObjectId(volunteer_id)
  },
  { $set: { 'volunteers.$.status': 'Donated' } },
  { $inc: { progress: 0.5, required: -0.5 } },
  async (error, result) => {
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    } else {
      Request.updateOne({
        _id: ObjectId(request_id), 'volunteers._id': ObjectId(volunteer_id)
      }, { $inc: { progress: 1, required: -1 } },
      async (error, result) => {
        if (error) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
        } else {
          res.status(httpStatus.OK).json({
            message: 'Volunteer successfully donated'
          });
        }
      });
    }
  });
};

/**
 * @route POST api/v1/request/{:request_id}/{:volunteer_id}}
 * @desc fail to donate to a Blood Request
 *  @access Public
 */

const notDonated = async (req, res) => {
  const { request_id, volunteer_id } = req.params;

  await Request.updateOne({
    _id: ObjectId(request_id), 'volunteers._id': ObjectId(volunteer_id)
  },
  { $set: { 'volunteers.$.status': 'Not Donated' } },
  { $inc: { progress: 0.5, required: -0.5 } },
  async (error, result) => {
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    } else {
      await Request.updateOne({
        _id: ObjectId(request_id), 'volunteers._id': ObjectId(volunteer_id)
      },
      { $inc: { progress: -1, required: 1 } },
      async (error, result) => {
        if (error) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
        } else {
          res.status(httpStatus.OK).json({ message: 'volunteer fail to donated' });
        }
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
const updateRequestStatus = async (req, res) => {
  const { request_id } = req.params;

  await Request.updateOne({ _id: ObjectId(request_id) },
    { $set: { status: BloodRequestStatus.COMPLETED } }, (error, result) => {
      if (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
      } else {
        res.status(httpStatus.OK).json({
          message: 'Request status updated succesfully'
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
 * @route GET api/v1/blood_id/requests
 * @desc All Request for hospital
 *  @access Public
 */
const getAllHospitalRequests = async (req, res) => {
  try {
    const { query, opts } = req.query;
    // const { bloodId } = req.params;
    const { id: bloodownerId } = req.user;
    const condition = { ...JSON.parse(query || '{}'), bloodownerId };
    const options = JSON.parse(opts || '{}');

    const bloodRequests = await Request.find(condition, null, options)
      .populate('bloodId', 'price shortLocation status', null, { sort: { createdAt: -1 } })
      .populate('createdBy', 'firstName lastName', null, { sort: { createdAt: -1 } });
    const totalCount = await Request.find({ bloodownerId }).countDocuments().exec();

    return res.status(httpStatus.OK).json({
      totalCount,
      bloodRequests
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `An error has occurred: ${error}`
    });
  }
};


module.exports = {
  // createRequestForAvailableBlood,
  createRequest,
  // volunteerToDonate,
  // modifyRequest,
  // getMyRequests,
  // addVolunteer,
  // replyRequest,
  // donated,
  // notDonated,
  // updateRequestStatus,
  acceptRequest,
  getRequest,
  getAllRequests,
  getPublicRequest,
  getAllPublicRequests
  // getAllHospitalRequests
};
