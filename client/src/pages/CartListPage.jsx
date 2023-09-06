import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import ProductPage from "./ProductPage";
import LandPage from "./LandPage";
import Layout from "../components/Layout";
import { AiOutlineEnvironment } from "react-icons/ai";
import { FaBath, FaBed, FaDoorOpen, FaRuler } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { GiRoad } from "react-icons/gi";
import { UserContext } from "../contexts/UserContext";
import { FaSpinner } from "react-icons/fa";

const CartListPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useContext(CartContext);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Update isModalOpen based on cartItems length
    setIsModalOpen(cartItems.length === 0);
  }, [cartItems]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckout = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (!user) {
        // Not authenticated, redirect to login
        navigate("/login", { state: { from: "/cart" } });
      } else {
        // Authenticated, proceed to checkout
        navigate("/paystackcheckout");
      }
    }, 2000); // Adjust the delay duration as needed
  };

  return (
    <Layout>
      <div className="container mx-auto px-8 my-28">
        <div className="flex justify-between mb-6 items-center">
          <h2 className="text-2xl font-bold text-white px-5 py-2 rounded-md bg-gray-800">
            Your Cart
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item) => {
            const { id, title, description, price, location, images, type } =
              item;

            const numberOfBaths = item.numberOfBaths || null;
            const numberOfBeds = item.numberOfBeds || null;
            const numberOfRooms = item.numberOfRooms || null;
            const squareFootage = item.squareFootage || null;
            const acreage = item.acreage || null;

            return (
              <div key={id} className="border p-3 w-full">
                {type === "product" && (
                  <div className="">
                    {images.length > 0 && (
                      <img
                        src={`https://surefinders-backend.onrender.com/public/images/${item.images[0]}`}
                        // src={`http://localhost:5175/public/images/${item.images[0]}`}
                        alt={item.title}
                        className="w-full max-h-60 object-cover image"
                      />
                    )}
                    <div className="flex justify-between items-center my-4">
                      <div className="">
                        <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-4">
                          {title}
                        </span>
                        <p className="text-title text-lg capitalize break-words font-bold my-2">
                          {description.length > 15
                            ? `${description.substring(0, 15)}...`
                            : description}
                        </p>
                        <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-4">
                          <AiOutlineEnvironment className="text-gray-400 mr-1" />
                          {location}
                        </p>
                        <div className="flex">
                          <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                            <div className="flex-col">
                              <p>Baths</p>
                              <div className="flex justify-center items-center">
                                <span className="mr-1">
                                  <FaBath />
                                </span>
                                <p>{numberOfBaths}</p>
                              </div>
                            </div>
                            <div className="flex-col">
                              <p>Beds</p>
                              <div className="flex justify-center items-center">
                                <span className="mr-1">
                                  <FaBed />
                                </span>
                                <p>{numberOfBeds}</p>
                              </div>
                            </div>
                            <div className="flex-col">
                              <p>Rooms</p>
                              <div className="flex justify-center items-center">
                                <span className="mr-1">
                                  <FaDoorOpen />
                                </span>
                                <p>{numberOfRooms}</p>
                              </div>
                            </div>
                            <div className="flex-col">
                              <p>Area</p>
                              <div className="flex justify-center items-center">
                                <span className="mr-1">
                                  <FaRuler />
                                </span>
                                <p>{squareFootage} Sq Ft</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg text-title font-bold border-t my-2">
                            &#x20A6;{price}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="mr-2">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-10 px-2 py-1 border border-gray-300 rounded text-gray-800 mr-5 text-center"
                      />
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          className="px-4 border border-gray-300 bg-red hover:text-gray-300 rounded text-gray-800 text-center text-xl cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-4 border border-gray-300 bg-green hover:text-gray-300 rounded text-gray-800 text-center text-xl cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-red text-white rounded hover:text-slate-300"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {type === "land" && (
                  <div className="">
                    {images.length > 0 && (
                      <img
                        src={`https://surefinders-backend.onrender.com/public/images/${item.images[0]}`}
                        // src={`http://localhost:5175/public/images/${item.images[0]}`}
                        alt={item.title}
                        className="w-full max-h-60 object-cover image"
                      />
                    )}
                    <div className="flex justify-between items-center my-4">
                      <div className="">
                        <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                          {title}
                        </span>
                        <p className="text-title text-lg capitalize break-words font-bold my-2">
                          {description.length > 15
                            ? `${description.substring(0, 15)}...`
                            : description}
                        </p>

                        <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-3">
                          <FiMapPin className="text-gray-400 mr-1" />
                          {location}
                        </p>
                        <div className="flex">
                          <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                            <div className="flex-col">
                              <p className="mb-2">Acreage</p>
                              <div className="flex justify-center items-center">
                                <span className="mr-1">
                                  <GiRoad />
                                </span>
                                <p>{acreage} Acres</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-lg text-title font-bold border-t my-2">
                            &#x20A6;{price}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="mr-2">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-10 px-2 py-1 border border-gray-300 rounded text-gray-800 mr-5 text-center"
                      />
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          className="px-4 border border-gray-300 bg-red hover:text-gray-300 rounded text-gray-800 text-center text-xl cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-4 border border-gray-300 bg-green hover:text-gray-300 rounded text-gray-800 text-center text-xl cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-red text-white rounded hover:text-slate-300"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
              <div className="bg-white p-20 rounded-lg shadow-md text-center relative ">
                <p className="text-gray-500 text-2xl">
                  Oops! Your cart is empty.
                </p>
                <button
                  className="absolute bottom-1 right-3 p-1 bg-primary hover:bg-blue text-white rounded my-4"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold">
              Total Price: &#x20A6;{totalPrice}{" "}
              {/* Use totalPrice from the context */}
            </h3>

            <button
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            {isLoading ? (
              <FaSpinner className="animate-spin text-4xl text-primary" />
            ) : (
              <button
                onClick={handleCheckout}
                className="bg-primary hover:bg-blue text-white font-bold py-2 px-4 rounded"
                disabled={isLoading} // Disable the button while loading
              >
                {isLoading ? "Loading..." : "Proceed to Checkout"}
              </button>
            )}
          </div>
        )}

        <ProductPage />
        <LandPage />
      </div>
    </Layout>
  );
};

export default CartListPage;
