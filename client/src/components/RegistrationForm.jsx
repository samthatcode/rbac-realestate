import React, { useState } from "react";
import axios from "axios";

const RegistrationForm = () => {
  const [eventId, setEventId] = useState("");
  const [referringMarketerId, setReferringMarketerId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`https://surefinders-backend.onrender.com/api/events/${eventId}/registrations`, { referringMarketerId },  { withCredentials: true })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-teal">Registration Form</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="mb-4">
          <label
            htmlFor="eventId"
            className="block text-sm font-medium text-gray-700"
          >
            Event ID
          </label>
          <input
            type="text"
            id="eventId"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="referringMarketerId"
            className="block text-sm font-medium text-gray-700"
          >
            Referring Marketer ID
          </label>
          <input
            type="text"
            id="referringMarketerId"
            value={referringMarketerId}
            onChange={(e) => setReferringMarketerId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
      
      </div>
      <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-md shadow hover:bg-purple-600"
        >
          Register
        </button>
    </form>
  );
}

export default RegistrationForm;
