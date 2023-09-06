import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentReference, setPaymentReference] = useState("");


  useEffect(() => {
    // console.log("Updated cartItems:", cartItems);
    calculateTotalPrice();
    calculateDeliveryDate();
  }, [cartItems]);

  const addToCart = (item, type) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item._id);
  
    if (existingItem) {
      // If item exists in the cart, update its quantity
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // If item does not exist in the cart, add it
      setCartItems([
        ...cartItems,
        { ...item, id: item._id, quantity: 1, price: item.price, title: item.title, type },
      ]);
    }
  };
  

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    // console.log("Cart items after removal:", cartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    // console.log("Cart items after quantity update:", cartItems);
  };
  

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
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
        paymentReference, 
        setPaymentReference 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
