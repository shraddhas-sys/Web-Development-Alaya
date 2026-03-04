const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const favoriteCtrl = require("../controllers/favoriteController");

// Dashboard Data admin only
router.get("/all-data", auth, adminAuth, adminCtrl.getAllData);

// Global search 
router.get("/global-search", auth, adminCtrl.globalSearch);

// Yoga Library
router.get("/yoga-types", auth, adminCtrl.getYogaTypes); 
router.post("/yoga-types/add", auth, adminAuth, adminCtrl.addYogaType);
router.put("/yoga-types/:id", auth, adminAuth, adminCtrl.updateYogaType);
router.delete("/yoga-types/:id", auth, adminAuth, adminCtrl.deleteYogaType);

// Backward-compatible  
router.post("/add-yoga", auth, adminAuth, adminCtrl.addYogaType);
router.delete("/yoga-type/:id", auth, adminAuth, adminCtrl.deleteYogaType);

// Meals Management (admin only)
router.get("/meals", auth, adminAuth, adminCtrl.getMeals);
router.post("/meals", auth, adminAuth, adminCtrl.addMeal);
router.put("/meals/:id", auth, adminAuth, adminCtrl.updateMeal);
router.delete("/meals/:id", auth, adminAuth, adminCtrl.deleteMeal);

//  NutritionLibraryTab 
router.get("/recipes", auth, adminAuth, adminCtrl.getMeals);
router.post("/recipes", auth, adminAuth, adminCtrl.addMeal);
router.delete("/recipes/:id", auth, adminAuth, adminCtrl.deleteMeal);

// Seekers management (admin only)
router.get("/users", auth, adminAuth, adminCtrl.getUsers);
router.delete("/user/:id", auth, adminAuth, adminCtrl.deleteUser);
router.patch("/user/disable/:id", auth, adminAuth, adminCtrl.disableUser);

// Sessions/progress (admin only)
router.get("/all-sessions", auth, adminAuth, adminCtrl.getAllSessions);
router.get("/user/:userId/sessions", auth, adminAuth, adminCtrl.getUserSessions);
router.delete("/sessions/:id", auth, adminAuth, adminCtrl.deleteSession);
router.get("/global-progress", auth, adminAuth, adminCtrl.getGlobalProgress);

// Favorites overview (admin only)
router.get("/favorites", auth, adminAuth, favoriteCtrl.adminListAll);

module.exports = router;
