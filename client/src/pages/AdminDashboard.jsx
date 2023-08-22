import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useMatch } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { PieChart, Pie, Cell } from "recharts";
import {
  CategoryManagement,
  CreateEventForm,
  EventDetails,
  EventList,
  Footer,
  ProductManagement,
  RoleManagement,
  UserManagement,
} from "../components";
import StyledTable from "./StyledTable";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [error, setError] = useState("");
  const [inactiveMarketers, setInactiveMarketers] = useState([]);

  let match = useMatch("/admin/dashboard");
  let path, url;

  if (match) {
    ({ path, url } = match);
  }

  const data = [
    { name: "Total Products", value: totalProductsCount },
    { name: "Total Users", value: totalUsersCount },
  ];

  useEffect(() => {
    // const fetchSales = async () => {
    //   try {
    //     const salesResponse = await fetch("/api/sales/total");
    //     const salesData = await salesResponse.json();
    //     setTotalSales(salesData.total);
    //   } catch (error) {
    //     console.error("Error fetching sales:", error);
    //     setError("Failed to fetch sales. Please try again later.");
    //   }
    // };

    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();
        console.log("productsData", productsData);
        setTotalProductsCount(productsData.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        console.log("usersData", usersData);
        setTotalUsersCount(usersData.data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    const fetchInactiveMarketers = async () => {
      try {
        const response = await fetch("/api/marketers");
        // console.log("Response status:", response.status);
        const data = await response.json();
        // console.log(data);

        // Filter inactive marketers
        const inactiveMarketers = data.data.filter(
          (marketer) => marketer.isActive === false
        );
        // console.log("Inactive marketers:", inactiveMarketers);
        setInactiveMarketers(inactiveMarketers);
      } catch (error) {
        console.error("Error fetching inactive marketers:", error);
        setError("Failed to fetch inactive marketers. Please try again later.");
      }
    };

    fetchProducts();
    fetchUsers();
    fetchInactiveMarketers();
    // fetchSales();
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const approveMarketer = async (marketerId) => {
    try {
      const response = await fetch(`/api/marketers/${marketerId}/approve`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setInactiveMarketers(
          inactiveMarketers.filter((marketer) => marketer._id !== marketerId)
        );
      }
    } catch (error) {
      console.error("Error approving marketer:", error);
      setError("Failed to approve marketer. Please try again later.");
    }
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
              to={`${url}/manageproducts`}
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Products
            </Link>
            <Link
              to={`${url}/manageusers`}
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Users
            </Link>
            <Link
              to={`${url}/manageroles`}
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Roles
            </Link>
            <Link
              to={`${url}/managecategories`}
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Manage Categories
            </Link>
            <div className="relative block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium cursor-pointer">
              <button onClick={toggleDropdown} className="">
                Manage Events
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 bg-gray-200 p-2 rounded shadow">
                  <Link
                    to={`${url}/create-event`}
                    className="block px-2 py-1 text-blue-600 hover:text-blue-800"
                  >
                    Create Event
                  </Link>
                  <Link
                    to={`${url}/eventdetails`}
                    className="block px-2 py-1 text-blue-600 hover:text-blue-800"
                  >
                    Event Details
                  </Link>
                  <Link
                    to={`${url}/eventdetails`}
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
        <header className="col-span-12 flex justify-between items-center p-4 bg-blue-500 text-white">
          <div className="flex items-center">
            <button onClick={() => setIsDrawerOpen(true)}>
              <span className="text-4xl">&#9776;</span>
            </button>
            <h1 className="ml-4 text-xl font-bold">Admin Dashboard</h1>
          </div>
        </header>
        <main className="col-span-12 lg:col-span-9 p-6 bg-slate-200 m-4 shadow-xl rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-steelteal">
            Welcome, Admin!
          </h1>
          {/* Dashboard content goes here. */}
          {error ? (
            <div className="p-4 bg-red-500 text-white rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white shadow rounded">
                <h2 className="font-bold text-lg mb-2 text-steelteal">
                  Total Products
                </h2>
                <p className="text-purple-500">{totalProductsCount}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h2 className="font-bold text-lg mb-2 text-steelteal">
                  Total Users
                </h2>
                <p className="text-purple-500">{totalUsersCount}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h2 className="font-bold text-lg mb-2 text-steelteal">
                  Total Sales
                </h2>
                <p>&#x20A6;{totalSales}</p>
              </div>
            </div>
          )}
          {/* Use Route for nested routing */}
          <Routes>
            <Route exact path={path} />
            <Route
              path={`${path}/manageproducts`}
              element={<ProductManagement />}
            />
            <Route path={`${path}/manageusers`} element={<UserManagement />} />
            <Route path={`${path}/manageroles`} element={<RoleManagement />} />
            <Route
              path={`${path}/managecategories`}
              element={<CategoryManagement />}
            />
            <Route
              path={`${path}/create-event`}
              element={<CreateEventForm />}
            />
            <Route path={`${path}/eventdetails`} element={<EventDetails />} />
            <Route path={`${path}/`} element={<EventList />} />
          </Routes>

          <div className=" shadow rounded">
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`${(percent * 100).toFixed(2)}%`}
                    </text>
                  );
                }}
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
          <StyledTable
            data={inactiveMarketers}
            approveMarketer={approveMarketer}
          />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
