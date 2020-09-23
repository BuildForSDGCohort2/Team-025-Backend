const appointmentRoutes = require('./appointments');
const authRoute = require('./auth');
const userRoutes = require('./users');

const routes = (router) => {
  router.route('/')
    .get((_, res) => {
      return res.status(200).json({ message: 'welcome to bloodnation api v1' });
    });

  authRoute(router);
  userRoutes(router);
  appointmentRoutes(router);
}

module.exports = routes;
