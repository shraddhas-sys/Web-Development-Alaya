const Pantry = require("../models/Pantry");
const Grocery = require("../models/Grocery");
const Recipe = require("../models/Recipe");
const MealPlan = require("../models/MealPlan");

exports.getAllNutritionData = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        const [pantry, grocery, recipes, mealPlans] = await Promise.all([
            Pantry.findAll({ where: { userId } }),
            Grocery.findAll({ where: { userId } }),
            Recipe.findAll({ where: { userId } }),
            MealPlan.findAll({ where: { userId } })
        ]);

        const week = {};
        mealPlans.forEach(plan => {
            week[plan.date] = {
                breakfast: plan.breakfast,
                lunch: plan.lunch,
                dinner: plan.dinner,
                notes: plan.notes
            };
        });

        res.json({
            success: true,
            pantry,
            grocery,
            recipes,
            week
        });
    } catch (error) {
        console.error("Nutrition Dashboard Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.saveMealPlan = async (req, res) => {
    try {
        const { userId, date, breakfast, lunch, dinner, notes } = req.body;

        if (!userId || !date) {
            return res.status(400).json({ success: false, message: "UserId and date required" });
        }

        const [plan] = await MealPlan.upsert({
            userId,
            date,
            breakfast,
            lunch,
            dinner,
            notes
        });

        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addPantryItem = async (req, res) => {
    try {
        const item = await Pantry.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addGroceryItem = async (req, res) => {
    try {
        const item = await Grocery.create({
            ...req.body,
            checked: false
        });
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.create({
            ...req.body,
            isfavorite: false
        });
        res.status(201).json({ success: true, data: recipe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleGroceryItem = async (req, res) => {
    try {
        const item = await Grocery.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Grocery item not found" });
        }

        item.checked = !item.checked;
        await item.save();

        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleRecipeFavorite = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        recipe.isfavorite = !recipe.isfavorite;
        await recipe.save();

        res.json({ success: true, data: recipe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deletePantryItem = async (req, res) => {
    try {
        await Pantry.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Pantry item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteGroceryItem = async (req, res) => {
    try {
        await Grocery.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Grocery item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        await Recipe.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Recipe deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
