import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentReference, setPaymentReference] = useState("");


  useEffect(() => {
    console.log("Updated cartItems:", cartItems);
    calculateTotalPrice();
    calculateDeliveryDate();
  }, [cartItems]);

  const addToCart = (product) => {
    console.log("Product object:", product);
    console.log(product._id);
    const existingProduct = cartItems.find(item => item.id === product._id);
  
    if (existingProduct) {
      // update quantity of the existing product
      updateQuantity(existingProduct.id, existingProduct.quantity + 1);
    } else {
      // add new product to the cart
      setCartItems([...cartItems, { ...product, id: product._id, quantity: 1, price: product.price, title: product.title }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
    console.log("Cart items after removal:", cartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      return;
    }
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
