import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { AiOutlineEnvironment } from "react-icons/ai";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [currentImage, setCurrentImage] = useState("");

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
    amenities,
    squareFootage,
    numberOfRooms,
    location,
    images,
  } = product;

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
      toast("Product added to cart", {
        position,
        autoClose: 2000,
      });
      // console.log("Product added to cart:", product);
    } else {
      toast.error("Please login to add a product to cart", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => navigate("/login"),
      });

      // console.log("User not logged in");
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(images[index]); // set the clicked image as current
  };

  return (
    <div className="container mx-auto p-4">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Recent Property Details
        </h2>
        <p class="text-center capitalize text-subTitle">
          We provide full service at every step.
        </p>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 capitalize">{title}</h1>
        <div className="flex justify-center">
          {currentImage && (
            <img
              // src={`https://surefinders-backend.onrender.com/public/images/${currentImage}`}
              src={`http://localhost:5175/public/images/${currentImage}`}
              alt={title}
              className="w-full max-h-96 object-cover mb-4"
            />
          )}
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {product &&
            product.images &&
            product.images.map((thumbnail, index) => (
              <img
                key={index}
                // src={`https://surefinders-backend.onrender.com/public/images/${thumbnail}`}
                src={`http://localhost:5175/public/images/${thumbnail}`}
                alt={`Preview ${index + 1}`}
                className="w-full h-16 object-cover cursor-pointer"
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
        </div>
        <div className="p-4 border-b">
          <h1 className="text-sm font-medium capitalize text-orange-500 bg-orange-100 p-1 py-1 px-2 last:mr-0 mr-1 flex mb-2">
            {title}
          </h1>
          <p className="text-gray-400 capitalize break-words font-bold mb-2">
            {description}
          </p>
          <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-4">
            <AiOutlineEnvironment className="text-gray-400 mr-1" />
            {location}
          </p>
          <div className="flex">
            <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
              <div className="flex-col">
                <p>Baths</p>
                <p>{numberOfRooms}</p>
              </div>
              <div className="flex-col">
                <p>Beds</p>
                <p>{amenities}</p>
              </div>
              <div className="flex-col">
                <p>Rooms</p>
                <p>{numberOfRooms}</p>
              </div>
              <div className="flex-col">
                <p>Area</p>
                <p>{squareFootage}</p>
              </div>
            </div>
          </div>
          <p className="text-lg text-teal font-bold border-t mt-2">
            &#x20A6;{price}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
