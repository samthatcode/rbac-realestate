import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineEnvironment } from "react-icons/ai";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const settings = {
  infinite: true,
  dots: true,
  arrows: true,
  cssEase: "ease-in-out",
  slidesToShow: 3,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("https://surefinders-backend.onrender.com/api/products", { withCredentials: true });
        // const response = await axios.get("/api/products", {
        //   withCredentials: true,
        // });
        // console.log(response.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // const handleAddToCart = async (product) => {
  //   setLoading(true);
  //   await addToCart(product);
  //   setLoading(false);
  // };

  return (
    <div className="container mx-auto py-20 px-8">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Recent Property
        </h2>
        <p class="text-center capitalize text-subTitle mb-10">
          We provide full service at every step.
        </p>
      </div>

      <Slider
        {...settings}
        className="centerPadding custom-slider"
        dots={true}
        autoplay={true}
        autoplaySpeed={2000}
      >
        {isLoading ? (
          <div className="overlay">
            <ColorRing
              visible={true}
              height="50"
              width="50"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#b8c480", "#B2A3B5", "#F4442E", "#51E5FF", "#429EA6"]}
            />
          </div>
        ) : Array.isArray(products) && products.length > 0 ? (
          // Check if products is an array and not empty
          products.map((product) => (
            <div key={product._id} className="slick-slide">
              <Link to={`/products/${product._id}`} className="transition-all">
                <div className="rounded overflow-hidden shadow-xl transition-all hover-card">
                  {product.images.length > 0 && (
                    <img
                      src={`https://surefinders-backend.onrender.com/public/images/${product.images[0]}`}
                      // src={`http://localhost:5175/public/images/${product.images[0]}`}
                      alt={product.title}
                      className="w-full capitalize object-cover"
                    />
                  )}
                  <div className="p-4 border-b">
                    <span className="text-sm font-medium capitalize text-orange-500 bg-orange-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                      {product.title}
                    </span>
                    <p className="text-gray-400 capitalize break-words font-bold mb-2">
                      {product.description}
                    </p>
                    <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-4">
                      <AiOutlineEnvironment className="text-gray-400 mr-1" />
                      {product.location}
                    </p>
                    <div className="flex">
                      <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                        <div className="flex-col">
                          <p>Baths</p>
                          <p>{product.numberOfRooms}</p>
                        </div>
                        <div className="flex-col">
                          <p>Beds</p>
                          <p>{product.amenities}</p>
                        </div>
                        <div className="flex-col">
                          <p>Rooms</p>
                          <p>{product.numberOfRooms}</p>
                        </div>
                        <div className="flex-col">
                          <p>Area</p>
                          <p>{product.squareFootage}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-teal font-bold border-t mt-2">
                      &#x20A6;{product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-2xl">
            Oops!!😞 No products available.
          </div> // Handle the case when products is not an array or empty
        )}
      </Slider>
    </div>
  );
};

export default ProductPage;
