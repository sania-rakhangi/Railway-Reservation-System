const db = require("../config/db");

// Book a Ticket
exports.bookTicket = (req, res) => {
  const { user_id, train_id, passenger_details, payment_info } = req.body;

  // Insert passenger details
  db.query("INSERT INTO Passengers SET ?", passenger_details, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const passenger_id = result.insertId;

    // Insert ticket details
    const ticketData = {
      user_id,
      train_id,
      passenger_id,
      booking_date: new Date(),
    };
    db.query("INSERT INTO Tickets SET ?", ticketData, (err, ticketResult) => {
      if (err) return res.status(500).json({ error: err.message });

      // Handle payment (insert payment record)
      const paymentData = {
        user_id,
        ticket_id: ticketResult.insertId,
        ...payment_info,
      };
      db.query("INSERT INTO Payments SET ?", paymentData, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Ticket booked successfully" });
      });
    });
  });
};

// Get Booked Tickets for a User
exports.getBookedTickets = (req, res) => {
  const user_id = req.user.id;
  const query = `
    SELECT Tickets.*, Trains.name AS train_name, Passengers.name AS passenger_name
    FROM Tickets
    JOIN Trains ON Tickets.train_id = Trains.train_id
    JOIN Passengers ON Tickets.passenger_id = Passengers.passenger_id
    WHERE Tickets.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};
