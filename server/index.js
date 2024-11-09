// index.js
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res.status(500).json({ message: "Server error" });
            } else {
              res.status(201).json({ message: "User registered successfully" });
            }
          }
        );
      }
    }
  );
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful", token });
    }
  );
});

// Endpoint to search for trains
app.get("/search-trains", (req, res) => {
  const { origin, destination, date } = req.query;

  // SQL query to fetch available trains based on origin, destination, and date
  const query = `
    SELECT t.train_id, t.name, t.train_number, s.departure_time, s.arrival_time, t.available_seats
    FROM schedules s
    JOIN trains t ON s.train_id = t.train_id
    JOIN stations o ON s.origin_station_id = o.station_id
    JOIN stations d ON s.destination_station_id = d.station_id
    WHERE o.name = ? AND d.name = ? AND DATE(s.departure_time) = ? AND t.available_seats > 0;
  `;

  db.query(query, [origin, destination, date], (err, results) => {
    if (err) {
      console.error("Error searching for trains:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ trains: results });
  });
});

// Endpoint to book a ticket
app.post("/book-ticket/:trainId", (req, res) => {
  const { trainId } = req.params;
  const { userId, passengerName, age, seatType } = req.body;

  // Begin a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction failed" });
    }

    // Update available seats for the selected train
    const updateSeatsQuery = `
      UPDATE trains
      SET available_seats = available_seats - 1
      WHERE train_id = ? AND available_seats > 0;
    `;
    db.query(updateSeatsQuery, [trainId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return db.rollback(() => {
          console.error("Error updating seats or no available seats:", err);
          return res
            .status(400)
            .json({ error: "No available seats or error updating seats" });
        });
      }

      // Insert the booking information into the reservations table
      const insertReservationQuery = `
        INSERT INTO reservations (user_id, schedule_id, passenger_name, age, seat_type)
        VALUES (?, ?, ?, ?, ?);
      `;
      const scheduleId = req.body.scheduleId; // Schedule ID should be provided from the frontend or fetched
      db.query(
        insertReservationQuery,
        [userId, scheduleId, passengerName, age, seatType],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error inserting reservation:", err);
              return res
                .status(500)
                .json({ error: "Error processing booking" });
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error committing transaction:", err);
                return res
                  .status(500)
                  .json({ error: "Booking transaction failed" });
              });
            }
            res.json({ success: true, message: "Ticket booked successfully" });
          });
        }
      );
    });
  });
});

// Endpoint to retrieve all bookings for a user
app.get("/my-bookings", (req, res) => {
  const { userId } = req.query; // User ID from query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
      SELECT r.reservation_id, r.passenger_name, r.age, r.seat_type, t.name AS train_name, 
             s.departure_time, s.arrival_time, o.name AS origin, d.name AS destination
      FROM reservations r
      JOIN schedules s ON r.schedule_id = s.schedule_id
      JOIN trains t ON s.train_id = t.train_id
      JOIN stations o ON s.origin_station_id = o.station_id
      JOIN stations d ON s.destination_station_id = d.station_id
      WHERE r.user_id = ?;
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error retrieving bookings:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }
    res.json({ bookings: results });
  });
});

// Endpoint to cancel a booking
app.delete("/cancel-booking/:reservationId", (req, res) => {
  const { reservationId } = req.params;

  if (!reservationId) {
    return res.status(400).json({ error: "Reservation ID is required" });
  }

  // First, check if the booking exists
  const checkQuery = "SELECT * FROM reservations WHERE reservation_id = ?";
  db.query(checkQuery, [reservationId], (err, result) => {
    if (err) {
      console.error("Error checking booking:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Proceed with deletion if booking exists
    const deleteQuery = "DELETE FROM reservations WHERE reservation_id = ?";
    db.query(deleteQuery, [reservationId], (err, result) => {
      if (err) {
        console.error("Error cancelling booking:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json({ success: true, message: "Booking cancelled successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
