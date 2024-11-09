import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookingTicket() {
  const { trainId } = useParams(); // Retrieve trainId from URL params
  const [trainDetails, setTrainDetails] = useState({});
  const [bookingData, setBookingData] = useState({
    passengerName: "",
    age: "",
    seatType: "",
  });
  const [userId, setUserId] = useState(null); // Will be set dynamically, or from localStorage or state

  useEffect(() => {
    // Fetch train details using trainId
    const fetchTrainDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/train-details/${trainId}`
        );
        setTrainDetails(response.data);
      } catch (error) {
        console.error("Error fetching train details:", error);
      }
    };
    fetchTrainDetails();
  }, [trainId]);

  // Set user ID, you can adjust this to pull from the localStorage or context
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // Fetch userId from localStorage (or state/context)
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Handle case when userId is not available (redirect to login or show error)
      alert("User not logged in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const { passengerName, age, seatType } = bookingData;

    if (!passengerName || !age || !seatType) {
      alert("Please fill out all fields");
      return;
    }

    console.log("Booking data:", bookingData);
    console.log("Train details:", trainDetails);

    try {
      const response = await axios.post("http://localhost:5000/book-ticket", {
        userId,
        trainId,
        scheduleId: trainDetails.scheduleId, // Ensure this is passed dynamically from trainDetails
        passengerName,
        age,
        seatType,
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Error booking the ticket:", error);
      alert(
        error.response
          ? error.response.data.message
          : "Failed to book ticket. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Book Your Ticket
      </h2>
      {trainDetails.name ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-3/4 lg:w-1/2">
          <h3 className="text-xl font-semibold mb-4">{trainDetails.name}</h3>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-gray-700">Passenger Name</label>
              <input
                type="text"
                name="passengerName"
                value={bookingData.passengerName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={bookingData.age}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Seat Type</label>
              <select
                name="seatType"
                value={bookingData.seatType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="">Select Seat Type</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Second AC">Second AC</option>
                <option value="Third AC">Third AC</option>
                <option value="First AC">First AC</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Book Ticket
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-600">Loading train details...</p>
      )}
    </div>
  );
}

export default BookingTicket;
