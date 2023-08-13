import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import { toast } from "react-toastify";

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
        const response = await axios.get(`/api/products/${id}`);
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
      console.log("Product added to cart:", product);
    } else {
      toast.error("Please login to add a product to cart", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => navigate("/login"),
      });

      console.log("User not logged in");
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(images[index]); // set the clicked image as current
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 capitalize">{title}</h1>
        <div className="flex justify-center">
          {currentImage && (
            <img
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
                src={`http://localhost:5175/public/images/${thumbnail}`}
                alt={`Preview ${index + 1}`}
                className="w-full h-16 object-cover cursor-pointer"
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
        </div>
        <p className="text-gray-700 mb-4 capitalize">{description}</p>
        <p className="text-lg font-bold mb-4">Price: ${price}</p>
        <p className="text-sm mb-4">Amenities: {amenities}</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="text-[12px] text-darkslategray">
            Square Footage: {squareFootage}
          </li>
          <li className="text-[12px] text-darkslategray">
            Number of Rooms: {numberOfRooms}
          </li>
          <li className="text-[14px] capitalize">Location: {location}</li>
        </ul>
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
