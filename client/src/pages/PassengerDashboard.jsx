export default function PassengerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Passenger Dashboard</h1>
      <div className="mt-4">
        {/* Search for Trains Form */}
        <form className="bg-white p-4 rounded shadow-md">
          <h2 className="font-bold">Search Trains</h2>
          <input
            type="text"
            placeholder="Origin"
            className="w-full p-2 mt-2 border rounded"
          />
          <input
            type="text"
            placeholder="Destination"
            className="w-full p-2 mt-2 border rounded"
          />
          <input type="date" className="w-full p-2 mt-2 border rounded" />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-2"
          >
            Search
          </button>
        </form>

        {/* Booked Tickets List */}
        <div className="mt-4">
          <h2 className="font-bold">My Booked Tickets</h2>
          {/* Fetch and map booked tickets here */}
          <div className="bg-white p-4 rounded shadow-md mt-2">
            No tickets booked yet.
          </div>
        </div>
      </div>
    </div>
  );
}
