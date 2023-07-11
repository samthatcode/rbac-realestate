import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);  // Add this line
  
    useEffect(() => {
      console.log("Updated cartItems:", cartItems);
      calculateTotalPrice();  // Add this line
    }, [cartItems]);
  
    const addToCart = (product) => {
      console.log("Adding to cart:", product);
      setCartItems([...cartItems, {...product, quantity: 1}]);
    };
  
    const removeFromCart = (productId) => {
      setCartItems(cartItems.filter((item) => item.id !== productId));
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
    };
  
    const calculateTotalPrice = () => {  // Add this function
      let total = 0;
      cartItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      setTotalPrice(total.toFixed(2));
    };
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeFromCart,
          clearCart,
          updateQuantity,
          totalPrice,  // Add this line
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
  