const WorkoutPlan = require("../models/workoutPlan.model");

// ✅ Enregistrer un plan
exports.savePlan = async (req, res) => {
  try {
    const { userId, weekly_plan, equipment, recommendation, diet } = req.body;

    const plan = new WorkoutPlan({
      user: userId,
      weekly_plan,
      equipment,
      recommendation,
      diet,
    });

    const saved = await plan.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving plan:", err);
    res.status(500).json({ message: "Error saving workout plan" });
  }
};

// ✅ Récupérer le plan existant
// controllers/workoutPlan.controller.js

exports.getPlanByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const plan = await WorkoutPlan.findOne({ user: userId.trim() });

    if (!plan) {
      return res.status(404).json({ message: "No plan found for this user." });
    }

    res.json(plan);
  } catch (err) {
    console.error("Error fetching plan:", err);
    res.status(500).json({ message: "Error fetching workout plan" });
  }
};
