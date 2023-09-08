import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import { Layout } from "../components";
import { FaSpinner } from "react-icons/fa";

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
  const [loading, setLoading] = useState(false);

  // Get cart contents from CartListPage
  const { cartItems, paymentReference } = useContext(CartContext);

  const userContext = useContext(UserContext);
  // console.log(userContext.user.email);

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
    setLoading(true);
    const userId = userContext.user._id;
    // console.log(userId);
    // console.log(cartItems);
    // Send checkout request
    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/orders",
        {
          userId: userId,
          products: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
          })),
          shippingAddress: formData.shippingAddress,
          totalPrice: cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
          paymentReference: paymentReference, // Add the payment reference
        },
        { withCredentials: true }
      );
      // console.log(response.data);
      setTimeout(() => {
        setLoading(false);
        navigate("/confirm");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Get all number input fields
  const numberInputs = document.querySelectorAll('input[type="number"]');
  // Add event listeners to number input fields
  numberInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      // Allow only numbers, backspace, and delete key
      if (
        !(
          (e.key >= "0" && e.key <= "9") ||
          e.key === "Backspace" ||
          e.key === "Delete"
        )
      ) {
        e.preventDefault();
      }
    });
  });

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen my-20">
        <h1 className="text-2xl font-bold mb-4">Billing Address</h1>
        <div className="w-full max-w-xl p-4 bg-white rounded-md shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="name" className="block">
                  Name
                </label>
                <input
                  className="w-full p-2 border rounded-md capitalize"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block">
                  Email
                </label>
                <input
                  className="w-full p-2 border rounded-md "
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block">
                  Phone Number
                </label>
                <input
                  className="w-full p-2 border rounded-md capitalize"
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="street" className="block">
                  Street Address
                </label>
                <input
                  className="w-full p-2 border rounded-md capitalize"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Street your address"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block">
                  City
                </label>
                <input
                  className="w-full p-2 border rounded-md capitalize"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="state" className="block">
                  State
                </label>
                <input
                  className="w-full p-2 border rounded-md capitalize"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="block">
                  Country
                </label>
                <input
                  className="w-full p-2 border rounded-md  capitalize"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Your country"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="postalCode" className="block">
                  Postal Code
                </label>
                <input
                  className="w-full p-2 border rounded-md "
                  type="number"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Your postal address"
                  required
                />
              </div>
            </div>

            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 hover:bg-blue bg-primary text-lg font-bold text-white cursor-pointer"
              type="submit"
              value="- Checkout -"
              disabled={loading}
            />
          </form>
        </div>
        {loading && (
          <div className="overlay">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;
