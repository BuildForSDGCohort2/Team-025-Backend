const express = require("express");

const notificationController = require("../controllers/notificationController");

const notificationRouter = express.Router();

function notificationRoutes() {
  notificationRouter.route("/")
    .get(notificationController.getNotifications)
    .delete(notificationController.removeNotifications)

  return notificationRouter;
}



module.exports = notificationRoutes;
