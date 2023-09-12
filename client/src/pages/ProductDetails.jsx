import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { AiOutlineEnvironment } from "react-icons/ai";
import { FaBath, FaBed, FaDoorOpen, FaRuler } from "react-icons/fa";
import { Layout } from "../components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://surefinders-backend.onrender.com/api/products/${id}`,
          // `/api/products/${id}`,
          { withCredentials: true }
        );
        setProduct(response.data.data);
        setCurrentImage(response.data.data.images[0]); // set the first image as current
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const {
    title,
    description,
    price,
    numberOfBaths,
    numberOfBeds,
    numberOfRooms,
    squareFootage,
    location,
    images,
  } = product;

  const handleThumbnailClick = (index) => {
    setCurrentImage(images[index]); // set the clicked image as current
  };

  const handlePrevClick = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextClick = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  useEffect(() => {
    if (product && product.images) {
      setCurrentImage(product.images[currentImageIndex]);
    }
  }, [currentImageIndex]);

  const handleAddToCart = () => {
    addToCart(product);
    toast("Product added to cart", {
      position: "top-right",
      autoClose: 500,
    });
    // console.log("Product added to cart:", product);
  };

  return (
    <Layout>
      <div className="container mx-auto p-10 py-40">
        <div className="title_head mb-4">
          <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
            Recent Property Details
          </h2>
          <p class="text-center capitalize text-subTitle">
            We provide full service at every step.
          </p>
        </div>
        <div className="flex justify-between items-center mx-auto bg-slate-50 rounded-lg shadow-xl p-8">
          <div className="max-w-md">
            <div className="flex justify-center relative">
              {currentImage && (
                <img
                  src={`https://surefinders-backend.onrender.com/public/images/${currentImage}`}
                  // src={`http://localhost:5175/public/images/${currentImage}`}
                  alt={title}
                  className="w-full max-h-96 object-cover mb-4"
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
              {product &&
                product.images &&
                product.images.map((thumbnail, index) => (
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
            <p className="text-title text-lg capitalize break-words font-bold mb-2">
              {description}
            </p>
            <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-4">
              <AiOutlineEnvironment className="text-primary font-semibold mr-1" />
              {location}
            </p>
            <div className="flex">
              <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                <div className="flex-col">
                  <p>Baths</p>
                  <div className="flex justify-center items-center">
                    <span className="mr-1 text-primary font-semibold">
                      <FaBath />
                    </span>
                    <p>{numberOfBaths}</p>
                  </div>
                </div>
                <div className="flex-col">
                  <p>Beds</p>
                  <div className="flex justify-center items-center">
                    <span className="mr-1 text-primary font-semibold">
                      <FaBed />
                    </span>
                    <p>{numberOfBeds}</p>
                  </div>
                </div>
                <div className="flex-col">
                  <p>Rooms</p>
                  <div className="flex justify-center items-center">
                    <span className="mr-1 text-primary font-semibold">
                      <FaDoorOpen />
                    </span>
                    <p>{numberOfRooms}</p>
                  </div>
                </div>
                <div className="flex-col">
                  <p>Area</p>
                  <div className="flex justify-center items-center">
                    <span className="mr-1 text-primary font-semibold">
                      <FaRuler />
                    </span>
                    <p>{squareFootage} Sq Ft</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg text-red font-bold border-t mt-2">
                &#x20A6;{price?.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-blue text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
