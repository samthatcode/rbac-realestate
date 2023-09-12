import React from "react";
import Hero from "./Hero";
import ContactUs from "./ContactUs";
import Layout from "./Layout";
import { InvestmentPage, LandPage, ProductPage } from "../pages";
import Events from "./Event/Events";

const Home = () => {
  return (
    <div> 
      <Layout>
        <Hero />
        <ProductPage />
        <LandPage />      
        <InvestmentPage />
        <Events />
        <ContactUs />     
      </Layout>  
    </div>
  );
};

export default Home;
