import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMapPin } from "react-icons/fi";
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

const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedProperties, toggleSavedProperty } = useSavedProperties();

  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const filteredInvestments = investments.filter((investment) =>
    investment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const response = await axios.get(
          "https://surefinders-backend.onrender.com/api/investments",
          // "/api/investments",
          {
            withCredentials: true,
          }
        );
        setInvestments(response.data.data);
        // console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch investments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvestments();
  }, []);

  const handleHeartClick = (investment) => {
    const isCurrentlySaved = savedProperties.includes(investment._id);
    toggleSavedProperty(investment._id);
    if (!isCurrentlySaved) {
      toast.success("Saved", { position: "top-right", autoClose: 500 });
    } else {
      toast.info("Unsaved", { position: "top-right", autoClose: 500 });
    }
  };

  return (
    <div className="container mx-auto py-20 px-8" id="investments">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Recent Featured Investment Listings
        </h2>
        <p className="text-center capitalize text-subTitle mb-10">
          handpicked exclusive properties by our team.
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
        ) : filteredInvestments.length > 0 ? (
          filteredInvestments.map((investment) => (
            <div key={investment._id} className="slick-slide">
              <div
                className="relative rounded overflow-hidden hover:shadow-xl transition-all hover-card cursor-pointer"
                onClick={() => {
                  // Check if the click target is not the heart icon
                  if (!event.target.classList.contains("heart-icon")) {
                    navigate(`/investments/${investment._id}`); // Navigate to the details page
                  }
                }}
              >
                <div className="image-container">
                  {investment.images.length > 0 && (
                    <img
                      src={`https://surefinders-backend.onrender.com/public/images/${investment.images[0]}`}
                      // src={`http://localhost:5175/public/images/${investment.images[0]}`}
                      alt={investment.title}
                      className="w-full max-h-40 object-cover image"
                    />
                  )}
                </div>
                <span
                  className={`absolute top-2 right-2 text-sm font-medium capitalize p-1 py-1 px-2 last:mr-0 mr-1 cursor-pointer ${
                    savedProperties.includes(investment._id)
                      ? "text-red"
                      : "text-gray-200"
                  } heart-icon`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent onClick from firing
                    handleHeartClick(investment);
                  }}
                >
                  <FaHeart size={20} />
                </span>

                <div className="p-4 block border hover-card-content">
                  <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                    {investment.title}
                  </span>
                  <p className="text-title text-lg capitalize break-words font-bold my-2">
                    {investment.description.length > 15
                      ? `${investment.description.substring(0, 15)}...`
                      : investment.description}
                  </p>
                  <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-3">
                    <FiMapPin className="text-primary font-semibold mr-1" />
                    {investment.location}
                  </p>
                  <div className="flex">
                    <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                      <div className="flex-col">
                        <p className="font-bold">Terms</p>
                        <div className="flex justify-center items-center">
                          <p>
                            {investment.terms.length > 15
                              ? `${investment.terms.substring(0, 15)}...`
                              : investment.terms}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-red font-bold border-t mt-2">
                      &#x20A6;{investment.investmentAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-lg text-gray-600 mt-4">
            No investments match your search.
          </div>
        )}
      </Slider>
    </div>
  );
};

export default InvestmentPage;
