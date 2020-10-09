const { verifyToken } = require('../utils/authHelper');
const { messages } = require('../utils/messages');

// const { roles } = require('../roles');

const { User } = require('../models/user');

exports.grantAccess = (permission) => async (req, res, next) => {
  try {
    if (!permission.granted) {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action"
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const { invalidToken, noToken } = messages;

const errorResponse = (res, status, statusMessage, error) =>
  res.status(status).json({
    status: statusMessage,
    error
  });

exports.allowIfLoggedin = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  try {
    if (token) {
      const decoded = await verifyToken(token);
      const user = await User.findOne({ _id: decoded.userId });
      if (!user) {
        return errorResponse(res, 401, 'error', invalidToken);
      }
      req.payload = { ...req.payload, user };
      req.decoded = decoded;
      res.locals.loggedInUser = user;
      req.user = user;
      return next();
    }
    return errorResponse(res, 401, 'error', noToken);
  } catch (error) {
    return errorResponse(res, 500, 'error', error.message.toString());
  }
};
