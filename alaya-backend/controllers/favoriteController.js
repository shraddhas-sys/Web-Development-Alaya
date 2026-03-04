const Favorite = require("../models/Favorite");
const Meal = require("../models/meal");
const Plan = require("../models/Plan");
const YogaType = require("../models/yogaType");
const Recipe = require("../models/Recipe");
const Notification = require("../models/Notification");
const User = require("../models/user");

// Helper
const notifyAdmins = async (message) => {
  try {
    const admins = await User.findAll({ where: { role: "admin", isDisabled: false } });
    for (const a of admins) {
      await Notification.create({ userId: a.id, message, title: "Favourite", type: "info", isRead: false });
    }
  } catch (e) { }
};



const resolveItem = async ({ itemType, itemId }) => {
  if (!itemType || !itemId) return null;
  if (itemType === "meal") return await Meal.findByPk(itemId);
  if (itemType === "plan") return await Plan.findByPk(itemId);
  if (itemType === "session") {
    const Session = require("../models/session");
    return await Session.findByPk(itemId);
  }
  if (itemType === "yogaType") return await YogaType.findByPk(itemId);
  if (itemType === "recipe") return await Recipe.findByPk(itemId);
  return null;
};
// Get all favorites
exports.listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const favs = await Favorite.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
    const enriched = [];
    for (const f of favs) {
      const item = await resolveItem({ itemType: f.itemType, itemId: f.itemId });
      enriched.push({ ...f.toJSON(), item: item ? item.toJSON() : null });
    }
    return res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) return res.status(400).json({ success: false, message: "itemType and itemId are required" });

    const exists = await resolveItem({ itemType, itemId });
    if (!exists) return res.status(404).json({ success: false, message: "Target item not found" });

    const [fav, created] = await Favorite.findOrCreate({
      where: { userId, itemType, itemId },
      defaults: { userId, itemType, itemId }
    });

    if (created) { await notifyAdmins(`A seeker added a ${itemType} to favourites.`); }
    return res.status(200).json({ success: true, message: created ? "Added to favorites" : "Already in favorites", data: fav });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const fav = await Favorite.findByPk(id);
    if (!fav) return res.status(404).json({ success: false, message: "Favorite not found" });
    if (req.user.role !== "admin" && fav.userId !== req.user.id) return res.status(403).json({ success: false, message: "Forbidden" });
    await fav.destroy();
    return res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminListAll = async (req, res) => {
  try {
    const User = require("../models/user");
    const favs = await Favorite.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "username", "email", "role"] }],
      order: [["createdAt", "DESC"]]
    });

    const enriched = [];
    for (const f of favs) {
      const item = await resolveItem({ itemType: f.itemType, itemId: f.itemId });
      enriched.push({ ...f.toJSON(), item: item ? item.toJSON() : null });
    }

    return res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
