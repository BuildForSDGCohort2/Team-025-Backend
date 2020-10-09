const {
  approveAppointment,
  allHAppointments,
  oneHAppointment,
  completeAppointment,
  getStatistics,
  allHBank,
  getHPant,
  allHPendingRequests,
  updateBlood
} = require('../controllers/appointments');
const { all, one, byLg, createHospital } = require('../controllers/hospitalController');
// const {
//   rejectRequest,
//   completeRequest
// } = require('../controllers/requestController');
const auth = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const { UserRole } = require('../models/user');

const hospitalRoutes = (router) => {
  router
    .route('/hospitals')
    .get(auth.allowIfLoggedin, all)
    .post(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), createHospital);

  router
    .route('/hospitals/appointments')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), allHAppointments);
  router
    .route('/hospitals/statistics')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), getStatistics);
  router
    .route('/hospitals/banks')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), allHBank);
  router
    .route('/hospitals/requests')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), allHPendingRequests);
  router
    .route('/hospitals/banks/:id')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), getHPant)
    .post(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), updateBlood);
  router
    .route('/hospitals/appointments/:id')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), oneHAppointment);

  router
    .route('/hospitals/appointments/approve/:hospitalId/:appointmentId')
    .post(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), approveAppointment);

  router
    .route('/hospitals/appointments/complete/:hospitalId/:appointmentId')
    .post(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Hospital] }), completeAppointment);

  router.route('/hospitals/:lg').get(auth.allowIfLoggedin, byLg);

  // router.route('/hospitals/hospital/:id')
  //   .get(auth.allowIfLoggedin, one)
  //   .post(auth.allowIfLoggedin,
  //     roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
  //     modifyHospitalDetail);

  // router.route('/hospitals/hospital/rejectreq/:id')
  //   .post(auth.allowIfLoggedin,
  //     roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
  //     rejectRequest);

  // router.route('/hospitals/hospital/completereq/:id')
  //   .post(auth.allowIfLoggedin,
  //     roleMiddleware({ allowedRoles: [UserRole.Admin, UserRole.Hospital] }),
  //     completeRequest);
};

module.exports = hospitalRoutes;
