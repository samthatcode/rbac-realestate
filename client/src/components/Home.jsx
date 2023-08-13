import React from "react";
import Hero from "./Hero";
import FeaturedProperties from "./FeaturedProperties";
import Footer from "./Footer";
import ContactUs from "./ContactUs";

const Home = () => {
  return (
    <div>    
      <Hero />
      <FeaturedProperties />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
