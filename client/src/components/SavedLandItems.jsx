import React, { useEffect, useState } from "react";
import { FaHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { GiRoad } from "react-icons/gi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SavedLandItems = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const { savedProperties, toggleSavedProperty } = useSavedProperties();
  const [lands, setLands] = useState([]);
  const navigate = useNavigate();
  const landsPerPage = 3;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(savedLands.length / landsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const fetchSavedLandsDetails = async () => {
      try {
        const response = await axios.get(
          // "https://surefinders-backend.onrender.com/api/lands",
          "/api/lands",
          {
            params: { ids: savedProperties.join(",") },
            withCredentials: true,
          }
        );
        setLands(response.data.data);
      } catch (error) {
        console.error("Failed to fetch saved lands details:", error);
        setError(error);
      }
    };

    if (savedProperties.length > 0) {
      fetchSavedLandsDetails();
    }
  }, [savedProperties]);

  const savedLands = lands.filter((land) => {
    return savedProperties.includes(land._id);
  });

  const handleHeartClick = (land) => {
    toggleSavedProperty(land._id);
    if (savedProperties.includes(land._id)) {
      toast.success("Saved", { position: "top-right", autoClose: 500 });
    } else {
      toast.info("Unsaved", { position: "top-right", autoClose: 500 });
    }
  };

  if (error) {
    return (
      <div>
        Error: <span className="text-red">{error.message}</span>
      </div>
    );
  }

  return (
    <>
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Recent Saved Land
        </h2>
        <p class="text-center capitalize text-subTitle mb-10">
          Your saved Properties
        </p>
      </div>
      <div className="my-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedLands.length > landsPerPage && (
          <div className="col-span-full flex justify-end items-center gap-8">
            <button
              className="text-indigo-500 hover:text-indigo-700 bg-indigo-200 p-2 rounded px-4"
              onClick={handlePrevPage}
            >
              <FaArrowLeft size={24} />
            </button>
            <button
              className="text-indigo-500 hover:text-indigo-700 bg-indigo-200 p-2 rounded px-4"
              onClick={handleNextPage}
            >
              <FaArrowRight size={24} />
            </button>
          </div>
        )}
        {savedLands
          .slice(currentPage * landsPerPage, (currentPage + 1) * landsPerPage)
          .map((land) => (
            <div key={land._id} className="">
              <div
                className="relative rounded overflow-hidden hover:shadow-xl transition-all hover-card cursor-pointer"
                onClick={() => {
                  // Check if the click target is not the heart icon
                  if (!event.target.classList.contains("heart-icon")) {
                    navigate(`/lands/${land._id}`); // Navigate to the details page
                  }
                }}
              >
                <div className="image-container">
                  {land.images.length > 0 && (
                    <img
                      src={`https://surefinders-backend.onrender.com/public/images/${land.images[0]}`}
                      // src={`http://localhost:5175/public/images/${land.images[0]}`}
                      alt={land.title}
                      className="w-full max-h-40 object-cover image"
                    />
                  )}
                </div>
                <span
                  className={`absolute top-2 right-2 text-sm font-medium capitalize  bg-gray-500 p-1 py-1 px-2 last:mr-0 mr-1 cursor-pointer ${
                    savedProperties.includes(land._id)
                      ? "text-red"
                      : "text-gray-200"
                  } heart-icon`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent onClick from firing
                    handleHeartClick(land);
                  }}
                >
                  <FaHeart size={20} />
                </span>

                <div className="p-4 block border hover-card-content">
                  <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                    {land.title}
                  </span>
                  <p className="text-title text-lg capitalize break-words font-bold my-2">
                    {land.description.length > 15
                      ? `${land.description.substring(0, 15)}...`
                      : land.description}
                  </p>
                  <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-3">
                    <FiMapPin className="text-gray-400 mr-1" />
                    {land.location}
                  </p>
                  <div className="flex">
                    <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                      <div className="flex-col">
                        <p className="mb-2">Acreage</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1">
                            <GiRoad />
                          </span>
                          <p>{land.acreage} Acres</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-title font-bold border-t mt-2">
                      &#x20A6;{land.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default SavedLandItems;
