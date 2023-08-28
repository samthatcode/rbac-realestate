import React, { useEffect, useState } from "react";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await axios.get(
          // "/api/events",
          "https://surefinders-backend.onrender.com/api/events",
          {
          withCredentials: true,
        });
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };

    fetchEventsData();
  }, []);

  return (
    <div className="p-4">
      {events.map((event) => (
        <div
          key={event._id}
          className="mb-4 border border-gray-300 p-4 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
          <p className="text-gray-600">{event.description}</p>
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-64 object-cover mt-2"
          />
        </div>
      ))}
    </div>
  );
};

export default EventList;
