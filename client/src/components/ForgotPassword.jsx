import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/forgot-password", { email });
      if (data.message) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 2000,
      });
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
              `w-full px-4 py-2 mt-4 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }` // Disable button and show loading state
            }
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <span className="block text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-500">
              Log In
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
