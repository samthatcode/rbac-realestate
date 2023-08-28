import React, { useEffect, useState } from "react";
import axios from "axios";

function EventDetails({ match }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
             // `https://surefinders-backend.onrender.com/api/events/${match.params.id}`,
          `/api/events/${match.params.id}`,
        
        {
          withCredentials: true,
        });
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [match.params.id]);

  return event ? (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
      <p className="text-gray-600">{event.description}</p>
      <img
        src={event.imageUrl}
        alt={event.name}
        className="w-full h-64 object-cover mt-2"
      />
      <p className="mt-2">
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {event.time}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
    </div>
  ) : null;
}

export default EventDetails;
