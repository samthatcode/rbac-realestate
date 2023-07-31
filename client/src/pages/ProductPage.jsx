import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../CartContext";
import axios from "axios";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/products");
        console.log(response.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Product Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-2xl bg-slate-100 p-6">
        {Array.isArray(products) && products.length > 0 ? (
          // Check if products is an array and not empty
          products.map((product) => (
            <div key={product._id} className="flex flex-col justify-between">
              <Link
                to={`/products/${product._id}`}
                className="hover:scale-90 transition-all"
              >
                <div className="max-w-screen-md mx-auto">
                  <div className="max-w-md bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-xl text-darkslategray font-bold mb-4 capitalize">
                      {product.title}
                    </h1>
                    {product.images.length > 0 && (
                      <img
                        src={`http://localhost:5175/public/images/${product.images[0]}`}
                        alt={product.title}
                        className="w-full mb-4 capitalize"
                      />
                    )}
                    <p className="text-gray-400 mb-4 capitalize break-words">
                      {product.description}
                    </p>
                    <p className="text-lg text-teal font-bold mb-4">
                      Price: ${product.price}
                    </p>
                    <p className="text-sm mb-4 text-zinc-500">Amenities: {product.amenities}</p>
                    <ul className="list-disc pl-6">
                      <li className="text-[12px] text-darkslategray">
                        Square Footage: {product.squareFootage}
                      </li>
                      <li className="text-[12px] text-darkslategray">
                        Number of Rooms: {product.numberOfRooms}
                      </li>
                      <li className="text-[14px] text-slate-500 capitalize">
                        Location: {product.location}
                      </li>
                      {/* Add more product details as needed */}
                    </ul>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-2xl">          
           Oops!!😞  No products available.
          </div> // Handle the case when products is not an array or empty
        )}
      </div>
    </div>
  );
};

export default ProductPage;
