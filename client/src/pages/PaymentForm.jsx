import React, { useContext, useState } from "react";
import { CartContext } from "../CartContext";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";

// Define validation schema for the form
const schema = yup.object().shape({
  email: yup.string().email().required(),
  amount: yup.number().positive().required(),
});

const PaymentForm = () => {
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: "",
    amount: 0,
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate form data
      await schema.validate(formState, { abortEarly: false });

      // If validation is successful, make a POST request to /charge
      const response = await axios.post("/api/charge", {
        email: formState.email,
        amount: formState.amount,
      });

      console.log(response.data);
      // Handle successful payment (e.g., navigate to confirmation page)
      clearCart();
      navigate("/confirmation");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Update the errors state with validation errors
        const errorMessages = {};
        error.inner.forEach((err) => {
          errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      } else {
        console.error(error);
        // Handle failed payment
      }
    }
  };

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block mb-2 font-medium text-gray-700"
        >
          Amount:
        </label>
        <input
          type="number"
          name="amount"
          value={formState.amount}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.amount && <p className="text-red-500 mt-1">{errors.amount}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
      >
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;
