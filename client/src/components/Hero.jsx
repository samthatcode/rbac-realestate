import React, { useState } from "react";
import { CarouselData } from "../data/CarouselData";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineHome,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { useSearch } from "../contexts/SearchContext";
import { FaWalking } from "react-icons/fa";

<style jsx>
  {`
    @media (max-width: 768px) {
      .inset-y-0 {
        left: 1/3 !important;
      }
      .right-3 {
        right: 1/3 !important;
      }
    }
  `}
</style>;

const Hero = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="">
      <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop>
        {CarouselData.map((item, index) => (
          <div
            key={index}
            className="relative z-10 flex items-center justify-center w-full h-screen"
          >
            <img
              src={item.image}
              alt={item.text}
              className="absolute left-0 top-0 right-0 bottom-0 w-full h-full object-cover"
            />
            <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-row justify-center p-4 bg-black bg-opacity-50 text-center">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mx-10">
                <div>
                  <p className="w-full text-white md:text-4xl text-2xl uppercase font-extrabold mb-2">
                    {item.text}
                  </p>
                  <p className="w-full text-gray-100 md:text-xl text-sm">
                    {item.text1}
                  </p>
                  {item.inputPlaceholder && (
                    <>
                      <div className="relative mt-2">
                        <input
                          type="search"
                          placeholder={item.inputPlaceholder}
                          className="w-full px-3 py-5 text-sm text-white bg-slate-800 border rounded pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <AiOutlineHome className="text-gray-400" />
                        </div>
                        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center">
                          <AiOutlineEnvironment className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-400">
                            Location., e.g Lagos, Abuja...
                          </span>
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center bg-primary hover:bg-blue text-white px-5 p-3 rounded">
                          <AiOutlineSearch className=" mr-5" />
                          <button className="text-sm uppercase">Search</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mx-80 mt-5 bg-white text-title p-3 rounded capitalize text-sm">
                        <div className="flex justify-center items-center">
                          <AiOutlineEnvironment className="text-gray-400 mr-2" />
                          land
                        </div>
                        <div className="flex justify-center items-center">
                          <AiOutlineHome className="text-gray-400 mr-2" />
                          housing
                        </div>
                        <div className="flex justify-center items-center">
                          <FaWalking className="text-gray-400 mr-2" />
                          shortlet
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center gap-7 mt-80 z-20">
              <Link
                to="/signup"
                className="px-5 py-2 bg-primary hover:bg-blue text-white rounded"
              >
                Get Started
              </Link>
              <Link
                to="/marketer/signup"
                className="px-4 py-2 bg-cadetblue hover:bg-steelblue text-white rounded"
              >
                Get Started as a Marketer
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
