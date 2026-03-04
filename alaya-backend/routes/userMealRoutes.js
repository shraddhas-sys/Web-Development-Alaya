const express = require('express');
const router = express.Router();
const userMealController = require('../controllers/userMealController');

// dropdown of meals
router.get('/available-meals', userMealController.getAvailableMeals);

// meal plan save
router.post('/save-plan', userMealController.saveUserPlan);

// user planned meal
router.get('/my-plan/:userId', userMealController.getUserPlan);

module.exports = router;