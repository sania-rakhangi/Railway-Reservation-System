import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <header className="w-full bg-blue-600 text-white py-8 text-center">
        <h1 className="text-4xl font-bold">
          Welcome to Railway Reservation System
        </h1>
        <p className="text-lg mt-2">
          Book your railway tickets with ease and convenience!
        </p>
      </header>

      <main className="flex flex-col items-center mt-8 space-y-6 w-3/4 lg:w-1/2">
        <section
          className="bg-white shadow-lg rounded-lg p-6 w-full"
          aria-labelledby="about-section"
        >
          <h2
            id="about-section"
            className="text-2xl font-semibold mb-4 text-gray-800"
          >
            About Us
          </h2>
          <p className="text-gray-600">
            Our Railway Reservation System allows users to quickly search for
            trains, reserve tickets, and view their travel itinerary. We strive
            to make railway ticket booking fast, easy, and reliable.
          </p>
        </section>

        <section
          className="bg-white shadow-lg rounded-lg p-6 w-full"
          aria-labelledby="features-section"
        >
          <h2
            id="features-section"
            className="text-2xl font-semibold mb-4 text-gray-800"
          >
            Features
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Search for trains based on route and schedule</li>
            <li>Easy booking and cancellation process</li>
            <li>View and manage your reservations</li>
          </ul>
        </section>

        <section
          className="bg-white shadow-lg rounded-lg p-6 w-full text-center"
          aria-labelledby="get-started-section"
        >
          <h2
            id="get-started-section"
            className="text-2xl font-semibold mb-4 text-gray-800"
          >
            Get Started
          </h2>
          <p className="text-gray-600 mb-4">
            Sign up or log in to begin booking your tickets!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Log In
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
