const appointmentController = require('../controllers/appointments');
const slotController = require('../controllers/slot');
const auth = require('../middleware/auth');

const appointmentRoutes = (router) => {

  router.route('/appointments')
    .get(auth.allowIfLoggedin, appointmentController.all)

  router.route('/retrieveSlots')
    .get(auth.allowIfLoggedin, slotController.all)

  router.route('/appointmentCreate')
    .post(auth.allowIfLoggedin, appointmentController.create)

}


module.exports = appointmentRoutes;
