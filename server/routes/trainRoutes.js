const express = require("express");
const {
  getTrains,
  addTrain,
  updateSchedule,
} = require("../controllers/trainController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getTrains);
router.post("/add", authenticateToken, addTrain); // Admin only
router.put("/schedule", authenticateToken, updateSchedule); // Admin only

module.exports = router;
