import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MarketerEmailVerification = () => {
  const { token, marketerId } = useParams();
  const navigate = useNavigate();

  // console.log("marketerId:", marketerId);

  useEffect(() => {
    const fetchMarketerDetails = async () => {
      try {
        const response = await axios.get(
          `https://surefinders-backend.onrender.com/api/marketer-details/${marketerId}`,
          // `/api/marketer-details/${marketerId}`,
          { withCredentials: true }
        );
        const { success, marketer } = response.data;
        // console.log(response.data);
        if (success && marketer) {
          setTimeout(() => {
            navigate(`/marketer/payment/${marketer._id}`);
          }, 4000); // delay in ms
        } else {
          // console.log("Marketer details not found or not successful.");
        }
      } catch (error) {
        console.error(`Failed to fetch marketer details: ${error.message}`);
      }
    };
    fetchMarketerDetails();
  }, [marketerId, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75"> 
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-lg text-center leading-6 font-medium text-title">
        Your email has been successfully verified. You will be redirected to the login page shortly.
      </div>
    </div>
  </div>
  );
};

export default MarketerEmailVerification;


// https://pbs.twimg.com/profile_images/1604859709210624000/i2dzGLJS_400x400.jpg