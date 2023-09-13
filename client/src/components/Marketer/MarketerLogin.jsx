import React, { useState, useContext } from "react";
import { MarketerContext } from "../../contexts/MarketerContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import Layout from "../Layout";

const Login = () => {
  const { setMarketer } = useContext(MarketerContext);
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
      autoClose: 1000,
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 1000,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.post(
        // "/api/marketers/login",
        "https://surefinders-backend.onrender.com/api/marketers/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );

      // console.log(data);
      const { success, message, data: marketer } = data;

      if (success) {
        handleSuccess(message);
        setMarketer(marketer);
        // check if payment has been made
        if (marketer.paymentMade) {
          navigate(`/marketer/dashboard/${marketer._id}`);
        } else {
          navigate(`/marketer/payment/${marketer._id}`);
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
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen my-10">
        <div className="w-full max-w-md p-4 rounded-md shadow-xl">
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
              className={`w-full px-4 py-2 mt-4 mb-4 bg-primary hover:bg-blue text-white rounded-md font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="relative">
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    style={{ zIndex: 9999 }}
                  >
                    <FaSpinner className="animate-spin text-4xl text-primary" />
                  </div>
                </div>
              ) : (
                "Log In"
              )}
            </button>
            <div className="flex items-center justify-between text-center gap-4">
              <span className="block">
                Don't have an account?{" "}
                <Link
                  to="/marketer/signup"
                  className="text-primary hover:text-blue"
                >
                  Sign Up
                </Link>
              </span>
              <span className="block">
                Forgot your password?{" "}
                <Link
                  to="/marketer-forgot-password"
                  className="text-primary hover:text-blue"
                >
                  Reset it
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
