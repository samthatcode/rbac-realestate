import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  AdminPage,
  CategoryPage,
  Dashboard,
  MarketerPage,
  OrderPage,
  ProductPage,
  UsersPage,
} from "./pages";

import { Navbar, Login, Signup, Home } from "./components";
import { UserProvider } from "./UserContext";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <UserProvider>
      <div>
        <ToastContainer />
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/marketer" element={<MarketerPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order" element={<CategoryPage />} />
          </Routes>
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
