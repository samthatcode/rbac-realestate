import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductPage from "./ProductPage";
import LandPage from "./LandPage";
import { Events, SavedLandItems, SavedProductItems } from "../components";

const UserDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  const handleChangePassword = () => {
    navigate("/reset/:resetToken");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/logout",
        // "/api/logout",
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
    <div className="">
      <header className="col-span-12 flex justify-between items-center p-4 bg-primary text-white w-full top-0 fixed z-10 shadow-xl ">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {user && (
          <>
            <span className="text-indigo-500 bg-indigo-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
              {user.email}
            </span>
            <div className="flex justify-start items-center gap-4">
              {/* <button
                onClick={handleUpdateProfile}
                className="inline-block font-medium bg-white hover:text-blue text-primary py-2 px-4 rounded-md"
              >
                Update Profile
              </button> */}
              <button
                onClick={handleChangePassword}
                className="inline-block font-medium bg-white hover:text-blue text-primary py-2 px-4 rounded-md"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="inline-block font-medium bg-white hover:text-blue text-primary py-2 px-4 rounded-md"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </header>

      <div className=" p-4 bg-white rounded shadow mt-20">
        <p className="mb-4 capitalize">
          Welcome,{" "}
          <span className="text-indigo-500 bg-indigo-100 rounded-lg p-1 text-lg font-semibold py-1 px-2 last:mr-0 mr-1">
            {user && `${user.firstName} ${user.lastName}`}!
          </span>
        </p>
        <h2 className="text-2xl text-center bg-blue hover:bg-primary p-5 text-white font-bold mb-2">
          Wishlists
        </h2>

        <SavedProductItems />

        <SavedLandItems />
      </div>

      <div className="mt-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Account Settings</h2>
        {/* Provide options to update profile, change password, or log out */}
        {user && (
          <>
            <span className="text-indigo-500 bg-indigo-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
              {user.email}
            </span>
            <div className="flex justify-start items-center gap-4  my-4">
              {/* <button
                onClick={handleUpdateProfile}
                className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md"
              >
                Update Profile
              </button> */}
              <button
                onClick={handleChangePassword}
                className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="inline-block font-medium bg-primary hover:bg-blue text-white py-2 px-4 rounded-md"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
      {user && (
        <>
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h2 className="text-2xl text-center bg-blue hover:bg-primary p-5 text-white font-bold mb-2">
              Your Listings
            </h2>
            <ProductPage />
            <LandPage />
          </div>

          <Events />
        </>
      )}
    </div>
  );
};

export default UserDashboard;
