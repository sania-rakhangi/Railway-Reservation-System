import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import SearchTrains from "./components/SearchTrains";
import BookTicket from "./components/BookTicket";
import MyBookings from "./components/MyBookings"; // Import the MyBookings component
import ProfilePage from "./components/ProfilePage"; // Import the ProfilePage component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm onLogin={onLogin} />} />
        <Route path="/login" element={<LoginForm onLogin={onLogin} />} />
        <Route path="/search-trains" element={<SearchTrains />} />
        <Route path="/book-ticket/:trainId" element={<BookTicket />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<ProfilePage />} />{" "}
        {/* Add Profile Route */}
      </Routes>
    </Router>
  );
}

export default App;
