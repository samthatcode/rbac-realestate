import React, { useContext } from "react";
import { UserContext } from "../UserContext";

const UserDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="p-6 bg-slate-200">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <p className="text-lg mb-4 capitalize">Welcome, {user && `${user.firstName} ${user.lastName}`}!</p>
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
      </div>
    </div>
  );
};

export default UserDashboard;
