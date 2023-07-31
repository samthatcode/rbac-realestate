import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import { UserContext } from "../UserContext";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    userId: "",
    products: [],
    shippingAddress: {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    totalPrice: 0,
  });
  const navigate = useNavigate();

  // Get cart contents from CartListPage
  const { cartItems } = useContext(CartContext);

  const userContext = useContext(UserContext);
  console.log(userContext.user);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress,
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = userContext.user._id;
    console.log(userId);
    console.log(cartItems);
    // Send checkout request
    try {
      const response = await axios.post("/api/orders", {
        userId: userId,
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        totalPrice: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      });
      console.log(response.data);
      // Navigate to confirmation page
      navigate("/paymentform");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Rest of the component...

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Billing Address</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              Name
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Email
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
                required
              />
            </label>
            <label>
              Phone Number
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                required
              />
            </label>
            <label>
              Street Address
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 capitalize"
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Street your address"
                required
              />
            </label>
            <label>
              City
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 capitalize"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                required
              />
            </label>
            <label>
              State
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 capitalize"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                required
              />
            </label>
            <label>
              Country
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 capitalize"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Your your country"
              />
            </label>
            <label>
              Postal Code
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Your postal address"
              />
            </label>
          </div>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 hover:text-slate-100 bg-slate-400 text-lg font-bold focus:ring-indigo-600 cursor-pointer"
            type="submit"
            value="- Checkout -"
          />
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
