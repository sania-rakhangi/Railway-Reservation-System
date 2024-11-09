import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BookTicket() {
  const { trainId } = useParams(); // Extract trainId from URL
  const navigate = useNavigate();

  // Initial state for the form
  const [formData, setFormData] = useState({
    passengerName: "",
    age: "",
    seatType: "Economy", // Default seat type
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!formData.passengerName || !formData.age || !formData.seatType) {
      alert("Please fill all fields.");
      return;
    }

    // Convert age to a number to ensure it is valid
    const age = Number(formData.age);
    if (isNaN(age) || age <= 0) {
      alert("Please enter a valid age.");
      return;
    }

    // Attempt to send booking request to the backend
    try {
      const response = await axios.post(
        `http://localhost:5000/book-ticket/${trainId}`,
        formData
      );

      // Handle successful booking response
      if (response.status === 200) {
        alert("Ticket booked successfully!");
        navigate("/"); // Redirect to the home page or reservation page
      }
    } catch (error) {
      // Handle booking failure
      console.error("Error booking ticket:", error);
      alert("Failed to book ticket. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Book Your Ticket
      </h2>

      {/* Booking form */}
      <form
        onSubmit={handleBooking}
        className="bg-white shadow-lg rounded-lg p-6 w-3/4 lg:w-1/2 space-y-4"
      >
        <div>
          <label className="block text-gray-700">Passenger Name</label>
          <input
            type="text"
            name="passengerName"
            value={formData.passengerName}
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
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-gray-700">Seat Type</label>
          <select
            name="seatType"
            value={formData.seatType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First Class">First Class</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookTicket;
