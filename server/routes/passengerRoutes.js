const express = require("express");
const { searchTrains } = require("../controllers/passengerController");
const router = express.Router();

router.post("/search", searchTrains);

module.exports = router;
