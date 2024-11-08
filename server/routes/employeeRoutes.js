const express = require("express");
const {
  getEmployees,
  addEmployee,
  updateSalary,
} = require("../controllers/employeeController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authenticateToken, getEmployees); // Admin only
router.post("/add", authenticateToken, addEmployee); // Admin only
router.put("/salary", authenticateToken, updateSalary); // Admin only

module.exports = router;
