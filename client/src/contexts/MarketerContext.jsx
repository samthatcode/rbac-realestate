import React, { createContext, useState } from "react";

export const MarketerContext = createContext();

export const MarketerProvider = ({ children }) => {
  const [marketer, setMarketer] = useState(null);
  const [paymentReference, setPaymentReference] = useState("");

 

  return (
    <MarketerContext.Provider
      value={{ marketer, setMarketer, paymentReference, setPaymentReference }}
    >
      {children}
    </MarketerContext.Provider>
  );
};
