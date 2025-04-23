const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exercise: String,
    sets: Number,
    reps: Number,
    weight: Number,
  },
  { _id: false }
);

const weeklyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekly_plan: {
    type: Map,
    of: [exerciseSchema],
    required: true,
  },
  equipment: [String],
  recommendation: String,
  diet: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkoutPlan", weeklyPlanSchema);
