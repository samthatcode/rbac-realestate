import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  AdminDashboard,
  CategoryPage,
  UserDashboard,
  MarketerDashboard,
  OrderPage,
  ProductPage,
  ProductDetailsPage,
  UsersPage,
} from "./pages";

import { Navbar, Login, Signup, Home, CartListPage } from "./components";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     navigate("/dashboard");
  //   } else {
  //     navigate("/signup");
  //   }
  // }, [user, navigate]);mongodb://localhost:27017/rbac-realestate

  return (
    <UserProvider>
      <CartProvider>
        <div>
          <ToastContainer />
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<CartListPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/marketer" element={<MarketerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/order" element={<CategoryPage />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
