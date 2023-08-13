import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import { CartContext } from "../contexts/CartContext";

const toastParams = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "light",
};
const notify = (val) => toast.success(`${val}`, toastParams);
const warn = (val) => toast.error(`${val}`, toastParams);
const inform = (val) => toast.info(`${val}`, toastParams);

const PaystackCheckout = () => {
  const { totalPrice, setPaymentReference } = useContext(CartContext);
  const navigateTo = useNavigate();
  const [paymentEmail, setPaymentEmail] = useState("");

  const totalPriceNumber = parseFloat(totalPrice);
  const [paymentAmount, setPaymentAmount] = useState(totalPriceNumber);

  const config = {
    reference: new Date().getTime().toString(),
    email: paymentEmail,
    amount: paymentAmount * 100, // Amount is in kobo, so 20000 kobo = N200
    publicKey: import.meta.env.VITE_PAYSTACK_TEST_SECRET_KEY,
  };

  const handlePaystackSuccessAction = (reference) => {
    if (reference.status === "success") {
      // Save the payment reference to the context
      setPaymentReference(reference.reference);
      navigateTo("/checkout");
    }
  };

  const handlePaystackCloseAction = () => {
    console.log("Payment dialog closed");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "paymentEmail") {
      setPaymentEmail(value);
    } else if (name === "paymentAmount") {
      setPaymentAmount(value);
    }
  };

  useEffect(() => {
    setPaymentAmount(parseFloat(totalPrice));
  }, [totalPrice]);

  const componentProps = {
    ...config,
    text: (
      <p className="text-lg font-semibold text-white mt-4 px-3 py-2 rounded-md bg-teal hover:bg-steelblue">
        Pay Now
      </p>
    ),
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-4 bg-slate-100 rounded-md shadow-xl">
        <h1 className="my-4 text-2xl font-bold mb-4">Checkout</h1>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 text-lg text-teal">
            Email Address
          </label>
          <input
            className="w-full p-2 border rounded-md"
            id="paymentEmail"
            name="paymentEmail"
            value={paymentEmail}
            type="email"
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="my-2 text-lg text-teal">
            Amount to pay
          </label>
          <input
            className="w-full p-2 border rounded-md"
            id="amount"
            name="paymentAmount"
            value={paymentAmount}
            type="text"
            onChange={handleInputChange}
            placeholder="Amount"
            readOnly
          />
        </div>
      </div>
      <PaystackButton {...componentProps} />
    </div>
  );
};

export default PaystackCheckout;
