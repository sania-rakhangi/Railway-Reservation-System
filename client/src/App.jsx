import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SearchTrains from "./pages/SearchTrains";
import BookedTickets from "./pages/BookedTickets";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-trains"
          element={
            <ProtectedRoute>
              <SearchTrains />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booked-tickets"
          element={
            <ProtectedRoute>
              <BookedTickets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
