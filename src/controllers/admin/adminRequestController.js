/* eslint-disable linebreak-style */
const { Request } = require('../../models/request');

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({});
    return res.status(200).json({
      status: 'success',
      message: 'requests record successful',
      data: requests
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

const getRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId).populate('bloodId bloodOwnerId bloodReceiverId hospital appointment');
    if (!request) {
      return res.status(401).json({
        status: 'error',
        message: 'request not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'request record successful',
      data: request
    });
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error.message.toString()
    });
  }
};

module.exports = {
  getRequests,
  getRequest
};
