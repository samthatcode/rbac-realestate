import React, { useContext, useState } from "react";
import axios from "axios";
import { ReferralContext } from "../ReferralsContext";
import { MarketerContext } from "../MarketerContext";
const Referrals = () => {
  const [marketerId, setMarketerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [referralId, setReferralId] = useState("");
  const [referralData, setReferralData] = useContext(ReferralContext);
  // const { marketer } = useContext(MarketerContext);
  // const referringMarketerId = marketer._id;

  const createReferral = async () => {
    try {
      const response = await axios.post("/api/referrals", {
        referringMarketerId: marketerId,
        referredClientId: clientId,
      });
      setReferralData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getReferral = async () => {
    try {
      const response = await axios.get(`/api/referrals/${referralId}`);
      setReferralData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const trackReferral = async () => {
    try {
      const response = await axios.post("/api/track-referrals", {
        referringMarketerId: marketerId,
        referredClientId: clientId,
      });
      setReferralData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-600">Referrals</h1>
      <h1 className="text-xl font-bold text-teal mb-4">Create Referrals</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Marketer ID"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          onChange={(e) => setMarketerId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Client ID"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          onChange={(e) => setClientId(e.target.value)}
        />
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        onClick={createReferral}
      >
        Create Referral
      </button>

      <div className="">
        <h1 className="text-xl font-bold text-darkteal mt-20">Get Referrals</h1>
        <div className="grid grid-cols-2 gap-4 my-4">
          <input
            type="text"
            placeholder="Referral ID"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(e) => setReferralId(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
            onClick={getReferral}
          >
            Get Referral
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600"
            onClick={trackReferral}
          >
            Track Referral
          </button>
        </div>
      </div>

      {referralData && (
        <div className="mt-4">
          Referral Data: {JSON.stringify(referralData)}
        </div>
      )}
    </div>
  );
};

export default Referrals;
