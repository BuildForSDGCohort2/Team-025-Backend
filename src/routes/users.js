const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { emailVerificationMiddleware } = require('../middleware/emailVerificationMiddleware');
const { regMiddleware } = require('../middleware/regMiddleware');

const userRoutes = (router) => {

  router.use(emailVerificationMiddleware);
  router.use(regMiddleware);

  router.route('/users')
    .get(auth.allowIfLoggedin, auth.grantAccess('readAny', 'profile'), userController.getUsers);

  router.route('/users/:userId')
    .get(auth.allowIfLoggedin, userController.getUser)
    .post(auth.allowIfLoggedin, auth.grantAccess('updateAny', 'profile'), userController.updateUser)
    .delete(auth.allowIfLoggedin, auth.grantAccess('deleteAny', 'profile'), userController.deleteUser)
};

module.exports = userRoutes;
