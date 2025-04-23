const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

router.post("/stats", statsController.updateStats);
router.get("/stats/user/:userId", statsController.getStatsByUser);

module.exports = router;
