import React, { useState } from "react";
import { postData } from "../utils/api";

export default function SearchTrains() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [trains, setTrains] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await postData("/passenger/search", {
      origin,
      destination,
      date,
    });
    setTrains(results);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Search Trains</h2>
      <form onSubmit={handleSearch} className="mt-4">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Search
        </button>
      </form>

      <div className="mt-4">
        {trains.map((train, index) => (
          <div key={index} className="p-4 bg-white border rounded mb-4">
            <p>Train Name: {train.name}</p>
            <p>Departure: {train.departure_time}</p>
            <p>Arrival: {train.arrival_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
