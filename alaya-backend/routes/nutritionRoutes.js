const express = require("express");
const router = express.Router();
const nutritionCtrl = require("../controllers/nutritionController");

router.get("/all/:userId", nutritionCtrl.getAllNutritionData);
router.post("/pantry/add", nutritionCtrl.addPantryItem);
router.delete("/pantry/:id", nutritionCtrl.deletePantryItem);

router.post("/grocery/add", nutritionCtrl.addGroceryItem);
router.patch("/grocery/toggle/:id", nutritionCtrl.toggleGroceryItem);
router.delete("/grocery/:id", nutritionCtrl.deleteGroceryItem);

router.post("/week/save", nutritionCtrl.saveMealPlan);

router.post("/recipes/add", nutritionCtrl.addRecipe);
router.patch("/recipes/favorite/:id", nutritionCtrl.toggleRecipeFavorite);
router.delete("/recipes/:id", nutritionCtrl.deleteRecipe);

module.exports = router;