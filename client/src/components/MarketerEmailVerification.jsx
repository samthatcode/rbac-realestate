import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const MarketerEmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // If there is a token, navigate to login after a delay
  if (token) {
    setTimeout(() => {
      navigate("/marketer/login");
    }, 4000); // delay in ms
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-lg leading-6 font-medium text-gray-900">
        Your email has been successfully verified. You will be redirected to the login page shortly.
      </div>
    </div>
  );
};

export default MarketerEmailVerification;
