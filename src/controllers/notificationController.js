const httpStatus = require("http-status-codes");
const { Notification } = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const { query, opts } = req.query;
    const condition = { ...JSON.parse(query), to: req.user.id };
    const notifications = await Notification.find(condition, null,
      JSON.parse(opts));
    return res.status(httpStatus.OK).json({
      totalCount: notifications.length,
      notifications });
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred"
    });
  }

};

const removeNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ to: req.user.id }).exec();
    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    debug(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred"
    });
  }
};

module.exports = {
  getNotifications,
  removeNotifications
};
