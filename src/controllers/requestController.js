const httpStatus = require("http-status-codes");
const debug = require('debug')('app:requestContoller');
const Request = require('../models/request');
const { Blood, BloodStatus } = require("../models/blood");



/**
 *CREATE A NEW REQUEST TOO BE LEASED OUT OR RENTED OUT
 *@route POST api/blood
 *@desc Add a New Land Property to be bidden for or sold to farmers
 *@access Private
 */
// eslint-disable-next-line complexity
const createRequest = async (req, res) => {
  try {
    const { bloodId } = req.body;

    const blood = await Blood.findOne({ _id: bloodId });
    if (!blood) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Blood your making request for is no more available" });
    }
    const request = await Request.findOne({ bloodId, createdBy: req.user.id });
    if (request) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Request already received" });
    }
    const bloodRequest = new Request({
      createdBy: req.user.id,
      bloodownerId: blood.createdBy,
      bloodId
    });
    const savedRequest = await bloodRequest.save();
    if (blood.requests.indexOf(savedRequest.id) < 0) {
      blood.requests.push(savedRequest.id);
    }
    await blood.save();
    const { _id, createdBy } = savedRequest;
    return res.status(httpStatus.CREATED).json({ id: _id, createdBy });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred"
    });
  }
};


module.exports = {
  createRequest
}
