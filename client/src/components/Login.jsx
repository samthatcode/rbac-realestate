import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-left",
      autoClose: 2000,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 2000,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks while loading
    setLoading(true); // Start loading state

    try {
      const { data } = await axios.post(
        "https://surefinders-backend.onrender.com/api/login",
        // "/api/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );

      // console.log(data);
      const { success, message, data: user } = data;

      if (success) {
        handleSuccess(message);
        // Set the user in the context
        setUser(user);
        if (user.role === "admin") {
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 2000); // Navigate to the 'AdminDashboard' component if the user is an admin
        } else {
          setTimeout(() => {
            navigate("/user/dashboard");
          }, 2000);
        }
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading state
      setInputValue({
        ...inputValue,
        email: "",
        password: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4 bg-whiterounded-md shadow-xl">
        <h2 className="md:text-left text-center text-xl font-bold text-slate-500">
          Log In
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
              onChange={handleOnChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
                className="w-full p-2 border rounded-md"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={
              `w-full px-4 py-2 mt-4 mb-4 bg-primary hover:bg-blue text-white rounded-md font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }` // Disable button and show loading state
            }
            disabled={loading} // Disable button
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <div className="flex items-center justify-between text-center gap-4">
            <span className="block ">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-blue">
                Sign Up
              </Link>
            </span>
            <span className="block ">
              Forgot your password?{" "}
              <Link to="/forgot-password" className="text-primary hover:text-blue">
                Reset it
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
