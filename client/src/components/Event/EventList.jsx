import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events')
      .then(response => setEvents(response.data.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="p-4">
      {events.map(event => (
        <div key={event._id} className="mb-4 border border-gray-300 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
          <p className="text-gray-600">{event.description}</p>
          <img src={event.imageUrl} alt={event.name} className="w-full h-64 object-cover mt-2" />
        </div>
      ))}
    </div>
  );
}

export default EventList;
