import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        // "/api/categories"
        "https://surefinders-backend.onrender.com/api/categories"
      );
      setCategories(response.data.data);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    onSelect(categoryId);
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="container mx-auto px-8">
      <div className="title_head mb-4">
        <h2 className="md:text-2xl text-lg font-bold text-center text-subTitle capitalize">
          Categories
        </h2>
      </div>
      <ul className="bg-white p-2 rounded-md space-x-4 flex justify-center items-center">
        {categories.map((category) => (
          <li
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`cursor-pointer capitalize p-2 rounded-md flex items-center ${
              selectedCategoryId === category._id
                ? "bg-green text-white"
                : "bg-blue text-white hover:bg-primary"
            }`}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
