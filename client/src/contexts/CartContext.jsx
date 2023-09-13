import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [paymentReference, setPaymentReference] = useState("");

  return (
    <CartContext.Provider
      value={{
        paymentReference,
        setPaymentReference,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
