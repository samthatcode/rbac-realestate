import React, { createContext, useState } from 'react';

export const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const [referralData, setReferralData] = useState({});

  return (
    <ReferralContext.Provider value={[referralData, setReferralData]}>
      {children}
    </ReferralContext.Provider>
  );
};
