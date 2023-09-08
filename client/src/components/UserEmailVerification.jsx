import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // If there is a token, navigate to login after a delay
  if (token) {
    setTimeout(() => {
      navigate("/login");
    }, 4000); // delay in ms
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75"> 
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-lg leading-6 font-medium text-title">
        Your email has been successfully verified. You will be redirected to the login page shortly.
      </div>
    </div>
  </div>
  );
};

export default UserEmailVerification;
