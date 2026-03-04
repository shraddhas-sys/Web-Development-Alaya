const express = require("express");
const router = express.Router();
const nutritionCtrl = require("../controllers/nutritionController");
const Meal = require("../models/meal");
const auth = require("../middleware/auth");

// Admin created meal library (dropdown)
router.get("/available-meals", async (req, res) => {
  try {
    const meals = await Meal.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json({ success: true, data: meals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// All nutrition data for a user 
router.get("/all/:userId", auth, nutritionCtrl.getAllNutritionData);

// Save/update meal plan for a date
router.post("/week/save", auth, nutritionCtrl.saveMealPlan);

module.exports = router;
