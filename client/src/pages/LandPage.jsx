import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMapPin } from "react-icons/fi";
import { GiRoad } from "react-icons/gi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSearch } from "../contexts/SearchContext";
import { FaHeart, FaSpinner } from "react-icons/fa";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { toast } from "react-toastify";

const settings = {
  infinite: true,
  dots: true,
  arrows: true,
  cssEase: "ease-in-out",
  slidesToShow: 3,
  slidesToScroll: 1,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const LandPage = () => {
  const [lands, setLands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedProperties, toggleSavedProperty } = useSavedProperties();

  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const filteredLands = lands.filter((land) =>
    land.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchLands() {
      try {
        const response = await axios.get(
          "https://surefinders-backend.onrender.com/api/lands",
          // "/api/lands",
          {
            withCredentials: true,
          }
        );
        // console.log(response.data);
        setLands(response.data.data);
      } catch (error) {
        console.error("Failed to fetch lands:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLands();
  }, []);

  const handleHeartClick = (land) => {
    const isCurrentlySaved = savedProperties.includes(land._id);
    toggleSavedProperty(land._id);
    if (!isCurrentlySaved) {
      toast.success("Saved", { position: "top-right", autoClose: 500 });
    } else {
      toast.info("Unsaved", { position: "top-right", autoClose: 500 });
    }
  };

  return (
    <div className="container mx-auto py-20 px-8" id="lands">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Recent Land Listings
        </h2>
        <p className="text-center capitalize text-subTitle mb-10">
          We provide full service at every step.
        </p>
      </div>

      <Slider
        {...settings}
        className=""
        dots={true}
        autoplay={true}
        autoplaySpeed={4000}
      >
        {isLoading ? (
          <div className="overlay">
            <div className="flex items-center justify-center h-screen">
              <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
          </div>
        ) : filteredLands.length > 0 ? (
          filteredLands.map((land) => (
            <div key={land._id} className="slick-slide">
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
                      // src={`http://localhost:5175/public/images/${land.images[0]}`}
                      src={`https://surefinders-backend.onrender.com/public/images/${land.images[0]}`}
                      alt={land.title}
                      className="w-full max-h-40 object-cover image"
                    />
                  )}
                </div>
                <span
                  className={`absolute top-2 right-2 text-sm font-medium capitalize p-1 py-1 px-2 last:mr-0 mr-1 cursor-pointer ${
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
                    <FiMapPin className="mr-1 text-primary font-semibold" />
                    {land.location}
                  </p>
                  <div className="flex">
                    <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                      <div className="flex-col">
                        <p className="mb-2 font-bold">Acreage</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <GiRoad />
                          </span>
                          <p>{land.acreage} Acres</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-red font-bold border-t mt-2">
                      &#x20A6;{land.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-lg text-gray-600 mt-4">
            No lands match your search.
          </div>
        )}
      </Slider>
    </div>
  );
};

export default LandPage;
