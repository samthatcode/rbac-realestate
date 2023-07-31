import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    createdAt: new Date(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/products", product);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Product Name"
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Price"
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Description"
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Category ID"
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={product.hasStock}
          onChange={(e) =>
            setProduct({ ...product, hasStock: e.target.checked })
          }
        />
        <span>In Stock</span>
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;
