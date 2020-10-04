const appointmentRoutes = require('./appointments');
const authRoute = require('./auth');
const hospitalRoutes = require('./hospitals');
const userRoutes = require('./users');
const requestRoutes = require('./requestRoute');

const routes = (router) => {
  router.route('/')
    .get((_, res) => res.status(200).json({ message: 'welcome to bloodnation api v1' }));

  authRoute(router);
  userRoutes(router);
  appointmentRoutes(router);
  hospitalRoutes(router);
  requestRoutes(router);
};

module.exports = routes;
