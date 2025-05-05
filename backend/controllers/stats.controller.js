const DailyStats = require("../models/dailyStats.model");

exports.updateStats = async (req, res) => {
  const { userId, date, steps, caloriesBurned } = req.body;
  if (!userId || !date) {
    return res.status(400).json({ message: "userId and date are required" });
  }
  try {
    const d = new Date(date);
    const stats = await DailyStats.findOneAndUpdate(
      { user: userId, date: d },
      { $set: { steps, caloriesBurned } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(stats);
  } catch (err) {
    console.error("Error updating stats:", err);
    res.status(500).json({ message: "Error updating stats" });
  }
};

exports.getStatsByUser = async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.days, 10) || 7;
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (limit - 1));
    const stats = await DailyStats.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });
    res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
exports.getAllStats = async (req, res) => {
  try {
    const stats = await DailyStats.find({}).sort({ date: -1 });
    res.json(stats);
  } catch (err) {
    console.error("Error fetching all stats:", err);
    res.status(500).json({ message: "Error fetching all stats" });
  }
};
