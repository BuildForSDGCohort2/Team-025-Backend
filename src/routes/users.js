const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { emailVerificationMiddleware } = require('../middleware/emailVerificationMiddleware');
const { roles } = require('../roles');

const userRoutes = (router) => {

  router.use(emailVerificationMiddleware);

  router.route('/users')
    .get(auth.allowIfLoggedin, auth.grantAccess('readAny', 'profile'), userController.getUsers);

  router.route('/users/statistics')
    .get(auth.allowIfLoggedin, auth.grantAccess(roles.can('user').updateOwn('profile')), userController.getStatistics);

  router.route('/users/:userId')
    .get(auth.allowIfLoggedin, userController.getUser)
    .post(auth.allowIfLoggedin, auth.grantAccess(roles.can('user').updateOwn('profile')), userController.updateUser)
    .delete(auth.allowIfLoggedin, auth.grantAccess('deleteAny', 'profile'), userController.deleteUser);
};

module.exports = userRoutes;
