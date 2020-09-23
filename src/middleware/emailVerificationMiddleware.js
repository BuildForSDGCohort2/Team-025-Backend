exports.emailVerificationMiddleware = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user.emailVerifiedAt && user.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'you need to verify email to complete registration',
        data: []
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
