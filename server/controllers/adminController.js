const db = require("../config/db");

exports.getAllUsers = (req, res) => {
  const query = "SELECT * FROM Users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};
