import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

function NavBar({ isLoggedIn, onLogout }) {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">Railway Reservation System</Link>
      </h1>

      <div className="flex space-x-4">
        {/* Links visible when logged out */}
        {!isLoggedIn ? (
          <>
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </>
        ) : (
          // Links visible when logged in
          <>
            <Link to="/search-trains" className="hover:underline">
              Search Trains
            </Link>
            <Link to="/my-bookings" className="hover:underline">
              My Bookings
            </Link>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <button onClick={onLogout} className="hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// PropTypes validation
NavBar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired, // Check if isLoggedIn is a boolean
  onLogout: PropTypes.func.isRequired, // Check if onLogout is a function
};

export default NavBar;
