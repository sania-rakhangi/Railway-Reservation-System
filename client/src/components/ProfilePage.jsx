import { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User ID not found.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/profile?userId=${userId}`
        );
        setUserDetails({
          name: response.data.name,
          email: response.data.email,
          password: "", // Do not prefill the password field
        });
      } catch (error) {
        setError("Error fetching profile details.");
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleEditToggle = () => {
    // When entering edit mode, clear the input fields
    if (!editing) {
      setUserDetails({
        name: "",
        email: "",
        password: "",
      });
    }
    setEditing(!editing);
    setMessage(null); // Clear any previous messages
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedDetails = { ...userDetails };
      if (!updatedDetails.password) {
        delete updatedDetails.password;
      }

      const userId = localStorage.getItem("userId");
      await axios.put(
        `http://localhost:5000/profile?userId=${userId}`,
        updatedDetails
      );
      setMessage("Profile updated successfully");
      setEditing(false); // Disable editing mode after save
    } catch (error) {
      setError("Error updating profile.");
      console.error(error);
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
            readOnly={!editing}
            className={`w-full p-2 border rounded-md ${
              !editing ? "bg-gray-200" : "bg-white"
            }`}
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
            readOnly={!editing}
            className={`w-full p-2 border rounded-md ${
              !editing ? "bg-gray-200" : "bg-white"
            }`}
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
            readOnly={!editing}
            className={`w-full p-2 border rounded-md ${
              !editing ? "bg-gray-200" : "bg-white"
            }`}
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
