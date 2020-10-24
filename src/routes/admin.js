const {
  getUsers, getUser, updateUser, disableUser, enableUser, getAdminStatistics
} = require('../controllers/admin/adminUserController');
const {
  getHospitals, getHospital, createHospital, updateHospital
} = require('../controllers/admin/adminHospitalController');
const {
  getRequests, getRequest
} = require('../controllers/admin/adminRequestController');
const {
  getAppointments, getAppointment
} = require('../controllers/admin/adminAppointmentController');
const auth = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const { UserRole } = require('../models/user');

const adminRoutes = (router) => {
  // user records
  router.route('/admin/statistics')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getAdminStatistics);
  router.route('/admin/users')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getUsers);

  router.route('/admin/users/:userId')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getUser)
    .put(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), updateUser);

  router.route('/admin/users/active/:userId')
    .put(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), enableUser)
    .post(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), disableUser);

  // hospital records
  router.route('/admin/hospitals')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getHospitals)
    .post(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), createHospital);

  router.route('/admin/hospitals/:hospitalId')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getHospital)
    .put(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), updateHospital);

  // requests records
  router.route('/admin/requests')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getRequests);

  router.route('/admin/requests/:requestId')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getRequest);

  // appointment records
  router.route('/admin/appointments')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getAppointments);

  router.route('/admin/appointments/:appointmentId')
    .get(auth.allowIfLoggedin, roleMiddleware({ allowedRoles: [UserRole.Admin] }), getAppointment);
};

module.exports = adminRoutes;
