const db = require("../config/db");

exports.searchTrains = (req, res) => {
  const { origin, destination, date } = req.body;

  const query = `
    SELECT * FROM Trains 
    JOIN Schedule ON Trains.train_id = Schedule.train_id 
    WHERE Schedule.origin = ? AND Schedule.destination = ? AND Schedule.date = ?`;

  db.query(query, [origin, destination, date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};
