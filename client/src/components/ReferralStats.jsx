import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ReferralContext } from "../ReferralsContext";

const ReferralStats = () => {
  const [referralData] = useContext(ReferralContext);
  const [referralCount, setReferralCount] = useState(0);
  const [commissionEarned, setCommissionEarned] = useState(0);
  

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const response = await axios.get("/api/referrals/stats");
        setReferralCount(response.data.referralCount);
        setCommissionEarned(response.data.commissionEarned);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchReferralStats();
  }, [referralData]); // update stats whenever referral data changes

  return (
    <div className="bg-gray-200 p-4 rounded">
      <h1 className="text-2xl font-bold mb-4">Referrals Statistics</h1>
      <div className="grid grid-cols-2 gap-4">
        <p className="text-lg">Referral Count:</p>
        <p className="text-lg">{referralCount}</p>
        <p className="text-lg">Commission Earned:</p>
        <p className="text-lg">${commissionEarned}</p>
      </div>
    </div>
  );
};

export default ReferralStats;
