import React, { useState } from "react";
import axios from "axios";

function CreateEventForm() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [filePreview, setFilePreview] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setEventImage(selectedFile);
    setFilePreview(selectedFile ? selectedFile.name : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time); // Time is now included in the form data
    formData.append("location", location);
    formData.append("description", description);
    formData.append("eventImage", eventImage);

    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/events",
        // "/api/events",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md md:max-w-xl p-4 bg-whiterounded-md shadow-xl">
        <h2 className="md:text-left text-center text-xl font-bold text-slate-500 capitalize">
          Event Registration
        </h2>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="md:flex md:space-x-4">
            <div className="mb-4 md:w-1/2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Event Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded-md text-teal"
                required
              />
            </div>

            <div className="mb-4 md:w-1/2">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Event Time
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Event Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Event Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventImage"
              className="block text-sm font-medium text-gray-700"
            >
              Event Image
            </label>
            <input
              type="file"
              id="eventImage"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <p>{filePreview}</p>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventForm;
