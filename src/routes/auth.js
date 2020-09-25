const userController = require('../controllers/userController');

const authRoute = (router) => {
  router.route('/signup')
    .post(userController.signup);

  router.route('/login')
    .post(userController.login);

  router.route('/verification/email')
    .post(userController.confirmVerification);

  router.route('/verification/email/resend')
    .post(userController.reSendVerification);

  router.route('/logout')
    .get((req, res) => {
      res.render('index', { title: 'You have logged out' });
    })
  }

module.exports = authRoute;
