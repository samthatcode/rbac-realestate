import React from "react";
import { CarouselData } from "../data/CarouselData";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative">
      <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop>
        {CarouselData.map((item, index) => (
          <div key={index} className="relative z-10">
            <img
              src={item.image}
              alt={item.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-center p-4 bg-black bg-opacity-50 text-left">
              <div className="md:ml-20 mx-auto md:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="w-full md:w-80 break-words text-white md:text-4xl text-2xl uppercase font-extrabold mb-2">
                    {item.text}
                  </p>
                  <p className="w-full md:w-80 break-words text-gray-100 md:text-xl text-sm">
                    {item.text1}
                  </p>
                </div>
                {/* Add your call-to-action buttons here */}
                <div className="flex space-x-4 mt-4 md:mt-0 z-20">
                  <Link to="/users" className="px-4 py-2 bg-blue-500 text-white rounded">Buyer</Link>
                  <Link to="/marketer/signup" className="px-4 py-2 bg-green-500 text-white rounded">Marketer</Link>
                  <Link to="/login" className="px-4 py-2 bg-red-500 text-white rounded">Login/Register</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;

