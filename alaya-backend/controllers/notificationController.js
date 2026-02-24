const Notification = require("../models/Notification");

exports.addNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                message: "userId and message are required"
            });
        }

        const notification = await Notification.create({
            userId,
            title,
            message,
            type: type || "info",
            isRead: false
        });

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// --------------------
// Get All Notifications (by user)
// --------------------
exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        });

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        notification.isRead = true;
        await notification.save();

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        await Notification.destroy({ where: { id } });

        res.json({
            success: true,
            message: "Notification deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
