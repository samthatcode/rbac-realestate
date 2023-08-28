import React, { useState, useContext } from "react";
import axios from "axios";
import { MarketerContext } from "../../contexts/MarketerContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MarketerProfile = () => {
  const { marketer, setMarketer } = useContext(MarketerContext);
  const marketerId = marketer._id;
  const [formData, setFormData] = useState({
    firstName: marketer.firstName,
    lastName: marketer.lastName,
    profilePicture: marketer.profilePicture,
    password: "",
    address: marketer.address,
    profession: marketer.profession,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      profilePicture: "",
      password: "",
      address: "",
      profession: "",
    });
    setSelectedFileName(""); // Clear the selected file name as well
  };

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      const file = e.target.files[0];
      if (file) {
        setSelectedFileName(file.name);
        setFormData({
          ...formData,
          profilePicture: file,
        });
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (key !== "profilePicture") {
        data.append(key, formData[key]);
      }
    }
    if (formData.profilePicture) {
      data.append(
        "profilePicture",
        formData.profilePicture,
        formData.profilePicture.name
      );
    }

    try {
      const response = await axios.put(`https://surefinders-backend.onrender.com/api/marketers/${marketerId}`, { withCredentials: true }, data);

      // Update the marketer's data with the response from the server
      setMarketer(response.data.data);
      toast.success("Marketer Updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // 2 seconds
      });

      resetForm();
    } catch (error) {
      setError(
        error.response.data.error ||
          "Failed to update profile. Please try again later."
      );
      console.error("Error updating profile:", error);
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/2 px-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline capitalize"
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline capitalize"
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="profilePicture"
        >
          Display Picture
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="profilePicture"
          type="file"
          name="profilePicture"
          onChange={handleChange}
        />
        {selectedFileName && (
          <p className="text-gray-600 mt-2">{selectedFileName}</p>
        )}
      </div>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/2 px-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profession"
          >
            Profession
          </label>
          <input
            className="w-full p-2 border rounded-md capitalize"
            id="profession"
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="w-full p-2 border rounded-md"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="address"
        >
          Address
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline capitalize"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className={`mt-4 bg-primary hover:bg-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
      {error && <p className="text-red mt-2">{error}</p>}
    </form>
  );
};

export default MarketerProfile;
