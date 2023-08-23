import React from "react";
import Hero from "./Hero";
import FeaturedProperties from "./FeaturedProperties";
import ContactUs from "./ContactUs";
import Layout from "./Layout";

const Home = () => {
  return (
    <div> 
      <Layout>
        <Hero />
        <FeaturedProperties />
        <ContactUs />     
      </Layout>  
    </div>
  );
};

export default Home;
