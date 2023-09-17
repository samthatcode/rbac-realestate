import React, { useState } from "react";
import Hero from "./Hero";
import ContactUs from "./ContactUs";
import Layout from "./Layout";
import { InvestmentPage, ProductPage, LandPage } from "../pages";
import Events from "./Event/Events";

const Home = () => {
  const [selectedProductCategoryId, setSelectedProductCategoryId] =
    useState("");
  const [selectedLandCategoryId, setSelectedLandCategoryId] = useState("");
  // const [selectedInvestmentCategoryId, setSelectedInvestmentCategoryId] =  useState("");

  const handleProductCategorySelect = (categoryId) => {
    setSelectedProductCategoryId(categoryId);
  };

  const handleLandCategorySelect = (categoryId) => {
    setSelectedLandCategoryId(categoryId);
  };

  // const handleInvestmentCategorySelect = (categoryId) => {
  //   setSelectedInvestmentCategoryId(categoryId);
  // };

  return (
    <div>
      <Layout>
        <Hero />
        <ProductPage
          categoryId={selectedProductCategoryId}
          handleProductCategorySelect={handleProductCategorySelect}
        />

        <LandPage
          categoryId={selectedLandCategoryId}
          handleLandCategorySelect={handleLandCategorySelect}
        />

        <InvestmentPage />
        <Events />
        <ContactUs />
      </Layout>
    </div>
  );
};

export default Home;
