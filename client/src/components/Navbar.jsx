import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";

import { Link, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { FaRegBuilding } from "react-icons/fa";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/logout",
        // "/api/logout",
        {},
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      if (response.data.message === "Logged out successfully") {
        setUser(null);
        clearCart();
        navigate("/");
        // console.log("User Logged Out");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="bg-white text-dark top-0 fixed md:w-full w-full z-10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[90px]">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-dark hover:text-gray-700 font-bold text-lg flex items-center"
            >
              {/* <span className="text-primary mr-1 flex justify-center items-center z-10">
                <FaRegBuilding size={30} />
              </span> */}
              <span className="mr-1 flex justify-center items-center z-10">
                <img
                  src="https://pbs.twimg.com/profile_images/1604859709210624000/i2dzGLJS_400x400.jpg"
                  alt="Logo"
                  className="bg-inherit h-12"
                />
              </span>
              <span className="text-title" style={{ lineHeight: "1" }}>
                Sure
                <br />
                Finders
              </span>
            </Link>

            <Cart cartItems={cartItems} />
          </div>
          {/* Desktop View */}
          <div className="hidden md:flex items-baseline justify-center space-x-4 ">
            <Link
              to="/"
              className="hover:bg-gray-200 py-2 px-4 rounded-md text-slate-950 font-medium"
            >
              Home
            </Link>
            <div className="group inline-block">
              <a smooth="true" className="font-medium">
                Events
              </a>
              <div className="hidden group-hover:block absolute bg-gray-500 rounded-md">
                {/* Dropdown links for Events */}
                <a
                  className="block text-white hover:bg-gray-600 p-2 rounded-md"
                  href="#events"
                  onClick={() => handleScrollTo("events")}
                >
                  Upcoming
                </a>
              </div>
            </div>
            <div className="group inline-block">
              <a href="" smooth="true" className="font-medium">
                Shop
              </a>
              <div className="hidden group-hover:block absolute bg-gray-500 rounded-md">
                {/* Dropdown links for Shop */}
                <a
                  className="block text-white hover:bg-gray-600 p-2 rounded-md"
                  href="#lands"
                  onClick={() => handleScrollTo("lands")}
                >
                  Land
                </a>
                <a
                  className="block text-white hover:bg-gray-600 p-2 rounded-md"
                  href="#homes"
                  onClick={() => handleScrollTo("homes")}
                >
                  Homes
                </a>
                <a
                  className="block text-white hover:bg-gray-600 p-2 rounded-md"
                  href="#investments"
                  onClick={() => handleScrollTo("investments")}
                >
                  Investment
                </a>
              </div>
            </div>
            <a
              href="#contact"
              onClick={() => handleScrollTo("contact")}
              smooth="true"
              className="hover:bg-gray-200 py-2 px-4 rounded-md text-slate-950 font-medium"
            >
              Contact
            </a>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-black cursor-pointer focus:outline-none  focus:ring-inset"
              onClick={toggleMenu}
            >
              <span className="sr-only">Menu</span>
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:block">
            {user ? (
              <>
                <span className="pr-4">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md ml-4"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile view */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md  font-medium hover:bg-gray-200 text-slate-950"
          >
            Home
          </Link>
          <a
            onClick={() => setIsEventsOpen(!isEventsOpen)}
            smooth="true"
            className="block px-3 py-2 rounded-md  font-medium hover:bg-gray-200 text-slate-950"
          >
            Events
          </a>
          {isEventsOpen && (
            <div className="px-4 py-2 bg-gray-500 rounded-md">
              {/* Dropdown links for Events */}
              <a
                className="block text-white hover:bg-gray-600 p-2 rounded-md"
                href="#events"
                onClick={() => handleScrollTo("events")}
              >
                Upcoming
              </a>
            </div>
          )}
          <a
            onClick={() => setIsShopOpen(!isShopOpen)}
            smooth="true"
            className="block px-3 py-2 rounded-md  font-medium hover:bg-gray-200 text-slate-950"
          >
            Shop
          </a>
          {isShopOpen && (
            <div className="px-4 py-2 bg-gray-500 rounded-md">
              {/* Dropdown links for Shop */}
              <a
                className="block text-white hover:bg-gray-600 p-2 rounded-md"
                href="#lands"
                onClick={() => handleScrollTo("lands")}
              >
                Land
              </a>
              <a
                className="block text-white hover:bg-gray-600 p-2 rounded-md"
                href="#homes"
                onClick={() => handleScrollTo("homes")}
              >
                Homes
              </a>
              <a
                className="block text-white hover:bg-gray-600 p-2 rounded-md"
                href="#investments"
                onClick={() => handleScrollTo("investments")}
              >
                Investments
              </a>
            </div>
          )}
          <a
            href="#contact"
            onClick={() => handleScrollTo("contact")}
            smooth="true"
            className="block px-3 py-2 rounded-md  font-medium hover:bg-gray-200 text-slate-950"
          >
            Contact
          </a>
        </div>
        <div className="px-4 py-3 sm:px-6">
          {user ? (
            <>
              <span className="block px-3 py-2 rounded-md font-medium text-slate-950">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="block px-3 py-2 rounded-md font-medium bg-primary hover:bg-blue text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                className="block px-3 py-2 rounded-md font-medium bg-primary hover:bg-blue text-white mb-4 text-center"
                href="/login"
                target="_self"
              >
                Login
              </a>
              <a
                className="block px-3 py-2 rounded-md font-medium bg-primary hover:bg-blue text-white text-center"
                href="/signup"
                target="_self"
              >
                Create Account
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
