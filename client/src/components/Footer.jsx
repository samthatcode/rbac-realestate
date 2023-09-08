import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-title text-white py-6 shadow-3xl px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Logo */}
          <div className="mb-4 md:mb-0">
            <img src="path/to/your/logo.png" alt="Logo" className="h-10" />
          </div>
          <div className="hidden md:flex items-baseline justify-center space-x-4">
            <Link
              to="/"
              className="hover:bg-gray-500 py-2 px-4 rounded-md text-white font-medium"
            >
              Home
            </Link>
            <div className="group inline-block">
              <a href="" smooth="true" className="font-medium">
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
                  href="#"
                >
                  Investment
                </a>
              </div>
            </div>
            <a
              href="#contact"
              onClick={() => handleScrollTo("contact")}
              smooth="true"
              className="hover:bg-gray-500 py-2 px-4 rounded-md text-white font-medium"
            >
              Contact
            </a>
          </div>
          {/* Copyright and Social Media Links */}
          <div className="text-sm text-center md:text-left mb-4 md:mb-0">
            <div className="flex flex-col justify-center md:justify-start gap-4 mt-2">
              <a
                href="https://twitter.com/surefinders"
                className="hover:text-blue block mb-2"
              >
                <AiFillTwitterCircle className="inline mr-2" />
                Twitter
              </a>
              <a
                href="https://web.facebook.com/surefinders"
                className="hover:text-blue block mb-2"
              >
                <AiFillFacebook className="inline mr-2" />
                Facebook
              </a>
              <a
                href="https://www.instagram.com/surefinders"
                className="hover:text-blue"
              >
                <AiFillInstagram className="inline mr-2" />
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter and Join Our Team Buttons */}
        <div className="mt-6 md:mt-8 text-center md:text-left">
          <p className="text-sm">
            Our Newsletter: Subscribe to our newsletter to get our news & deals
            delivered to you.
          </p>
          <div className="mt-4 flex justify-center md:justify-start">
            <button className="bg-primary hover:bg-blue text-white font-semibold py-2 px-4 rounded mr-4">
              Subscribe
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded">
              Join our Team
            </button>
          </div>
        </div>
        <div className="flex justify-end items-center"> © 2023 Surefinders All rights reserved.</div>
      </footer>
    </>
  );
};

export default Footer;
