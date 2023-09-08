import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { FiMapPin } from "react-icons/fi";
import { GiRoad } from "react-icons/gi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSearch } from "../contexts/SearchContext";
import { FaHeart } from "react-icons/fa";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { CartContext } from "../contexts/CartContext";
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
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);
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
    toggleSavedProperty(land._id);
    if (savedProperties.includes(land._id)) {
      toast.success("Saved", { position: "top-right", autoClose: 500 });
    } else {
      toast.info("Unsaved", { position: "top-right", autoClose: 500 });
    }
  };

  const handleAddToCart = async (land) => {
    setLoading(true);
    await addToCart(land, "land");
    toast("Land added to cart", {
      position: "top-right",
      autoClose: 500,
    });
    setLoading(false);
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
            <ColorRing
              visible={true}
              height="50"
              width="50"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#3454d1", "#007bff"]}
            />
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
              <button
                onClick={() => handleAddToCart(land)}
                className={
                  `w-full px-4 py-2 mt-4 mb-4 text-white bg-primary rounded-md hover:bg-blue font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }` // Disable button and show loading state
                }
                disabled={loading} // Disable button
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
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
