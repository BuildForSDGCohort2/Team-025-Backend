// const appointmentController = require('../controllers/appointments');
const { all, one, byLg } = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

const hospitalRoutes = (router) => {
  router.route('/hospitals/').get(auth.allowIfLoggedin, all);
  router.route('/hospitals/:lg').get(auth.allowIfLoggedin, byLg);
  router.route('/hospitals/hospital/:id').get(auth.allowIfLoggedin, one);
};

module.exports = hospitalRoutes;
