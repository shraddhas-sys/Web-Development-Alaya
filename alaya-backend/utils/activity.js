const Session = require("../models/session");
const Notification = require("../models/Notification");

const toDateOnly = (d) => {
  if (!d) return null;
  const date = (d instanceof Date) ? d : new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (yyyyMMdd, deltaDays) => {
  const [y, m, day] = yyyyMMdd.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(Date.UTC(y, m - 1, day));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  return dt.toISOString().split("T")[0];
};

// streaks part
const computeStreakFromDates = (dateStringsDesc) => {
  if (!Array.isArray(dateStringsDesc) || dateStringsDesc.length === 0) return 0;
  const unique = [];
  const seen = new Set();
  for (const d of dateStringsDesc) {
    const ds = toDateOnly(d);
    if (ds && !seen.has(ds)) {
      seen.add(ds);
      unique.push(ds);
    }
  }
  if (unique.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = unique[i - 1];
    const expected = addDays(prev, -1);
    if (unique[i] === expected) streak += 1;
    else break;
  }
  return streak;
};

const getUserStreak = async (userId) => {
  const rows = await Session.findAll({
    where: {
      userId,
      status: 'completed',
      completedAt: { [require('sequelize').Op.ne]: null }
    },
    attributes: ["completedAt"],
    order: [["completedAt", "DESC"]]
  });
  const dates = rows.map((r) => r.completedAt);
  return computeStreakFromDates(dates);
};

const createNotification = async ({ userId, title = null, message, type = "info" }) => {
  if (!userId || !message) return null;
  return Notification.create({ userId, title, message, type });
};

module.exports = {
  toDateOnly,
  computeStreakFromDates,
  getUserStreak,
  createNotification
};
