import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import products from "../data/ProductData";

const ProductPage = () => {
  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Product Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-2xl bg-slate-50">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="hover:scale-90 transition-all"
          >
            <ProductDetails product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
