require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const workoutPlanRoutes = require("./routes/workoutPlan.routes");
const statsRoutes = require("./routes/stats.routes");
const path = require("path");
const app = express();
const PORT = 5000;
require("dotenv").config(); // ← add this

// Middleware
const cors = require("cors");

app.use(
  cors({
    origin: "*", // ✅ set your actual frontend origin (no "*")
    credentials: true, // ✅ allow cookies/headers
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Routes
app.use("/api", userRoutes, workoutPlanRoutes, statsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Connexion DB + Démarrage Serveur
connectDB().then(() => {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`\n=== SERVEUR DÉMARRÉ SUR ${PORT} ===`);
    });
  });
});
