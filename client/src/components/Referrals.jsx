import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ReferralContext } from "../ReferralsContext";

const Referrals = ({ referralId }) => {
  const [referralData, setReferralData] = useContext(ReferralContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const referringMarketerId = referralId;

  if (!referringMarketerId) {
    console.log("No referring marketer id found in the URL");
  } else {
    console.log("Referring marketer's ID is: ", referringMarketerId);
  }

  const fetchReferrals = async () => {
    console.log("Fetching referrals for marketer ID:", referringMarketerId);
    setIsLoading(true);
    try {
      const response = await axios.get("/api/referrals", {
        params: {
          referringMarketerId: referringMarketerId,
        },
      });
      console.log("Response from server:", response);
      if (response.data && Array.isArray(response.data.data)) {
        console.log("Referral data received:", response.data.data);
        setReferralData(response.data);
      } else {
        console.log("Unexpected data structure:", response.data);
      }
    } catch (error) {
      const errorMessage = "Error: " + error;
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (referringMarketerId) {
      console.log("Current referring marketer id:", referringMarketerId);
      fetchReferrals();
    }
  }, [referringMarketerId]); // Empty dependency array means this effect will only run once, when the component mounts

  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("referralData:", referralData);

  return (
    <div className="p-8">
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {referralData && Array.isArray(referralData.data) && (
        <div className="mt-10 bg-slate-100 shadow-xl p-5 rounded-lg">
          <h2 className="text-center text-2xl text-teal mb-2">Referral Data</h2>
          <table className="w-full table-auto mb-4 rounded-md">
            <thead>
              <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                <th className="border px-4 py-2">No.</th>
                <th className="border px-4 py-2">Referral ID</th>
                <th className="border px-4 py-2">Referring Marketer ID</th>
                <th className="border px-4 py-2">Referred Client ID</th>
                <th className="border px-4 py-2">Referral Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {referralData.data.map((item, index) => (
                <tr
                  className="border-b border-gray-300 hover:bg-gray-200 cursor-pointer"
                  key={index}
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item._id}</td>
                  <td className="border px-4 py-2">
                    {item.referredClient.associatedMarketer}
                  </td>
                  <td className="border px-4 py-2">
                    {item.referredClient.email}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(item.referralDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Referrals;
