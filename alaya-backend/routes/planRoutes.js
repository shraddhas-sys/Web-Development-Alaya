const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan"); 

router.post("/add", async (req, res) => {
  try {
    const { userId, date, yogaType, duration, notes } = req.body;
    if (!userId || !date || !yogaType) {
      return res.status(400).json({ 
        success: false, 
        message: "UserId, Date, and YogaType are required fields." 
      });
    }

    const newPlan = await Plan.create({
      userId,
      date,
      yogaType,
      duration: duration || 30, 
      notes: notes || ""
    });

    res.status(201).json({ 
      success: true, 
      message: "Ritual planned successfully!",
      data: newPlan 
    });
  } catch (err) {
    console.error("Plan Route Error:", err.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to save plan: " + err.message 
    });
  }
});

router.get("/all/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await Plan.findAll({ 
      where: { userId },
      order: [['date', 'ASC']] 
    });

    res.json({ 
      success: true, 
      data: plans 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;