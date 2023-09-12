import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEnvironment } from "react-icons/ai";
import { FaBath, FaBed, FaDoorOpen, FaRuler, FaSpinner } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSearch } from "../contexts/SearchContext";
import { FaHeart } from "react-icons/fa";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { CartContext } from "../contexts/CartContext";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { savedProperties, toggleSavedProperty, setShowSavedProducts } =
    useSavedProperties();

  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          "https://surefinders-backend.onrender.com/api/products",
          // "/api/products",
          {
            withCredentials: true,
          }
        );

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

  const handleHeartClick = (product) => {product
    const isCurrentlySaved = savedProperties.includes(product._id);
    toggleSavedProperty(product._id);  
    if (!isCurrentlySaved) {
      toast.success("Saved", { position: "top-right", autoClose: 500 });
    } else {
      toast.info("Unsaved", { position: "top-right", autoClose: 500 });
    }
  };
  

  const handleAddToCart = async (product) => {
    setLoading(true);
    await addToCart(product, "product");
    toast("Product added to cart", {
      position: "top-right",
      autoClose: 500,
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-20 px-8" id="homes">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Recent Property Listings
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
            <div className="flex items-center justify-center h-screen">
              <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="slick-slide">
              <div
                className="relative rounded overflow-hidden hover:shadow-xl transition-all hover-card cursor-pointer"
                onClick={() => {
                  // Check if the click target is not the heart icon
                  if (!event.target.classList.contains("heart-icon")) {
                    navigate(`/products/${product._id}`); // Navigate to the details page
                  }
                }}
              >
                <div className="image-container">
                  {product.images.length > 0 && (
                    <img
                      src={`https://surefinders-backend.onrender.com/public/images/${product.images[0]}`}
                      // src={`http://localhost:5175/public/images/${product.images[0]}`}
                      alt={product.title}
                      className="w-full max-h-60 object-cover image"
                    />
                  )}
                </div>
                <span
                  className={`absolute top-2 right-2 text-sm font-medium capitalize p-1 py-1 px-2 last:mr-0 mr-1 cursor-pointer ${
                    savedProperties.includes(product._id)
                      ? "text-red"
                      : "text-gray-200"
                  } heart-icon`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent onClick from firing
                    handleHeartClick(product);
                    setShowSavedProducts(true);
                  }}
                >
                  <FaHeart size={20} />
                </span>

                <div className="p-4 block border hover-card-content">
                  <span className="text-sm font-medium capitalize text-indigo-500 bg-indigo-100 p-1 py-1 px-2 last:mr-0 mr-1 mb-2">
                    {product.title}
                  </span>
                  <p className="text-title text-lg capitalize break-words font-bold my-2">
                    {product.description.length > 15
                      ? `${product.description.substring(0, 15)}...`
                      : product.description}
                  </p>
                  <p className="text-[14px] text-slate-500 capitalize flex justify-start items-center mb-3">
                    <AiOutlineEnvironment className="text-primary font-semibold mr-1" />
                    {product.location}
                  </p>
                  <div className="flex">
                    <div className="flex flex-row gap-4 text-sm text-zinc-500 mr-4">
                      <div className="flex-col">
                        <p className="mb-2">Baths</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaBath />
                          </span>
                          <p>{product.numberOfBaths}</p>
                        </div>
                      </div>
                      <div className="flex-col">
                        <p className="mb-2">Beds</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaBed />
                          </span>
                          <p>{product.numberOfBeds}</p>
                        </div>
                      </div>
                      <div className="flex-col">
                        <p className="mb-2">Rooms</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaDoorOpen />
                          </span>
                          <p>{product.numberOfRooms}</p>
                        </div>
                      </div>
                      <div className="flex-col">
                        <p className="mb-2">Area</p>
                        <div className="flex justify-center items-center">
                          <span className="mr-1 text-primary font-semibold">
                            <FaRuler />
                          </span>
                          <p>{product.squareFootage} Sq Ft</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-red font-bold border-t mt-2">
                      &#x20A6;{product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className={
                  `w-full px-4 py-2 mt-4 mb-4 text-white bg-primary rounded-md hover:bg-blue font-medium ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }` // Disable button and show loading state
                }
                disabled={loading} // Disable button
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-lg text-gray-600 mt-4">
            No lands match your search.
          </div>
        )}
      </Slider>
    </div>
  );
};

export default ProductPage;
