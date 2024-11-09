const db = require("../config/db");

const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// --------------------- ADMIN CONTROLLER --------------------------

// 1. Function to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM Users");
    res.json(users);
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
};

// 2. Function to add a new user (passenger, employee, admin)
exports.addUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, password, email, role]
    );
    res
      .status(201)
      .json({ userId: result.insertId, message: "User added successfully" });
  } catch (error) {
    res.status(500).send("Error adding user");
  }
};

// 3. Function to delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await pool.query("DELETE FROM Users WHERE user_id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
};

// 4. Function to update a user
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, role } = req.body;
  try {
    await pool.query(
      "UPDATE Users SET username = ?, email = ?, role = ? WHERE user_id = ?",
      [username, email, role, userId]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send("Error updating user");
  }
};

// 5. Function to get all trains
exports.getAllTrains = async (req, res) => {
  try {
    const [trains] = await pool.query("SELECT * FROM Trains");
    res.json(trains);
  } catch (error) {
    res.status(500).send("Error retrieving trains");
  }
};

// 6. Function to add a new train
exports.addTrain = async (req, res) => {
  const { trainName, trainType, capacity } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO Trains (train_name, train_type, capacity) VALUES (?, ?, ?)",
      [trainName, trainType, capacity]
    );
    res
      .status(201)
      .json({ trainId: result.insertId, message: "Train added successfully" });
  } catch (error) {
    res.status(500).send("Error adding train");
  }
};

// 7. Function to delete a train
exports.deleteTrain = async (req, res) => {
  const { trainId } = req.params;
  try {
    await pool.query("DELETE FROM Trains WHERE train_id = ?", [trainId]);
    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting train");
  }
};

// 8. Function to update a train
exports.updateTrain = async (req, res) => {
  const { trainId } = req.params;
  const { trainName, trainType, capacity } = req.body;
  try {
    await pool.query(
      "UPDATE Trains SET train_name = ?, train_type = ?, capacity = ? WHERE train_id = ?",
      [trainName, trainType, capacity, trainId]
    );
    res.json({ message: "Train updated successfully" });
  } catch (error) {
    res.status(500).send("Error updating train");
  }
};

// 9. Function to get a report of tickets booked
exports.getTicketReport = async (req, res) => {
  try {
    const [tickets] = await pool.query(`
      SELECT t.ticket_id, p.name as passenger_name, tr.train_name, t.travel_date, t.seat_number, t.status
      FROM Tickets t
      JOIN Passengers p ON t.passenger_id = p.passenger_id
      JOIN Trains tr ON t.train_id = tr.train_id
    `);
    res.json(tickets);
  } catch (error) {
    res.status(500).send("Error retrieving ticket report");
  }
};
