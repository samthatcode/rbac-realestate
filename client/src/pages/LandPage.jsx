import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { FiMapPin } from "react-icons/fi";
import { GiRoad, GiPriceTag } from "react-icons/gi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

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

  useEffect(() => {
    async function fetchLands() {
      try {
        const response = await axios.get(
          // "https://surefinders-backend.onrender.com/api/lands",
          "/api/lands",
          {
            withCredentials: true,
          }
        );
        setLands(response.data.data);
      } catch (error) {
        console.error("Failed to fetch lands:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLands();
  }, []);

  return (
    <div className="container mx-auto py-20 px-8">
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
        ) : Array.isArray(lands) && lands.length > 0 ? (
          lands.map((land) => (
            <div key={land._id} className="slick-slide">
              <Link to={`/lands/${land._id}`} className="transition-all">
                <div className="rounded overflow-hidden hover:shadow-xl transition-all hover-card">
                  <div className="image-container">
                    {land.images.length > 0 && (
                      <img
                        // src={`https://surefinders-backend.onrender.com/public/images/${land.images[0]}`}
                        src={`http://localhost:5175/public/images/${land.images[0]}`}
                        alt={land.title}
                        className="w-full object-cover image"
                      />
                    )}
                  </div>

                  <div className="p-4 block border hover-card-content">
                    <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                      {land.title}
                    </span>
                    <p className="text-title text-lg capitalize break-words font-bold my-2">
                      {land.description}
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
                            <GiRoad className="mr-1" />
                            <p>{land.acreage} Acres</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg text-title font-bold border-t mt-2">
                        <GiPriceTag className="mr-1" />
                        &#x20A6;{land.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : null}
      </Slider>
    </div>
  );
};

export default LandPage;
