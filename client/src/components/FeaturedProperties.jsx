import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { properties } from "../data/PropertyData";

const FeaturedProperties = () => {
  return (
    <div className="container mx-auto py-8 bg-slate-100">
      <h2 className="md:text-3xl text-xl font-bold mb-6 text-center text-teal capitalize">
        Featured properties or investment opportunities
      </h2>
      <div className="md:hidden">
        <Carousel showThumbs={false}>
          {properties.map((property, index) => (
            <div key={index} className="rounded overflow-hidden shadow-xl hover:scale-90 transition-all">
              <img
                className="w-full"
                src={property.image}
                alt={property.title}
              />
              <div className="px-6 py-4 text-left">
                <div className="text-darkteal font-bold text-xl mb-2">{property.title}</div>
                <p className="text-grayishslate text-base">
                  {property.description}
                </p>
                <p className="text-seagreen text-sm mt-2">{property.price}</p>
              </div>
              <div className="px-6 pt-4 pb-2 text-left">
                <Link
                  to={`/property/${property.id}`}
                  className="inline-block bg-steelblue hover:bg-steelteal text-white font-bold py-2 px-4 rounded"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="hidden md:grid grid-cols-3 gap-4">
        {properties.map((property, index) => (
          <div key={index} className="rounded overflow-hidden shadow-xl hover:scale-90 transition-all">
            <img className="w-full" src={property.image} alt={property.title} />
            <div className="px-6 py-2">
              <div className="text-darkteal font-bold text-xl mb-2">{property.title}</div>
              <p className="text-gray-700 text-[14px]">{property.description}</p>
              <p className="text-seagreen text-sm mt-4">{property.price}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <Link
                to={`/property/${property.id}`}
                className="inline-block bg-steelblue hover:bg-steelteal text-white font-bold py-2 px-4 rounded"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProperties;
