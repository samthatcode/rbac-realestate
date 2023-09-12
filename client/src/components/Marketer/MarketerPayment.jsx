import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import { MarketerContext } from "../../contexts/MarketerContext";
import axios from "axios";

const MarketerPayment = () => {
  const { setPaymentReference } = useContext(MarketerContext);
  const navigateTo = useNavigate();
  const { marketerId } = useParams();
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(5000);

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

      toast.success("Payment successful", {
        autoClose: 1000,
        position: "top-right",
      });

      // console.log("Marketer:", marketerId);

      // Make API request to send email
      axios
        .post(
          // "/api/marketers/send-payment-email",
          "https://surefinders-backend.onrender.com/api/marketers/send-payment-email",
          {
            email: paymentEmail,
            amount: paymentAmount,
            reference: reference.reference,
          }
        )
        .then(() => {
          // After the email has been sent, make another API request to update the paymentMade property

          // console.log("Making API request to /api/marketers/marketer-payment");
          axios
            .post(
              "https://surefinders-backend.onrender.com/api/marketers/marketer-payment",
              // "/api/marketers/marketer-payment",
              {
                marketerId: marketerId,
              }
            )
            .then(() => {
              // console.log("Navigating to /marketer/login");
              navigateTo("/marketer/login");
            })
            .catch((error) => {
              console.error(`Marketer not found: `, error);
              toast.error("Marketer not found: " + error.message, {
                autoClose: 1000,
                position: "top-left",
              });
            });
        })
        .catch((error) => {
          toast.error("Error sending payment email: " + error.message, {
            autoClose: 1000,
            position: "top-left",
          });
        });
    }
  };

  const handlePaystackCloseAction = () => {
    toast.info("Oops!, we hate to see you go", {
      autoClose: 2000,
      position: "top-right",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "paymentEmail") {
      setPaymentEmail(value);
    } else if (name === "paymentAmount") {
      setPaymentAmount(value);
    }
  };

  const componentProps = {
    ...config,
    text: (
      <p className="text-lg font-semibold text-white mt-4 px-3 py-2 rounded-md bg-primary hover:bg-blue">
        Pay Now
      </p>
    ),
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-4 bg-slate-100 rounded-md shadow-xl">
        <h1 className="my-4 text-2xl font-bold mb-4">Marketer</h1>
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
            placeholder="Amount"
            readOnly
          />
        </div>
      </div>
      <PaystackButton {...componentProps} />
    </div>
  );
};

export default MarketerPayment;
