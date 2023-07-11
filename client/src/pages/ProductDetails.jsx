import React, { useContext, useState } from "react";
import { CartContext } from "../CartContext";

const ProductDetails = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl text-darkslategray font-bold mb-4">
        {product.name}
      </h1>
      <img src={product.image} alt={product.name} className="w-full mb-4" />
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-lg text-teal font-bold mb-4">
        Price: ${product.price}
      </p>
      <p className="text-sm mb-4">Rating: {product.rating}/5</p>
      <ul className="list-disc pl-6 mb-4">
        <li className="text-[12px] text-darkslategray">
          Color: {product.color}
        </li>
        <li className="text-[14px]">Size: {product.size}</li>
        {/* Add more product details as needed */}
      </ul>
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
