import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios({
        method: "POST",
        url: "/api/signup",
        data: {
          email,
          password,
          firstName,
          lastName,
          role,
        },
        withCredentials: true,
      });

      console.log(response.data);   
      toast(`Hello ${response.data.data.user.firstName}`, {
        position: "top-right",
        autoClose: 2000,
        onClose: () => navigate("/product"),
      });
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.", {
        position: "top-left",
        autoClose: 2000,
      });
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password) => {
    const strength = {
      0: { label: "Weak", color: "text-red-500" },
      1: { label: "Medium", color: "text-yellow-500" },
      2: { label: "Strong", color: "text-green-500" },
    };

    let score = 0;

    // checks if password contains Lowercase, Uppercase letter, symbol, number
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password)) {
      score++;
    }

    if (password.length >= 8) {
      score++;
    }

    return strength[score];
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-slate-200 rounded-md shadow-xl">
        <h2 className="md:text-left text-center text-xl font-bold text-slate-500">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium">
              First Name
            </label>
            <input
              type="text"
              id="username"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="username"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                placeholder="Enter your password"
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {password && (
              <p className="text-sm mt-2 font-bold">
                Password Strength:{" "}
                <span className={passwordStrength.color}>
                  {passwordStrength.label}
                </span>
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 cursor-pointer"
              required
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="marketer">Marketer</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="agency">Agency</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <span className="block text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Log In
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
