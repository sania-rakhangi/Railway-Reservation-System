import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <button
        onClick={() => navigate("/search-trains")}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Search Trains
      </button>
      <button
        onClick={() => navigate("/booked-tickets")}
        className="bg-blue-500 text-white p-2 rounded mt-4 ml-4"
      >
        Booked Tickets
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mt-4 ml-4"
      >
        Logout
      </button>
    </div>
  );
}
