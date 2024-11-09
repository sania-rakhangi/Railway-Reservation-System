import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Ensure secure handling in production

      if (!userId) {
        alert("User not logged in");
        return;
      }

      const response = await axios.get("http://localhost:5000/my-bookings", {
        params: { userId },
      });

      if (response.data && response.data.bookings) {
        setBookings(response.data.bookings);
      } else {
        alert("No bookings found");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/cancel-booking/${reservationId}`
      );

      if (response.data.success) {
        setBookings((prevBookings) =>
          prevBookings.filter(
            (booking) => booking.reservation_id !== reservationId
          )
        );
        alert("Booking cancelled successfully.");
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading bookings...</p>
      ) : (
        <div className="w-full lg:w-3/4 space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.reservation_id}
                className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.train_name}
                  </h3>
                  <p className="text-gray-600">
                    Passenger: {booking.passenger_name}, Age: {booking.age}
                  </p>
                  <p className="text-gray-600">
                    From: {booking.origin} - To: {booking.destination}
                  </p>
                  <p className="text-gray-600">
                    Departure:{" "}
                    {new Date(booking.departure_time).toLocaleString()} -
                    Arrival: {new Date(booking.arrival_time).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Seat Type: {booking.seat_type}
                  </p>
                </div>
                <button
                  onClick={() => handleCancel(booking.reservation_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Cancel booking for ${booking.train_name}`}
                >
                  Cancel Booking
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No bookings found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
