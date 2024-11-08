const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, 'passenger')`;
  db.query(query, [username, hashedPassword, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User registered successfully" });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM Users WHERE username = ?`;
  db.query(query, [username], (err, result) => {
    if (err || result.length === 0)
      return res.status(401).json({ message: "Invalid username" });

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid)
      return res.status(401).json({ token: null, message: "Invalid password" });

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );
    res.status(200).json({ token, role: user.role });
  });
};
