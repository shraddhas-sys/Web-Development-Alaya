const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator"); 
const notificationController = require("../controllers/notificationController");

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("userId").notEmpty().withMessage("User ID is required"),
  ],
  notificationController.addNotification
);

router.get(
  "/user/:userId",
  [param("userId").notEmpty().withMessage("User ID is required")],
  notificationController.getNotifications
);

router.patch(
  "/:id/read",
  [param("id").notEmpty().withMessage("Notification ID is required")],
  notificationController.markAsRead
);

router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("Notification ID is required")],
  notificationController.deleteNotification
);

module.exports = router;