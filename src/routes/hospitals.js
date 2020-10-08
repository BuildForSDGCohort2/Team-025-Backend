// const appointmentController = require('../controllers/appointments');
const { all, one, byLg,
  createHospital,
  modifyHospitalDetail } = require('../controllers/hospitalController');
const { acceptRequest,
  rejectRequest,
  completeRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');
const roleMiddleware = require("../middleware/roleMiddleware");
const { UserRole } = require("../models/user");

const hospitalRoutes = (router) => {
  router.route('/hospitals/')
    .get(auth.allowIfLoggedin, all)
    .post(auth.allowIfLoggedin, createHospital);

  router.route('/hospitals/:lg').get(auth.allowIfLoggedin, byLg);

  router.route('/hospitals/hospital/:id')
    .get(auth.allowIfLoggedin, one)
    .post(auth.allowIfLoggedin,
      roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
      modifyHospitalDetail);

  router.route('/hospitals/hospital/acceptreq/:id')
    .post(auth.allowIfLoggedin,
      roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
      acceptRequest)

  router.route('/hospitals/hospital/rejectreq/:id')
    .post(auth.allowIfLoggedin,
      roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
      rejectRequest)

  router.route('/hospitals/hospital/completereq/:id')
    .post(auth.allowIfLoggedin,
      roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
      completeRequest);
};

module.exports = hospitalRoutes;
