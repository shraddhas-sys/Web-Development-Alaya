const Session = require("../models/session");
const { createNotification, getUserStreak, toDateOnly } = require("../utils/activity");

// New planned session
exports.addSession = async (req, res) => {
  try {
    const { date, type, durationMinutes, userId } = req.body;

    const effectiveUserId = req.user?.id || userId;
    if (!effectiveUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!type || durationMinutes === undefined || durationMinutes === null) {
      return res.status(400).json({
        success: false,
        message: "Missing fields: type and durationMinutes are required."
      });
    }

    const newSession = await Session.create({
      userId: effectiveUserId,
      date: toDateOnly(date || new Date().toISOString().split('T')[0]),
      type,
      durationMinutes: parseInt(durationMinutes, 10),
      status: "planned",
      completedAt: null
    });

    // Notification: session planned
    await createNotification({
      userId: effectiveUserId,
      title: "Ritual Planned",
      message: `Session planned: ${type} for ${newSession.date}. ✨`,
      type: "info"
    });

    return res.status(201).json({
      success: true,
      message: "Session planned in Alaya Sanctuary!",
      data: newSession
    });
  } catch (error) {
    console.error("Add Session Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Role check
    if (req.user && req.user.role !== 'admin' && parseInt(session.userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const beforeStreak = await getUserStreak(session.userId);

    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    // Notification: session completed
    await createNotification({
      userId: session.userId,
      title: "Progress",
      message: `Session completed: ${session.type}! `,
      type: "success"
    });

    const afterStreak = await getUserStreak(session.userId);
    if (afterStreak > beforeStreak && afterStreak >= 2) {
      await createNotification({
        userId: session.userId,
        title: "Streak",
        message: `Streak updated: ${afterStreak} days in a row. Keep going `,
        type: "success"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session completed in Alaya Sanctuary!",
      data: session,
      streak: afterStreak
    });
  } catch (error) {
    console.error("Complete Session Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (req.user && req.user.role !== 'admin' && parseInt(session.userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await session.destroy();

    return res.status(200).json({
      success: true,
      message: "Session removed from Sanctuary."
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Self-or-admin
    if (req.user && req.user.role !== 'admin' && parseInt(userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const sessions = await Session.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
