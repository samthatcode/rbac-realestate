import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    price: "",
    rating: "",
    color: "",
    size: "",
    images: [],
  });

  const handleChange = (e) => {
    if (e.target.name === "image" || e.target.name === "images") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "imageUrl") {
      setFormData({
        ...formData,
        image: e.target.value,
      });
    } else if (e.target.name === "imagesUrl") {
      setFormData({
        ...formData,
        images: e.target.value.split(",").map((url) => url.trim()), // assuming URLs are comma-separated
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData object
      const formDataToSend = new FormData();
      // Append form data to the FormData object
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      // Make the API request to send the form data to the server
      const response = await axios.post(
        "/api/products",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        { withCredentials: true }
      );
      // console.log(response.data); // Optional: Log the response from the server
      // Reset the form
      setFormData({
        name: "",
        image: null,
        description: "",
        price: "",
        rating: "",
        color: "",
        size: "",
        images: [],
      });
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during the API request
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-slate-200 p-6 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
          Name:
        </label>
        <input
          placeholder="Product Name"
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block font-medium mb-1 text-gray-700">
          Image:
        </label>
        <input
          type="file"
          name="image"
          id="image"
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="imageUrl"
          className="block font-medium mb-1 text-gray-700"
        >
          Image URL:
        </label>
        <input
          placeholder="Add Image URL"
          type="text"
          name="imageUrl"
          id="imageUrl"
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block font-medium mb-1 text-gray-700"
        >
          Description:
        </label>
        <textarea
          placeholder="Product Description.."
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block font-medium mb-1 text-gray-700">
          Price:
        </label>
        <input
          placeholder="Product Price"
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="rating"
          className="block font-medium mb-1 text-gray-700"
        >
          Rating:
        </label>
        <input
          placeholder="Product ratings"
          type="number"
          name="rating"
          id="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="color" className="block font-medium mb-1 text-gray-700">
          Color:
        </label>
        <input
          placeholder="Product color"
          type="text"
          name="color"
          id="color"
          value={formData.color}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="size" className="block font-medium mb-1 text-gray-700">
          Size:
        </label>
        <input
          placeholder="Product size"
          type="text"
          name="size"
          id="size"
          value={formData.size}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="images"
          className="block font-medium mb-1 text-gray-700"
        >
          Images:
        </label>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="imagesUrl"
          className="block font-medium mb-1 text-gray-700"
        >
          Images URL:
        </label>
        <input
          placeholder="Add Images URL separated by commas"
          type="text"
          name="imagesUrl"
          id="imagesUrl"
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default ProductForm;
