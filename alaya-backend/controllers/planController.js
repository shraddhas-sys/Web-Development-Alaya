const Plan = require("../models/Plan");

exports.addPlan = async (req, res) => {
    try {
        const { userId, date, yogaType, duration, notes } = req.body;

        if (!userId || !date || !yogaType) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: userId, date, or yogaType" 
            });
        }

        const newPlan = await Plan.create({
            userId,
            date,
            yogaType,
            duration,
            notes
        });

        res.status(201).json({ 
            success: true, 
            data: newPlan 
        });
    } catch (error) {
        console.error("Plan Controller Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error: Could not save plan" 
        });
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const { userId } = req.params;
        const plans = await Plan.findAll({ where: { userId } });
        
        res.status(200).json({ 
            success: true, 
            data: plans 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};