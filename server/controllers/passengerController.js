const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// --------------------- PASSENGER CONTROLLER --------------------------

// 1. Function to view all available trains
exports.getAllTrains = async (req, res) => {
  try {
    const [trains] = await pool.query("SELECT * FROM Trains");
    res.json(trains);
  } catch (error) {
    res.status(500).send("Error retrieving trains");
  }
};

// 2. Function to book a ticket
exports.bookTicket = async (req, res) => {
  const { passengerId, trainId, travelDate, seatNumber } = req.body;

  try {
    // Check if seat is already booked for the given train and date
    const [existingBooking] = await pool.query(
      "SELECT * FROM Tickets WHERE train_id = ? AND travel_date = ? AND seat_number = ?",
      [trainId, travelDate, seatNumber]
    );

    if (existingBooking.length > 0) {
      return res
        .status(400)
        .json({ message: "Seat is already booked for this train and date" });
    }

    // Book the ticket
    const [result] = await pool.query(
      "INSERT INTO Tickets (passenger_id, train_id, travel_date, seat_number, status) VALUES (?, ?, ?, ?, ?)",
      [passengerId, trainId, travelDate, seatNumber, "booked"]
    );

    res
      .status(201)
      .json({
        ticketId: result.insertId,
        message: "Ticket booked successfully",
      });
  } catch (error) {
    res.status(500).send("Error booking ticket");
  }
};

// 3. Function to cancel a ticket
exports.cancelTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const [ticket] = await pool.query(
      "SELECT * FROM Tickets WHERE ticket_id = ?",
      [ticketId]
    );

    if (ticket.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket[0].status === "canceled") {
      return res.status(400).json({ message: "Ticket is already canceled" });
    }

    // Cancel the ticket
    await pool.query("UPDATE Tickets SET status = ? WHERE ticket_id = ?", [
      "canceled",
      ticketId,
    ]);

    res.json({ message: "Ticket canceled successfully" });
  } catch (error) {
    res.status(500).send("Error canceling ticket");
  }
};

// 4. Function to view all tickets for a specific passenger (ticket history)
exports.getMyTickets = async (req, res) => {
  const { passengerId } = req.params;

  try {
    const [tickets] = await pool.query(
      `SELECT t.ticket_id, tr.train_name, t.travel_date, t.seat_number, t.status 
       FROM Tickets t 
       JOIN Trains tr ON t.train_id = tr.train_id 
       WHERE t.passenger_id = ?`,
      [passengerId]
    );

    res.json(tickets);
  } catch (error) {
    res.status(500).send("Error retrieving tickets");
  }
};

// 5. Function to view train schedules (by train)
exports.getTrainSchedule = async (req, res) => {
  const { trainId } = req.params;

  try {
    const [schedule] = await pool.query(
      `SELECT s.schedule_id, st.station_name, s.arrival_time, s.departure_time 
       FROM Schedule s 
       JOIN Stations st ON s.station_id = st.station_id 
       WHERE s.train_id = ?`,
      [trainId]
    );

    res.json(schedule);
  } catch (error) {
    res.status(500).send("Error retrieving schedule");
  }
};

// 6. Function to view available seats on a train for a specific date
exports.getAvailableSeats = async (req, res) => {
  const { trainId, travelDate } = req.params;

  try {
    // Get total seats
    const [[train]] = await pool.query(
      "SELECT capacity FROM Trains WHERE train_id = ?",
      [trainId]
    );

    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    // Get booked seats for the given train and date
    const [bookedSeats] = await pool.query(
      'SELECT seat_number FROM Tickets WHERE train_id = ? AND travel_date = ? AND status = "booked"',
      [trainId, travelDate]
    );

    const bookedSeatNumbers = bookedSeats.map((seat) => seat.seat_number);
    const totalSeats = Array.from({ length: train.capacity }, (_, i) => i + 1);
    const availableSeats = totalSeats.filter(
      (seat) => !bookedSeatNumbers.includes(seat)
    );

    res.json({ availableSeats });
  } catch (error) {
    res.status(500).send("Error retrieving available seats");
  }
};
