const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./database/db");
require("dotenv").config();

const app = express(); 

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

require("./models/user");
require("./models/session");
require("./models/Notification");
require("./models/Plan");
require("./models/Recipe");
require("./models/MealPlan");
require("./models/Grocery");
require("./models/Pantry");

app.use("/api/user", require("./routes/route")); 

app.use("/api/sessions", require("./routes/sessionRoutes")); 
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/nutrition", require("./routes/nutritionRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
    connectDB()
        .then(() => {
            return sequelize.sync({ alter: true });
        })
        .then(() => console.log("✅ Alaya Sanctuary: Database Synced & Safe Mode Active"))
        .catch((err) => console.error("❌ Database/Sync Error: ", err.message));
});