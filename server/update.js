// Update Reservation Route
app.put("/update-booking/:reservationId", (req, res) => {
  const { reservationId } = req.params;
  const { passengerName, age, seatType } = req.body;

  // Check if the reservation exists
  const checkQuery = "SELECT * FROM reservations WHERE reservation_id = ?";
  db.query(checkQuery, [reservationId], (err, result) => {
    if (err) {
      console.error("Error checking reservation:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Proceed with updating the reservation
    const updateQuery = `
      UPDATE reservations 
      SET passenger_name = ?, age = ?, seat_type = ?
      WHERE reservation_id = ?;
    `;
    db.query(updateQuery, [passengerName, age, seatType, reservationId], (err, result) => {
      if (err) {
        console.error("Error updating reservation:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ success: true, message: "Reservation updated successfully" });
    });
  });
});
