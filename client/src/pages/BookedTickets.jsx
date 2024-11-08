import { getData } from "../utils/api";
import { useState, useEffect } from "react";

export default function BookedTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const result = await getData("/tickets/booked", true);
      setTickets(result);
    };
    fetchTickets();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Booked Tickets</h2>
      <div className="mt-4">
        {tickets.map((ticket, index) => (
          <div key={index} className="p-4 bg-white border rounded mb-4">
            <p>Train Name: {ticket.train_name}</p>
            <p>Passenger Name: {ticket.passenger_name}</p>
            <p>Booking Date: {ticket.booking_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
