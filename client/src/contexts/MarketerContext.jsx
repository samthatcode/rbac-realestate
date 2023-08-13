import React, { createContext, useState } from 'react';

export const MarketerContext = createContext();

export const MarketerProvider = ({ children }) => {
  const [marketer, setMarketer] = useState(null);

  return (
    <MarketerContext.Provider value={{ marketer, setMarketer }}>
      {children}
    </MarketerContext.Provider>
  );
};
