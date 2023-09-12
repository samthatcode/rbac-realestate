import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaRegBuilding,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await axios.get(
          // "/api/events",
          "https://surefinders-backend.onrender.com/api/events",
          {
            withCredentials: true,
          }
        );

        const events = response.data.data.map((event) => {
          const time = new Date(`1970-01-01T${event.time}`);
          const timeString = time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return { ...event, time: timeString };
        });

        setEvents(events);
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };

    fetchEventsData();
  }, []);

  return (
    <div className="container mx-auto px-8 py-20" id="events">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Latest News
        </h2>
        <p className="text-center capitalize text-subTitle mb-10">
          Find the most popular real estate company all around Nigeria.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event._id}
            className=" border-gray-300 rounded overflow-hidden hover:shadow-lg transition-all hover-card relative"
          >
            <div className="image-container">
              <img
                // src={`http://localhost:5175/public/images/${event.eventImage}`}
                src={`https://surefinders-backend.onrender.com/public/images/${event.eventImage}`}
                alt={event.name}
                className="w-full max-h-40 object-cover image"
              />
            </div>
            <div className="absolute top-0 right-0 p-1 bg-blue text-white">
              Event
            </div>
            <div className="hover-card-content p-4 block border">
              <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                {event.name}
              </span>
              <p className=" text-title text-base capitalize break-words font-bold my-2">
                {event.description.length > 15
                  ? `${event.description.substring(0, 15)}...`
                  : event.description}
              </p>
              <div className="text-sm">
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-primary" />
                  <p className="text-subTitle">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <FaClock className="mr-2 text-primary" />
                  <p className="text-subTitle">{event.time}</p>
                </div>
                <div className="flex items-center mt-2">
                  <FaMapMarkerAlt className="mr-2 text-primary" />
                  <p className="text-subTitle capitalize">{event.location}</p>
                </div>
              </div>
              <div className="py-3 mt-2 border-t flex justify-between items-center">
                <div class="text-primary flex justify-center items-center">
                  <FaRegBuilding size={15} />
                </div>

                <Link to={`/events/${event._id}`}>
                  <button className="px-4 py-2 text-white bg-primary hover:bg-blue">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
