import React, { createContext, useState, useContext } from "react";

const SavedPropertiesContext = createContext();

export const SavedPropertiesProvider = ({ children }) => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [showSavedProducts, setShowSavedProducts] = useState(false);

  const toggleSavedProperty = (propertyId) => {
    if (savedProperties.includes(propertyId)) {
      setSavedProperties(savedProperties.filter((id) => id !== propertyId));
      setShowSavedProducts(true);
    } else {
      setSavedProperties([...savedProperties, propertyId]);
      setShowSavedProducts(false);
    }
};
  

  return (
    <SavedPropertiesContext.Provider
      value={{
        savedProperties,
        toggleSavedProperty,
        showSavedProducts,
        setShowSavedProducts,
      }}
    >
      {children}
    </SavedPropertiesContext.Provider>
  );
};

export const useSavedProperties = () => useContext(SavedPropertiesContext);
