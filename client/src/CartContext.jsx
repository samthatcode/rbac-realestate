import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    console.log("Updated cartItems:", cartItems);
    calculateTotalPrice();
    calculateDeliveryDate();
  }, [cartItems]);

  const addToCart = (product) => {
    console.log("Product object:", product);
    console.log(product._id);
    setCartItems([...cartItems, { ...product, id: product._id, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
    console.log("Cart items after removal:", cartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    console.log("Cart items after quantity update:", cartItems);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total.toFixed(2));
  };

  const calculateDeliveryDate = () => {
    const currentDate = new Date();
    const deliveryDate = new Date();
    // assumes all orders are delivered within 7 days
    deliveryDate.setDate(currentDate.getDate() + 7);
    setDeliveryDate(deliveryDate.toDateString());
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalPrice,
        deliveryDate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
