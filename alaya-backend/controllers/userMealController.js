const Meal = require("../models/meal"); 
const MealPlan = require("../models/MealPlan"); 

exports.getAvailableMeals = async (req, res) => {
  try {
    // Master list of admin to pull
    const meals = await Meal.findAll();
    res.status(200).json({ success: true, meals });
  } catch (error) {
    console.error("Get Available Meals Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveUserPlan = async (req, res) => {
  try {
    const { userId, morningMealId, afternoonMealId, eveningMealId, date } = req.body;
    const plan = await MealPlan.create({ userId, morningMealId, afternoonMealId, eveningMealId, date });
    res.status(201).json({ success: true, plan });
  } catch (error) {
    console.error("Save User Plan Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const plan = await MealPlan.findOne({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};