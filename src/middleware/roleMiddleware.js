const debug = require('debug')('app:roleMiddleware');
const httpStatus = require('http-status-codes');

const roles = ({ userIdParam, allowedRoles }) => (req, res, next) => {
  try {
    // const { role } = req.user;
    const { role } = res.locals.loggedInUser;
    if (userIdParam && req.params[`${userIdParam}`] !== req.user._id) {
      return res.status(httpStatus.FORBIDDEN).json({ status: 'error', message: 'Access denied' });
    }
    if (!allowedRoles) {
      return next();
    }
    const foundRole = allowedRoles.find((v) => v === role);
    return foundRole ? next() : res.status(httpStatus.FORBIDDEN).json({ status: 'error', message: 'Access denied' });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'An error occurred' });
  }
};

module.exports = roles;
