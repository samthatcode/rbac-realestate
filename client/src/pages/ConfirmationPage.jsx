import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const ConfirmationPage = () => {
  const { cartItems, totalPrice, deliveryDate, clearCart, paymentReference } =
    useContext(CartContext);
  const navigate = useNavigate();

  const handleCloseButtonClick = () => {
    clearCart();
    navigate("/products");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-400">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Thank you for your purchase!
        </h2>
        <p className="text-green-600 mb-4">
          Your order has been placed successfully. We'll send you an email
          confirmation shortly.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">
          Order Summary:
        </h3>
        <ul className="list-disc pl-6 mt-2 text-gray-700">
          {cartItems.map((item) => (
            <li key={item.id} className="mb-2">
              <span className="font-semibold">{item.name}</span> - &#x20A6;
              {item.price} x {item.quantity}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-800">
          Total: <span className="font-semibold">&#x20A6;{totalPrice}</span>
        </p>
        <p className="mt-1 text-gray-800">
          Estimated delivery date: {deliveryDate}
        </p>
        <p className="mt-4 text-gray-800">
          Payment Reference:{" "}
          <span className="font-semibold">{paymentReference}</span>
        </p>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => window.print()}
            className="p-3 bg-indigo-500 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md"
          >
            Print Order Summary
          </button>
          <button
            onClick={handleCloseButtonClick}
            className="p-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-md shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
