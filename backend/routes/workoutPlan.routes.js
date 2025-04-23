// routes/workoutPlan.routes.js
const express = require("express");
const router = express.Router();
const {
  savePlan,
  getPlanByUser,
} = require("../controllers/workoutPlan.controller");

router.post("/plan/save", savePlan);
// routes/workoutPlan.routes.js
router.get("/plan/user/:userId", getPlanByUser);

module.exports = router;
