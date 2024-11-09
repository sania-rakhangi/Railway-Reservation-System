import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes

function NavBar({ isLoggedIn, onLogout }) {
  return (
    <nav
      className="bg-blue-600 p-4 text-white flex justify-between items-center"
      role="navigation"
      aria-label="main navigation"
    >
      <h1 className="text-2xl font-bold">
        <Link
          to="/"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
        >
          Railway Reservation System
        </Link>
      </h1>

      <div className="flex space-x-4">
        {/* Links visible when logged out */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/signup"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Login
            </Link>
          </>
        ) : (
          // Links visible when logged in
          <>
            <Link
              to="/search-trains"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Search Trains
            </Link>
            <Link
              to="/my-bookings"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              My Bookings
            </Link>
            <Link
              to="/"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white"
            >
              Home
            </Link>
            <button
              onClick={onLogout}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white px-2 py-1 cursor-pointer"
            >
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
  isLoggedIn: PropTypes.bool.isRequired, // isLoggedIn should be a boolean and is required
  onLogout: PropTypes.func.isRequired, // onLogout should be a function and is required
};

export default NavBar;
