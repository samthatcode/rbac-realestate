import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { PieChart, Pie, Cell } from "recharts";
import { Footer } from "../components";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();
        setTotalProducts(productsData.count);

        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        setTotalUsers(usersData.count);

        const salesResponse = await fetch("/api/sales/total");
        const salesData = await salesResponse.json();
        setTotalSales(salesData.total);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <div className="grid grid-cols-12">
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <nav className="w-64 bg-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Admin Menu</h2>
            <button onClick={() => setIsDrawerOpen(false)}>
              <span className="text-4xl">&times;</span>
            </button>
            <Link
              to="/manageproducts"
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Products
            </Link>
            <Link
              to="/manageusers"
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Users
            </Link>
            <Link
              to="/manageroles"
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Roles
            </Link>
            <Link
              to="/managecategories"
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Categories
            </Link>
            <div className="relative block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium cursor-pointer">
              <button
                onClick={toggleDropdown}
                className=""
              >
                Manage Events
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 bg-gray-200 p-2 rounded shadow">
                  <Link
                    to="/create-event"
                    className="block px-2 py-1 text-blue-600 hover:text-blue-800"
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/eventdetails"
                    className="block px-2 py-1 text-blue-600 hover:text-blue-800"
                  >
                    Event Details
                  </Link>
                  <Link
                    to="/eventlist"
                    className="block px-2 py-1 text-blue-600 hover:text-blue-800"
                  >
                    Event List
                  </Link>
                  {/* Add more sub-links as needed */}
                </div>
              )}
            </div>
            {/* Add more links as needed */}
          </nav>
        </Drawer>
        <header className="col-span-12 p-4 bg-blue-500 text-white">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button onClick={() => setIsDrawerOpen(true)}>
            <span className="text-4xl">&#9776;</span>
          </button>
        </header>
        <main className="col-span-12 lg:col-span-9 p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
          {/* Dashboard content goes here */}
          {error ? (
            <div className="p-4 bg-red-500 text-white rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white shadow rounded">
                <h2 className="font-bold text-lg mb-2">Total Products</h2>
                <p>{totalProducts}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h2 className="font-bold text-lg mb-2">Total Users</h2>
                <p>{totalUsers}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h2 className="font-bold text-lg mb-2">Total Sales</h2>
                <p>${totalSales}</p>
              </div>
            </div>
          )}
          <div className="mt-8">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
