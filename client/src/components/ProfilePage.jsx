import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user details when the component mounts
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserDetails({
          name: response.data.name,
          email: response.data.email,
          password: "", // Do not prefill the password field
        });
      } catch (error) {
        setError("Error fetching profile details.");
        // Optionally, redirect if there's an error (e.g., token expired or invalid)
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove password field if it's empty and we're not editing it
      const updatedDetails = { ...userDetails };
      if (!updatedDetails.password) {
        delete updatedDetails.password;
      }

      await axios.put("http://localhost:5000/profile", updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      setError("Error updating profile.");
      console.error(error); // Log the full error to the console for debugging
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex justify-between">
          {editing ? (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEditToggle}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
