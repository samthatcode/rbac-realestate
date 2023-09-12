import React, { useEffect, useState } from "react";
import { FaHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { useNavigate } from "react-router-dom";
import { AiOutlineEnvironment } from "react-icons/ai";
import { FaBath, FaBed, FaDoorOpen, FaRuler } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SavedProductItems = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);

  const { savedProperties, toggleSavedProperty } = useSavedProperties();
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const productsPerPage = 3;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(savedProducts.length / productsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchSavedProductsDetails = async () => {
      try {
        const response = await axios.get(
          "https://surefinders-backend.onrender.com/api/products",
          // "/api/products",
          {
            params: { ids: savedProperties.join(",") },
            withCredentials: true,
          }
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch saved products details:", error);
        setError(error);
      }
    };

    if (savedProperties.length > 0) {
      fetchSavedProductsDetails();
    }
  }, [savedProperties]);

  const savedProducts = products.filter((product) => {
    return savedProperties.includes(product._id);
  });

  const handleHeartClick = (product) => {
    product;
    const isCurrentlySaved = savedProperties.includes(product._id);
    toggleSavedProperty(product._id);
    if (!isCurrentlySaved) {
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
          Recent Saved Property
        </h2>
        <p class="text-center capitalize text-subTitle mb-10">
          Your saved Properties
        </p>
      </div>

      <div className="my-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savedProducts.length > productsPerPage && (
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
        {savedProducts
          .slice(
            currentPage * productsPerPage,
            (currentPage + 1) * productsPerPage
          )
          .map((product) => (
            <div key={product._id} className="">
              <div
                className="relative rounded overflow-hidden hover:shadow-xl transition-all hover-card cursor-pointer"
                onClick={() => {
                  // Check if the click target is not the heart icon
                  if (!event.target.classList.contains("heart-icon")) {
                    navigate(`/products/${product._id}`);
                  }
                }}
              >
                <div className="image-container">
                  {product.images.length > 0 && (
                    <img
                      src={`https://surefinders-backend.onrender.com/public/images/${product.images[0]}`}
                      // src={`http://localhost:5175/public/images/${product.images[0]}`}
                      alt={product.title}
                      className="w-full max-h-60 object-cover image"
                    />
                  )}
                </div>
                <span
                  className={`absolute top-2 right-2 text-sm font-medium capitalize p-1 py-1 px-2 last:mr-0 mr-1 cursor-pointer ${
                    savedProperties.includes(product._id)
                      ? "text-red"
                      : "text-gray-200"
                  } heart-icon`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeartClick(product);
                  }}
                >
                  <FaHeart size={20} />
                </span>

                <div className="p-4 block border hover-card-content">
                  <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                    {product.title}
                  </span>
                  <p className="text-title text-lg capitalize break-words font-bold my-2">
                    {product.description.length > 15
                      ? `${product.description.substring(0, 15)}...`
                      : product.description}
                  </p>
                  <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-3">
                    <AiOutlineEnvironment className="text-primary font-semibold mr-1" />
                    {product.location}
                  </p>
                  <div className="flex">
                    <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                      <div className="flex-col">
                        <p className="mb-2">Baths</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaBath />
                          </span>
                          <p>{product.numberOfBaths}</p>
                        </div>
                      </div>
                      <div className="flex-col">
                        <p className="mb-2">Beds</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaBed />
                          </span>
                          <p>{product.numberOfBeds}</p>
                        </div>
                      </div>
                      <div className="flex-col">
                        <p className="mb-2">Rooms</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaDoorOpen />
                          </span>
                          <p>{product.numberOfRooms}</p>
                        </div>
                      </div>
                      <div className="flex-col">
                        <p className="mb-2">Area</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaRuler />
                          </span>
                          <p>{product.squareFootage} Sq Ft</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-red font-bold border-t mt-2">
                      &#x20A6;{product.price?.toLocaleString()}
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

export default SavedProductItems;
