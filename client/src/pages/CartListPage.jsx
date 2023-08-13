import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const CartListPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/paystackcheckout");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-bold text-white px-5 py-2 rounded-md bg-gray-800">Your Cart</h2>
        <Link
          to="/products"
          className="text-lg font-semibold text-white px-5 py-2 rounded-md bg-gray-800 hover:bg-steelblue"
        >
          Add more products
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartItems.map((product) => {
          const {
            title,
            description,
            price,
            amenities,
            squareFootage,
            numberOfRooms,
            location,
            image,
          } = product;

          return (
            <div key={product.id} className="border p-4">
              <div className="flex items-center mb-4">
                <img src={image} alt={title} className="w-16 h-16 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                  <p className="text-gray-600">&#x20A6;{price}</p>
                  <p className="text-gray-600">Amenities: {amenities}</p>
                  <p className="text-gray-600">
                    Square Footage: {squareFootage}
                  </p>
                  <p className="text-gray-600">
                    Number of Rooms: {numberOfRooms}
                  </p>
                  <p className="text-gray-600">Location: {location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <label className="mr-2">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) =>
                    updateQuantity(product.id, parseInt(e.target.value))
                  }
                  className="w-10 px-2 py-1 border border-gray-300 rounded text-gray-800 mr-5"
                />
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      updateQuantity(product.id, product.quantity - 1)
                    }
                    disabled={product.quantity === 1}
                    className="px-4 border border-gray-300 bg-red-400 hover:bg-red-500 rounded text-gray-800 text-center text-xl"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      updateQuantity(product.id, product.quantity + 1)
                    }
                    className="px-4 border border-gray-300 bg-green-400 hover:bg-green-500 rounded text-gray-800 text-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => removeFromCart(product.id)}
              >
                Remove
              </button>
            </div>
          );
        })}
        {cartItems.length === 0 && (
          <div className="text-center">
            <p className="text-gray-500 text-2xl">Oops! Your cart is empty.</p>
            <Link to="/login">
              <h3 className="text-teal text-lg mt-10">
                Shop and Add Products to Cart
              </h3>
            </Link>
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold">
            Total Price:  &#x20A6;{totalPrice} {/* Use totalPrice from the context */}
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
        <button
          onClick={handleCheckout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-center"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartListPage;
