import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductPage from "./ProductPage";

const UserDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        // "https://surefinders-backend.onrender.com/api/logout",
        "/api/logout",
        {},
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      if (response.data.message === "Logged out successfully") {
        setUser(null);
        navigate("/");
        // console.log("User Logged Out");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-slate-50">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4 capitalize">
        Welcome,
        {" "}
        <span className="text-orange-500 bg-orange-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
          {user && `${user.firstName} ${user.lastName}`}!
        </span>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Your Listings</h2>
          {/* Map over the user's property listings and display them here */}
        </div>
        <div className="col-span-1 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Saved Properties</h2>
          {/* Map over the user's saved properties and display them here */}
        </div>
      </div>
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        {/* Map over the user's messages and display them here */}
      </div>
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Account Settings</h2>
        {/* Provide options to update profile, change password, or log out */}
        {user && (
          <>
            <span className="pr-4">{user.email}</span>
            <button
              onClick={handleLogout}
              className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </>
        )}
      </div>
      <ProductPage />
    </div>
  );
};

export default UserDashboard;
