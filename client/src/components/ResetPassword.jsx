import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call your API to handle password reset
      const response = await axios.post(
        // `/api/reset/${resetToken}`,
        `https://surefinders-backend.onrender.com/api/reset/${resetToken}`,
        {
          newPassword: password,
        },
        { withCredentials: true }
      );
      // Check if the password reset was successful
      if (response.status === 200) {       
        toast.success("Password has been reset successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        navigate("/login");
      } else {
        alert("Password reset failed");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "An error occurred"}`);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form
        className="p-10 bg-white rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-5 text-xl font-semibold text-gray-700">
          Reset Password
        </h2>

        <label
          htmlFor="newpassword"
          className="block mb-2 text-sm font-semibold text-gray-600"
        >
          New Password
        </label>

        <div className="mb-4">
          <label htmlFor="password" className="block">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full px-3 py-2 mb-5 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              `w-full px-7 py-2 capitalize relative flex items-center justify-center mt-4 mb-4 text-white bg-primary rounded-md hover:bg-blue font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }` // Disable button and show loading state
            }
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2">
                  <FaSpinner className="animate-spin" />
                </span>
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
      </form>
    </div>
  );
};

export default ResetPassword;
