const User = require("../models/user");
const Session = require("../models/session");
const YogaType = require("../models/yogaType");
const Meal = require("../models/meal");
const { Op } = require("sequelize");


exports.getAllData = async (req, res) => {
  try {
    const [users, yogaList, mealList, totalSessions] = await Promise.all([
      User.findAll({
        attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
        order: [['createdAt', 'DESC']],
        limit: 50
      }),
      YogaType.findAll({ order: [['createdAt', 'DESC']] }),
      Meal.findAll({ order: [['createdAt', 'DESC']] }),
      Session.count().catch(() => 0)
    ]);

    return res.status(200).json({
      success: true,
      users: users || [],
      yoga: yogaList || [],
      nutrition: mealList || [],
      totalUsers: users?.length || 0,
      totalSessions: totalSessions || 0,
      totalRituals: (yogaList?.length || 0) + (mealList?.length || 0),
      revenue: "$12,450",
      growth: "85%"
    });
  } catch (error) {
    console.error("Dashboard Sync Error:", error);
    return res.status(500).json({ success: false, message: "Sync failed" });
  }
};

// Yoga Types
exports.getYogaTypes = async (req, res) => {
  try {
    const yogaTypes = await YogaType.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: yogaTypes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addYogaType = async (req, res) => {
  try {
    const { name, description, durationDefault } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: "Yoga name is required" });

    const exists = await YogaType.findOne({ where: { name: { [Op.iLike]: name.trim() } } }).catch(() => null);
    if (exists) return res.status(409).json({ success: false, message: "Yoga type already exists" });

    const newYoga = await YogaType.create({
      name: name.trim(),
      description: description || null,
      durationDefault: durationDefault ? parseInt(durationDefault, 10) : 30
    });
    return res.status(201).json({ success: true, data: newYoga });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateYogaType = async (req, res) => {
  try {
    const { id } = req.params;
    const yoga = await YogaType.findByPk(id);
    if (!yoga) return res.status(404).json({ success: false, message: "Yoga type not found" });

    const { name, description, durationDefault } = req.body;
    if (name !== undefined) yoga.name = name;
    if (description !== undefined) yoga.description = description;
    if (durationDefault !== undefined) yoga.durationDefault = parseInt(durationDefault, 10);

    await yoga.save();
    return res.status(200).json({ success: true, data: yoga });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteYogaType = async (req, res) => {
  try {
    const { id } = req.params;
    const yoga = await YogaType.findByPk(id);
    if (!yoga) return res.status(404).json({ success: false, message: "Yoga type not found" });
    await yoga.destroy();
    return res.status(200).json({ success: true, message: "Yoga type deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Meals

exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: meals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMeal = async (req, res) => {
  try {
    const { name, ingredients, kcal, timeSlot, category, image } = req.body;
    if (!name || !timeSlot) {
      return res.status(400).json({ success: false, message: "name and timeSlot are required" });
    }

    const newMeal = await Meal.create({
      name,
      ingredients: ingredients || null,
      kcal: kcal !== undefined && kcal !== "" ? parseInt(kcal, 10) : null,
      timeSlot,
      category: category || null,
      image: image || null
    });

    return res.status(201).json({ success: true, data: newMeal });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findByPk(id);
    if (!meal) return res.status(404).json({ success: false, message: "Meal not found" });

    const { name, ingredients, kcal, timeSlot, category, image } = req.body;
    if (name !== undefined) meal.name = name;
    if (ingredients !== undefined) meal.ingredients = ingredients;
    if (kcal !== undefined && kcal !== "") meal.kcal = parseInt(kcal, 10);
    if (timeSlot !== undefined) meal.timeSlot = timeSlot;
    if (category !== undefined) meal.category = category;
    if (image !== undefined) meal.image = image;

    await meal.save();
    return res.status(200).json({ success: true, data: meal });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findByPk(id);
    if (!meal) return res.status(404).json({ success: false, message: "Meal not found" });
    await meal.destroy();
    return res.status(200).json({ success: true, message: "Meal deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Seekers
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: "Admin accounts are protected" });

    await user.destroy();
    return res.status(200).json({ success: true, message: "Seeker removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: "Admin accounts are protected" });

    user.isDisabled = true;
    await user.save();

    return res.status(200).json({ success: true, message: "User disabled", user: { id: user.id, isDisabled: user.isDisabled } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  Sessions and Progress
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      include: [{ model: User, as: 'seeker', attributes: ['id', 'username', 'email', 'role'] }]
    });

    return res.status(200).json({ success: true, sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    return res.status(200).json({ success: true, sessions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    await session.destroy();
    return res.status(200).json({ success: true, message: "Session deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGlobalProgress = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } }).catch(() => 0);

    const since = new Date();
    since.setDate(since.getDate() - 7);

    // Live active seen within last 15 minutes
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const liveActiveCount = await User.count({
      where: {
        lastSeen: { [Op.gte]: fifteenMinsAgo },
        role: 'user'
      }
    }).catch(() => 0);

    const activeUserIds = await Session.findAll({
      attributes: ['userId'],
      where: { date: { [Op.gte]: since.toISOString().split('T')[0] } },
      group: ['userId']
    });

    const activeCount = activeUserIds?.length || 0;
    const completedPct = totalUsers > 0 ? Math.round((activeCount / totalUsers) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        completed: completedPct,
        active: liveActiveCount 
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Search
exports.globalSearch = async (req, res) => {
  try {
    const q = (req.query.query || '').trim();
    if (!q) {
      return res.status(200).json({ success: true, results: { users: [], recipes: [] } });
    }

    //  Restrict search results based on role
    let users = [];
    let meals = [];

    const searchQueries = [
      Meal.findAll({
        where: { name: { [Op.iLike]: `%${q}%` } },
        limit: 8,
        order: [['createdAt', 'DESC']]
      })
    ];

    // Only admins can search other users
    if (req.user.role === 'admin') {
      searchQueries.push(
        User.findAll({
          where: {
            [Op.or]: [
              { username: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } }
            ]
          },
          attributes: ['id', 'username', 'email', 'role', 'isDisabled', 'lastLoginAt', 'loginCount', 'failedLoginCount'],
          limit: 8,
          order: [['createdAt', 'DESC']]
        })
      );
    }

    const results = await Promise.all(searchQueries);
    meals = results[0] || [];
    if (req.user.role === 'admin') {
      users = results[1] || [];
    }

    return res.status(200).json({
      success: true,
      results: {
        users: users || [],
        recipes: meals || [] 
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
