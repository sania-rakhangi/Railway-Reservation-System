import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SearchTrains() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when search starts
    try {
      const response = await axios.get("http://localhost:5000/search-trains", {
        params: {
          origin: formData.origin,
          destination: formData.destination,
          date: formData.date,
        },
      });
      if (response.data.trains.length === 0) {
        alert("No trains found for the given search criteria.");
      } else {
        setTrains(response.data.trains);
      }
    } catch (error) {
      console.error("Error searching for trains:", error);
      alert("Failed to search for trains. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after search is complete
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Search for Trains
      </h2>
      <form
        onSubmit={handleSearch}
        className="bg-white shadow-lg rounded-lg p-6 w-3/4 lg:w-1/2 space-y-4"
      >
        <div>
          <label className="block text-gray-700" htmlFor="origin">
            Origin
          </label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            id="origin"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-label="Origin"
          />
        </div>
        <div>
          <label className="block text-gray-700" htmlFor="destination">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            id="destination"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-label="Destination"
          />
        </div>
        <div>
          <label className="block text-gray-700" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            id="date"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-label="Travel Date"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Searching..." : "Search Trains"}
        </button>
      </form>

      <div className="mt-8 w-3/4 lg:w-1/2">
        {trains.length > 0 ? (
          <ul className="space-y-4">
            {trains.map((train) => (
              <li
                key={train.train_id}
                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-xl transition-shadow duration-200"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Train: {train.name}
                  </h3>
                  <p className="text-gray-600">
                    From: {train.origin} - To: {train.destination}
                  </p>
                  <p className="text-gray-600">
                    Departure: {train.departure_time} - Arrival:{" "}
                    {train.arrival_time}
                  </p>
                </div>
                <Link
                  to={`/book-ticket/${train.train_id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Book Ticket
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="text-gray-600 text-center">
              No trains found for the given search criteria.
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default SearchTrains;
