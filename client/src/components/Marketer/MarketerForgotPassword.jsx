import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MessageModal from "./MessageModal";

const MarketerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // State for server response message
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail(""); // Clear email input field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://surefinders-backend.onrender.com/api/marketer-forgot-password",
        {
          email,
        },
        { withCredentials: true }
      );
      if (data.message) {
        setServerMessage(data.message);
        setShowModal(true); // Show the modal with server response message
        setLoading(false);
        return;
      }
    } catch (error) {
      setServerMessage(error.message);
      setShowModal(true); // Show the modal with error message
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-slate-100 rounded-md shadow-xl">
        <h2 className="md:text-left text-center text-xl font-bold text-slate-500">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className={
              `w-full px-4 py-2 mt-4 mb-4 text-white bg-primary rounded-md hover:bg-blue font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }` // Disable button and show loading state
            }
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <span className="block text-center">
            Remembered your password?{" "}
            <Link to="/marketer/login" className="text-primary">
              Log In
            </Link>
          </span>
        </form>
      </div>
      {showModal && (
        <MessageModal message={serverMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MarketerForgotPassword;
