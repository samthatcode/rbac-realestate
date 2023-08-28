import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4 md:px-10">
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
                href="#"
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
                href="#"
              >
                Land
              </a>
              <a
                className="block text-white hover:bg-gray-600 p-2 rounded-md"
                href="#"
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
            href=""
            smooth="true"
            className="hover:bg-gray-500 py-2 px-4 rounded-md text-white font-medium"
          >
            Contact
          </a>
        </div>
        {/* Copyright and Social Media Links */}
        <div className="text-sm text-center md:text-left mb-4 md:mb-0">
          © 2023 Surefinders All rights reserved.
          <div className="flex justify-center md:justify-start mt-2">
            {/* Replace the "#" with your actual social media links */}
            <a href="#" className="mr-2">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="mr-2">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="mr-2">
              <i className="fab fa-instagram"></i>
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
    </footer>
  );
};

export default Footer;
