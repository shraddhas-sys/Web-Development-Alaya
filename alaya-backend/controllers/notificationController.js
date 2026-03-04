const Notification = require("../models/Notification");

// Backward compatible part
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get notification for the current logged in user
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Backward-compatible : Simple updates
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.update({ isRead: true }, { where: { id } });
    return res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

//  (auth, ownership) mark as read
exports.markOneAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const n = await Notification.findByPk(id);
    if (!n) return res.status(404).json({ success: false, message: "Notification not found" });
    if (req.user.role !== 'admin' && n.userId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    n.isRead = true;
    await n.save();
    return res.json({ success: true, message: "Marked as read", data: n });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    return res.json({ success: true, message: "All marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const n = await Notification.findByPk(id);
    if (!n) return res.status(404).json({ success: false, message: "Notification not found" });
    if (req.user.role !== 'admin' && n.userId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    await n.destroy();
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
