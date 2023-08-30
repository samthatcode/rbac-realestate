import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineEnvironment } from "react-icons/ai";
import { FaBath, FaBed, FaDoorOpen, FaRuler } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const settings = {
  infinite: true,
  dots: true,
  arrows: true,
  cssEase: "ease-in-out",
  slidesToShow: 3,
  slidesToScroll: 1,
  
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
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
        slidesToShow: 1,
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
        // const response = await axios.get("https://surefinders-backend.onrender.com/api/products", { withCredentials: true });
        const response = await axios.get("/api/products", {
          withCredentials: true,
        });
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
        className=""
        dots={true}
        autoplay={true}
        autoplaySpeed={4000}
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
              colors={["#3454d1", "#007bff"]}
            />
          </div>
        ) : Array.isArray(products) && products.length > 0 ? (
          // Check if products is an array and not empty
          products.map((product) => (
            <div key={product._id} className="slick-slide">
              <Link to={`/products/${product._id}`} className="transition-all">
                <div className="rounded overflow-hidden hover:shadow-xl transition-all hover-card">
                  <div className="image-container">
                    {product.images.length > 0 && (
                      <img
                        // src={`https://surefinders-backend.onrender.com/public/images/${product.images[0]}`}
                        src={`http://localhost:5175/public/images/${product.images[0]}`}
                        alt={product.title}
                        className="w-full object-cover image"
                      />
                    )}
                  </div>

                  <div className="p-4 block border hover-card-content">
                    <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                      {product.title}
                    </span>
                    <p className="text-title text-lg capitalize break-words font-bold my-2">
                      {product.description}
                    </p>
                    <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-3">
                      <AiOutlineEnvironment className="text-gray-400 mr-1" />
                      {product.location}
                    </p>
                    <div className="flex">
                      <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                        <div className="flex-col">
                          <p className="mb-2">Baths</p>
                          <div className="flex justify-center items-center">
                            <span className="mr-1">
                              <FaBath />
                            </span>
                            <p>{product.numberOfBaths}</p>
                          </div>
                        </div>
                        <div className="flex-col">
                          <p className="mb-2">Beds</p>
                          <div className="flex justify-center items-center">
                            <span className="mr-1">
                              <FaBed />
                            </span>
                            <p>{product.numberOfBeds}</p>
                          </div>
                        </div>
                        <div className="flex-col">
                          <p className="mb-2">Rooms</p>
                          <div className="flex justify-center items-center">
                            <span className="mr-1">
                              <FaDoorOpen />
                            </span>
                            <p>{product.numberOfRooms}</p>
                          </div>
                        </div>
                        <div className="flex-col">
                          <p className="mb-2">Area</p>
                          <div className="flex justify-center items-center">
                            <span className="mr-1">
                              <FaRuler />
                            </span>
                            <p>{product.squareFootage} Sq Ft</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg text-title font-bold border-t mt-2">
                        &#x20A6;{product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : null}
      </Slider>
    </div>
  );
};

export default ProductPage;
