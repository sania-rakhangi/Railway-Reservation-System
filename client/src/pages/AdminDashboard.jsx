export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4">
        {/* User Management */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="font-bold">User Management</h2>
          {/* Add User Management Form or List */}
        </div>

        {/* View Bookings and Payments */}
        <div className="bg-white p-4 rounded shadow-md mt-4">
          <h2 className="font-bold">Bookings and Payments</h2>
          {/* Fetch and display booking and payment records */}
        </div>
      </div>
    </div>
  );
}
