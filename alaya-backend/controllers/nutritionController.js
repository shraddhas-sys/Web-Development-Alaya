const Meal = require("../models/meal");
const MealPlan = require("../models/MealPlan");

// Dropdown/library meals
exports.getAvailableMeals = async (req, res) => {
  try {
    const meals = await Meal.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json({ success: true, data: meals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// save meal
exports.saveMealPlan = async (req, res) => {
  try {
    const { userId, date } = req.body;
    const effectiveUserId = req.user?.id || userId;

    if (!effectiveUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Self or admin
    if (req.user && req.user.role !== 'admin' && parseInt(effectiveUserId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const payloadMeals = req.body.meals || req.body;
    const breakfast = payloadMeals.breakfast || null;
    const lunch = payloadMeals.lunch || null;
    const dinner = payloadMeals.dinner || null;
    const notes = payloadMeals.notes || null;

    if (!date) {
      return res.status(400).json({ success: false, message: "date is required" });
    }

    // Upsert (one plan per user per date)
    const [plan, created] = await MealPlan.findOrCreate({
      where: { userId: effectiveUserId, date },
      defaults: { userId: effectiveUserId, date, breakfast, lunch, dinner, notes }
    });

    if (!created) {
      plan.breakfast = breakfast;
      plan.lunch = lunch;
      plan.dinner = dinner;
      plan.notes = notes;
      await plan.save();
    }

    return res.status(200).json({ success: true, message: "Meal plan saved successfully! ✨", plan });
  } catch (err) {
    console.error("SaveMealPlan Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Load all nutrition data (week mapping + recipes placeholder)
exports.getAllNutritionData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Self or admin
    if (req.user && req.user.role !== 'admin' && parseInt(userId, 10) !== parseInt(req.user.id, 10)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const plans = await MealPlan.findAll({
      where: { userId },
      order: [['date', 'DESC']]
    });

    const week = {};
    for (const p of plans) {
      const key = (p.date && typeof p.date === 'string') ? p.date : (p.date?.toISOString?.().split('T')[0]);
      if (!key) continue;
      week[key] = {
        breakfast: p.breakfast || "",
        lunch: p.lunch || "",
        dinner: p.dinner || "",
        notes: p.notes || ""
      };
    }

    return res.status(200).json({
      success: true,
      pantry: [],
      grocery: [],
      recipes: [],
      week
    });
  } catch (err) {
    console.error("GetAllNutritionData Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
