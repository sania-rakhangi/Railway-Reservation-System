const express = require("express");
const {
  bookTicket,
  getBookedTickets,
} = require("../controllers/ticketController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/book", authenticateToken, bookTicket);
router.get("/booked", authenticateToken, getBookedTickets);

module.exports = router;
