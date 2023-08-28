import React from "react";
import Hero from "./Hero";
import FeaturedProperties from "./FeaturedProperties";
import ContactUs from "./ContactUs";
import Layout from "./Layout";
import { ProductPage } from "../pages";

const Home = () => {
  return (
    <div> 
      <Layout>
        <Hero />
        <ProductPage />
        <FeaturedProperties />
        <ContactUs />     
      </Layout>  
    </div>
  );
};

export default Home;
