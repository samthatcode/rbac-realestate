import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/ProductData";
import { UserContext } from "../UserContext";
import { CartContext } from "../CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return <p>Product not found.</p>;
  }

  const { name, image, description, price, rating, color, size, images } =
    product;

  const [currentImage, setCurrentImage] = useState(image);

  //cart

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
      // Add logic to add the product to the user's cart
      console.log("Product added to cart:", product);
    } else {
      console.log("User not logged in");
      // Display a message or redirect the user to the login page
    }
  };

  const handleThumbnailClick = (thumbnail) => {
    setCurrentImage(thumbnail);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product Details Page</h2>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">{name}</h1>
        <div className="flex justify-center">
          <img
            src={currentImage}
            alt={name}
            className="w-full max-h-96 object-cover mb-4"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {images.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Preview ${index + 1}`}
              className="w-full h-16 object-cover cursor-pointer"
              onClick={() => handleThumbnailClick(thumbnail)}
            />
          ))}
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-lg font-bold mb-4">Price: ${price}</p>
        <p className="text-sm mb-4">Rating: {rating}/5</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Color: {color}</li>
          <li>Size: {size}</li>
          {/* Add more product details as needed */}
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

export default ProductDetailsPage;
