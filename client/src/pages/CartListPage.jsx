import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";

const CartListPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, quantity } =
    useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
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
            image
          } = product;

          return (
            <div key={product.id} className="border p-4">
              <div className="flex items-center mb-4">
                <img src={image} alt={title} className="w-16 h-16 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                  <p className="text-gray-600">${price}</p>
                  <p className="text-gray-600">Amenities: {amenities}</p>
                  <p className="text-gray-600">Square Footage: {squareFootage}</p>
                  <p className="text-gray-600">Number of Rooms: {numberOfRooms}</p>
                  <p className="text-gray-600">Location: {location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <label className="mr-2">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-800"
                />
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
              <h3 className="text-green-500 text-xl mt-10">
                Shop and Add Products to Cart
              </h3>
            </Link>
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold">
            Total Price: ${totalPrice} {/* Use totalPrice from the context */}
          </h3>

          <button
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      )}
      <button
        onClick={handleCheckout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-center"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartListPage;
