const Plan = require("../models/Plan");
const Session = require("../models/session");
const { createNotification, getUserStreak, toDateOnly } = require("../utils/activity");

// add plans

exports.addPlan = async (req, res) => {
  try {
    const { date, yogaType, duration, notes, userId } = req.body;

    const effectiveUserId = req.user?.id || userId; 
    if (!effectiveUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!date || !yogaType) {
      return res.status(400).json({ success: false, message: "date and yogaType are required." });
    }

    const newPlan = await Plan.create({
      userId: effectiveUserId,
      date,
      yogaType,
      duration: duration ? parseInt(duration, 10) : 30,
      notes: notes || null,
      status: "planned",
      completedAt: null
    });

    // Notification - planned/created
    await createNotification({
      userId: effectiveUserId,
      title: "Planner",
      message: `Planned: ${yogaType} on ${date} (${newPlan.duration} mins).`,
      type: "info"
    });

    return res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    console.error("Plan Controller (Add) Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// completed plan
exports.completePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    // admin
    if (req.user && req.user.role !== 'admin' && parseInt(plan.userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (String(plan.status || "planned") === "completed") {
      return res.status(400).json({ success: false, message: "Plan already completed" });
    }

    // Capture streak 
    const beforeStreak = await getUserStreak(plan.userId);

    // Mark plan completed
    plan.status = "completed";
    plan.completedAt = new Date();
    await plan.save();

    // Create a completed session record 
    const completedSession = await Session.create({
      userId: plan.userId,
      date: toDateOnly(plan.date),
      type: plan.yogaType || "Yoga",
      durationMinutes: parseInt(plan.duration || 30, 10),
      status: "completed",
      completedAt: new Date(),
      sourcePlanId: plan.id,
      notes: plan.notes || null
    });

    // Notification: completed
    await createNotification({
      userId: plan.userId,
      title: "Completion",
      message: `Completed: ${completedSession.type} (${completedSession.durationMinutes} mins) on ${completedSession.date}.`,
      type: "success"
    });

    // Notification: streak update 
    const afterStreak = await getUserStreak(plan.userId);
    if (afterStreak > beforeStreak && afterStreak >= 2) {
      await createNotification({
        userId: plan.userId,
        title: "Streak",
        message: `Streak updated: ${afterStreak} days in a row. Keep the ritual alive ✨`,
        type: "success"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan completed",
      data: { plan, session: completedSession, streak: afterStreak }
    });
  } catch (error) {
    console.error("Plan Controller (Complete) Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const { userId } = req.params;

    // Self-or-admin check
    if (req.user && req.user.role !== 'admin' && parseInt(userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const plans = await Plan.findAll({
      where: { userId },
      order: [["date", "DESC"], ["createdAt", "DESC"]]
    });

    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    console.error("Plan Controller (Get) Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    // admin
    if (req.user && req.user.role !== 'admin' && parseInt(plan.userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await plan.destroy();
    return res.status(200).json({ success: true, message: "Plan deleted" });
  } catch (error) {
    console.error("Plan Controller (Delete) Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
