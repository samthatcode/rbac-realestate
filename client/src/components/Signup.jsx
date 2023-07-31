import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalSuccess from "./ModalSuccess";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");
  const [discoverySource, setDiscoverySource] = useState("");
  const [showModal, setShowModal] = useState(false);

  // to be called after signup is successful
  const resetFields = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAddress("");
    setStateProvince("");
    setCountry("");
    setProfession("");
    setDiscoverySource("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract referral ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referral = urlParams.get("referral");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-left",
        autoClose: 2000,
      });
      return;
    }

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
          phoneNumber,
          address,
          stateProvince,
          country,
          profession,
          discoverySource,
          referral,
        },
        withCredentials: true,
      });

      console.log(response.data);
      // After successful registration
      setShowModal(true);
      // Clear input fields after successful signup
      resetFields();
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-xl p-4 bg-slate-200 rounded-md shadow-xl">
        <h2 className="md:text-left text-center text-xl font-bold text-slate-500 mb-16">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="md:flex -mx-2">
            <div className="mb-4 md:w-1/2 md:pr-2">
              <label htmlFor="firstName" className="block font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>
            <div className="mb-4 md:w-1/2 md:pl-2">
              <label htmlFor="lastName" className="block font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>
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
            <label htmlFor="phoneNumber" className="block font-medium">
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block font-medium">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 capitalize"
              required
            />
          </div>
          <div className="md:flex -mx-2">
            <div className="mb-4 md:w-1/2 md:pr-2">
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
            <div className="mb-4 md:w-1/2 md:pl-2">
              <label htmlFor="confirmPassword" className="block font-medium">
                Confirm Password
              </label>
              <input
                placeholder="Confirm your password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="discoverSource" className="block font-medium">
              How did you learn about SureFinders
            </label>
            <select
              id="discoverSource"
              value={discoverySource}
              onChange={(e) => setDiscoverySource(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              required
            >
              <option value="">Select...</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="stateProvince" className="block font-medium">
              State
            </label>
            <input
              type="text"
              id="state"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 capitalize"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block font-medium">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 capitalize"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profession" className="block font-medium">
              Profession
            </label>
            <input
              type="text"
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 capitalize"
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
      <ModalSuccess showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Signup;
