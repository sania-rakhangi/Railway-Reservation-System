const db = require("../config/db");

// Fetch All Trains
exports.getTrains = (req, res) => {
  const query = "SELECT * FROM Trains";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Add a New Train (Admin)
exports.addTrain = (req, res) => {
  const trainData = req.body;
  db.query("INSERT INTO Trains SET ?", trainData, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Train added successfully" });
  });
};

// Update Train Schedule
exports.updateSchedule = (req, res) => {
  const { train_id, schedule } = req.body;
  db.query(
    "UPDATE Schedule SET ? WHERE train_id = ?",
    [schedule, train_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Schedule updated successfully" });
    }
  );
};
