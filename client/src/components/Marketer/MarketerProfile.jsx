import React, { useState, useContext } from "react";
import axios from "axios";
import { MarketerContext } from "../../contexts/MarketerContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketerProfile = () => {
  const { marketer, setMarketer } = useContext(MarketerContext);
  const marketerId = marketer._id;
  const [formData, setFormData] = useState({
    firstName: marketer.firstName,
    lastName: marketer.lastName,
    profilePicture: marketer.profilePicture,
    profession: marketer.profession,
    address: marketer.address,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      profilePicture: "",
      profession: "",
      address: "",
    });
    setSelectedFileName(""); // Clear the selected file name as well
  };

  const handleChange = (e) => {
    if (e.target.name === "name") {
      const [firstName, lastName] = e.target.value.split(" ");
      setFormData({
        ...formData,
        firstName,
        lastName,
      });
    } else if (e.target.name === "profilePicture") {
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

    try {
      // Send the updated data to the server to save
      console.log(marketerId);
      console.log(`/api/marketers/${marketerId}`);
      const response = await axios.put(
        `/api/marketers/${marketerId}`,
        formData
      );

      // Update the marketer's data with the response from the server
      setMarketer(response.data.data);
      toast.success("Marketer Updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // 2 seconds
      });

      resetForm();
    } catch (error) {
      setError("Failed to update profile. Please try again later.");
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline capitalize"
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
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
          value={formData.profilePicture}
          onChange={handleChange}
        />
        {selectedFileName && (
          <p className="text-gray-600 mt-2">{selectedFileName}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="profession"
        >
          Profession
        </label>
        <input
          className="w-full p-2 border rounded-md"
          id="profession"
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
        />
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
        className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default MarketerProfile;
