import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineEnvironment } from "react-icons/ai";
import { Layout } from "../components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const InvestmentDetails = () => {
  const { id } = useParams(); 
  const [investment, setInvestment] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get(
          `https://surefinders-backend.onrender.com/api/investments/${id}`,
          // `/api/investments/${id}`,
          {
            withCredentials: true,
          }
        );
        setInvestment(response.data.data);
        // console.log(response.data)
        setCurrentImage(response.data.data.images[0]); // set the first image as current
      } catch (error) {
        console.error("Failed to fetch investments:", error);
      }
    };

    fetchInvestments();
  }, [id]);

  if (!investment) {
    return <p>Loading...</p>;
  }

  const { title, description, investmentAmount, terms, location, images } = investment;

  const handleThumbnailClick = (index) => {
    setCurrentImage(images[index]); // set the clicked image as current
  };

  const handlePrevClick = () => {
    if (investment && investment.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? investment.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextClick = () => {
    if (investment && investment.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === investment.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  useEffect(() => {
    if (investment && investment.images) {
      setCurrentImage(investment.images[currentImageIndex]);
    }
  }, [currentImageIndex]);

 
  return (
    <Layout>
      <div className="container mx-auto p-10 py-40">
        <div className="title_head mb-4">
          <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Investment Details
          </h2>
          <p className="text-center capitalize text-subTitle">
            We provide full service at every step.
          </p>
        </div>
        <div className="flex justify-between items-center gap-16 mx-auto bg-slate-50 rounded-lg shadow-xl p-8">
          <div className="max-w-md">
            <div className="flex justify-center relative">
              {currentImage.length > 0 && (
                <img
                  src={`https://surefinders-backend.onrender.com/public/images/${currentImage}`}
                  // src={`http://localhost:5175/public/images/${currentImage}`}
                  alt={title}
                  className="w-full max-h-96 object-cover mb-4 transition-opacity duration-300 hover:opacity-90 cursor-pointer"
                />
              )}
              <FaChevronLeft
                className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-indigo-100 m-2 p-2 rounded-full hover:text-indigo-500 hover:bg-gray-300 transition-colors duration-300"
                onClick={handlePrevClick}
                size={30}
              />
              <FaChevronRight
                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-indigo-100 m-2 p-2 rounded-full hover:text-indigo-500 hover:bg-gray-300 transition-colors duration-300"
                onClick={handleNextClick}
                size={30}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {investment &&
                investment.images &&
                investment.images.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={`https://surefinders-backend.onrender.com/public/images/${thumbnail}`}
                    // src={`http://localhost:5175/public/images/${thumbnail}`}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-16 object-cover cursor-pointer transition-opacity duration-300 hover:opacity-90"
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
            </div>
          </div>
          <div className="">
            <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-4">
              {title}
            </span>
            <p className="text-title text-lg capitalize break-words font-bold my-2">
              {description}
            </p>
            <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-4">
              <AiOutlineEnvironment className="text-primary font-semibold mr-1" />
              {location}
            </p>
            <div className="flex">
              <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                <div className="flex-col">
                  <p  className="mb-2 font-bold">Terms</p>
                  <div className="flex justify-center items-center">                  
                    <p>{terms}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg text-red font-bold border-t mt-2">
                &#x20A6;{investmentAmount?.toLocaleString()}
              </p>
            </div>
          </div>        
        </div>
      </div>
    </Layout>
  );
};

export default InvestmentDetails;
