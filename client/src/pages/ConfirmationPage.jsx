import React, { useContext, useEffect } from "react";
import { CartContext } from "../CartContext";

const ConfirmationPage = () => {
  const { cartItems, totalPrice, deliveryDate } = useContext(CartContext);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-400">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Thank you for your purchase!
        </h2>
        <p className="text-gray-600 mb-4">
          Your order has been placed successfully. We'll send you an email
          confirmation shortly.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">
          Order Summary:
        </h3>
        <ul className="list-disc pl-6 mt-2 text-gray-700">
          {cartItems.map((item) => (
            <li key={item.id} className="mb-2">
              <span className="font-semibold">{item.name}</span> - ${item.price}{" "}
              x {item.quantity}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-800">
          Total: <span className="font-semibold">${totalPrice}</span>
        </p>
        <p className="mt-1 text-gray-800">
          Estimated delivery date: {deliveryDate}
        </p>

        <button
          onClick={() => window.print()}
          className="p-3 mt-6 bg-indigo-500 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md"
        >
          Print Order Summary
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
