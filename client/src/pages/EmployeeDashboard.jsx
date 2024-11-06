export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>
      <div className="mt-4">
        {/* Train Schedule Management */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="font-bold">Train Schedule Management</h2>
          {/* Add Schedule Form or List */}
        </div>

        {/* Employee Salary */}
        <div className="bg-white p-4 rounded shadow-md mt-4">
          <h2 className="font-bold">My Salary Details</h2>
          {/* Fetch and display salary details */}
        </div>
      </div>
    </div>
  );
}
