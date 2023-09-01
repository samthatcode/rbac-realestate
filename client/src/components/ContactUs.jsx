import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {
  AiFillTwitterCircle,
  AiFillFacebook,
  AiFillInstagram,
} from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/contact",
        // "/api/contact",
        formData
      );
      response.data;
      console.log("Form submitted successfully!", response.data);

      // Show a success toast message
      toast.success("Form submitted successfully!", {
        autoClose: 2000, // Close after 2 seconds
      });

      // Clear the form by resetting the formData state
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission failed:", error);
      toast.error("Form submission failed. Please try again.", {
        autoClose: 5000, // Close after 5 seconds in case of an error
      });
    }
  };

  return (
    <div className="bg-slate-100 shadow-xl mx-2 rounded-md p-4 my-20">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-xl font-bold text-center text-title capitalize">
          Contact Us
        </h2>
        <p className="text-center capitalize text-subTitle mb-10">
          Reach out to us! We provide full service at every step.
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-title">
              Our Offices
            </h2>
            <p>
              <FaMapMarkerAlt className="inline mr-2 text-red" />
              22, Olufunmilayo Street, Dideolu Estate, Second Gate B/Stop, Ogba
              Lagos.
            </p>
            <p>
              <FaEnvelope className="inline mr-2 text-orange-500" />
              contact@surefinders.com
            </p>
            <p>
              <FaPhone className="inline mr-2 text-green" />
              234 (90) 9767 7173
            </p>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-title">
              Social Media
            </h2>
            <a
              href="https://twitter.com/surefinders"
              className="text-blue block mb-2"
            >
              <AiFillTwitterCircle className="inline mr-2" />
              Twitter
            </a>
            <a
              href="https://web.facebook.com/surefinders"
              className="text-primary block mb-2"
            >
              <AiFillFacebook className="inline mr-2" />
              Facebook
            </a>
            <a
              href="https://www.instagram.com/surefinders"
              className="text-pink-600"
            >
              <AiFillInstagram className="inline mr-2" />
              Instagram
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-4 text-title">Enquiries</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2 px-2">
                <label htmlFor="phone" className="block font-medium">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phone"
                  className="w-full px-3 py-2 border rounded"
                  required
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded"
                  required
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2 px-2">
                <label htmlFor="subject" className="block font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-3 py-2 border rounded"
                  required
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Your message"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-blue text-white px-7 py-2 rounded uppercase"
            >
              Send a Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
