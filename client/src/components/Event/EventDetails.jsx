import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaRegBuilding,
} from "react-icons/fa";
import { Layout } from "../../components";

const EventDetails = () => {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://surefinders-backend.onrender.com/api/events/${id}`,
          // `/api/events/${id}`,
          {
            withCredentials: true,
          }
        );

        const eventData = response.data.data;
        console.log(eventData);
        setEventDetails(eventData);
      } catch (error) {
        console.error("Failed to event land:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  const { name, description, date, time, location, eventImage } = eventDetails;

  return (
    <Layout>
      <div className="container mx-auto px-20 py-40" id="event-details">
        <div className="title_head mb-4">
          <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
            Event Details
          </h2>
        </div>
        <div className="flex border-gray-300 rounded overflow-hidden hover:shadow-lg transition-all hover-card my-10 h-fit">
          <div className="image-container">
            <img
              src={`https://surefinders-backend.onrender.com/public/images/${eventImage}`}
              // src={`http://localhost:5175/public/images/${eventImage}`}
              alt={name}
              className="w-full h-full object-cover image"
            />
          </div>

          <div className="hover-card-content p-4 block border flex-grow">
            <span className="flex justify-center items-center text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
              {name}
            </span>
            <p className=" text-title text-base capitalize break-words font-semibold my-4">
              {description}
            </p>
            <div className="text-sm">
              <div className="flex items-center my-4">
                <FaCalendar className="mr-2 text-primary" />
                <p className="text-subTitle">
                  {new Date(date)?.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center my-4">
                <FaClock className="mr-2 text-primary" />
                <p className="text-subTitle">{time}</p>
              </div>
              <div className="flex items-center my-4">
                <FaMapMarkerAlt className="mr-2 text-primary" />
                <p className="text-subTitle capitalize">{location}</p>
              </div>
            </div>
            <div className="py-3 mt- border-t ">
              <div className="text-primary flex justify-between items-center">
                <FaRegBuilding size={15} />
                <div className="px-2 py-2 bg-blue rounded hover:font-semibold text-white">
                  Event
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
