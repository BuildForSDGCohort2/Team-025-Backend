const express = require("express");
const requestController = require("../controllers/requestController");
const auth = require('../middleware/auth');

const requestRoutes = (router) => {

  router.route('/request')
    .post(auth.allowIfLoggedin, requestController.createRequest)
    .put(auth.allowIfLoggedin, requestController.modifyRequest)

  router.route('/request/:request_id')
    .get(auth.allowIfLoggedin, requestController.getRequest)
    .post(auth.allowIfLoggedin, requestController.createRequestForAvailableBlood)
    .post(auth.allowIfLoggedin, requestController.replyRequest)
    .post(auth.allowIfLoggedin, requestController.addVolunteer)
    .post(auth.allowIfLoggedin, requestController.updateRequestStatus)
    .post(auth.allowIfLoggedin, requestController.volunteerToDonate)

  router.route('/requests')
    .get(auth.allowIfLoggedin, requestController.getAllRequests)

  router.route('/request/:email')
    .get(auth.allowIfLoggedin, requestController.getMyRequests)

  router.route('/blood_id/requests')
    .get(auth.allowIfLoggedin, requestController.getAllHospitalRequests)

  router.route('/request/:request_id/:volunteer_id')
    .post(auth.allowIfLoggedin, requestController.donated)
    .post(auth.allowIfLoggedin, requestController.notDonated)

}


module.exports = requestRoutes;
