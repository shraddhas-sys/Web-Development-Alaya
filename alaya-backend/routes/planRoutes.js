const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const auth = require("../middleware/auth");

// Add plan 
router.post("/add", auth, planController.addPlan);

// List plans for a user
router.get("/all/:userId", auth, planController.getAllPlans);

// Delete plan 
router.delete("/delete/:id", auth, planController.deletePlan);

// Complete plan 
router.patch("/:id/complete", auth, planController.completePlan);

module.exports = router;
