const express = require("express");
const router = express.Router();
const notificationCtrl = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// mark as read part
router.get("/me", auth, notificationCtrl.getMyNotifications);
router.patch("/:id/read", auth, notificationCtrl.markOneAsRead);
router.patch("/read-all", auth, notificationCtrl.markAllAsRead);
router.delete("/:id", auth, notificationCtrl.deleteOne);

// Backward-compatible 
router.get("/all/:userId", auth, notificationCtrl.getUserNotifications);
router.get("/:userId", auth, notificationCtrl.getUserNotifications);
router.patch("/read/:id", auth, notificationCtrl.markAsRead);

module.exports = router;
