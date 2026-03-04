const express = require("express");
const cors = require('cors');
const { connectDB, sequelize } = require("./database/db");
require("dotenv").config();

// Admin routes 
const adminRoutes = require("./routes/adminRoutes");

// Models laod
const User = require("./models/user");
const Session = require("./models/session");
const Plan = require("./models/Plan");
const MealPlan = require("./models/MealPlan");
const Meal = require("./models/meal");
const Notification = require("./models/Notification");
const Recipe = require("./models/Recipe");
const YogaType = require("./models/yogaType");
const Favorite = require("./models/Favorite");

// Initializing App 
const app = express();

// Middleware

// CORS Policy Setup
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {

  const urlParts = req.url.split('?');
  urlParts[0] = urlParts[0].toLowerCase();
  req.url = urlParts.join('?');
  next();
});

// Request Logger 
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Associations (Database Relationships) 
User.hasMany(Session, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'seeker' });

User.hasMany(Plan, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'plans' });
Plan.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Favorite, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(MealPlan, { foreignKey: 'userId', onDelete: 'CASCADE', constraints: false });
MealPlan.belongsTo(User, { foreignKey: 'userId', constraints: false });

MealPlan.belongsTo(Meal, { foreignKey: 'morningMealId', as: 'morning', constraints: false });
MealPlan.belongsTo(Meal, { foreignKey: 'afternoonMealId', as: 'afternoon', constraints: false });
MealPlan.belongsTo(Meal, { foreignKey: 'eveningMealId', as: 'evening', constraints: false });

// Routes registration
app.use("/api/admin", adminRoutes);
app.use("/api/nutrition", require("./routes/nutritionRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/user/meals", require("./routes/userMealRoutes"));
app.use("/api/user", require("./routes/route"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found in Alaya Sanctuary.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong in the core!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Server startup
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });

    
  try {
      await sequelize.query(
        'UPDATE "Sessions" SET "completedAt" = COALESCE("completedAt", "createdAt") WHERE "completedAt" IS NULL AND ("status" IS NULL OR "status" = \'completed\')'
      );
    } catch (e) {

    }

    console.log(" Alaya Sanctuary: Database Synced & Harmonized");

    app.listen(PORT, () => {
      console.log(`ALAYA SERVER RUNNING ON PORT ${PORT}`);
    });
  } catch (err) {
    console.error(" Database Connection Error: ", err.message);
    process.exit(1);
  }
};

startServer();