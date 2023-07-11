import React, { useContext, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { CartContext } from "../CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const cartItemsCount = cartItems ? cartItems.length : 0;

  return (
    <div className="flex items-center ml-4 relative">
      <FaShoppingBasket
        onClick={() => navigate("/cart")}
        className="text-2xl cursor-pointer"
      />
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 px-1 text-xs font-semibold bg-red-500 text-white rounded-full">
          {cartItemsCount}
        </span>
      )}      
    </div>
  );
};

export default Cart;
