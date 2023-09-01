import React from "react";
import Hero from "./Hero";
import FeaturedProperties from "./FeaturedProperties";
import ContactUs from "./ContactUs";
import Layout from "./Layout";
import { LandPage, ProductPage } from "../pages";
import Events from "./Event/Events";

const Home = () => {
  return (
    <div> 
      <Layout>
        <Hero />
        <ProductPage />
        <LandPage />
        {/* <FeaturedProperties /> */}
        <Events />
        <ContactUs />     
      </Layout>  
    </div>
  );
};

export default Home;
