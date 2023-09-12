import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { PieChart, Pie, Cell } from "recharts";
import {
  CategoryManagement,
  EventManagement,
  Footer,
  InvestmentManagement,
  LandManagement,
  ProductManagement,
  RoleManagement,
  UserManagement,
} from "../components";
import StyledTable from "./StyledTable";
import axios from "axios";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [error, setError] = useState("");
  const [inactiveMarketers, setInactiveMarketers] = useState([]);
  const [currentView, setCurrentView] = useState("");

  const navigate = useNavigate();

  const data = [
    { name: "Total Products", value: totalProductsCount },
    { name: "Total Users", value: totalUsersCount },
  ];

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
        navigate("/login");
        // console.log("User Logged Out");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await fetch(
          "https://surefinders-backend.onrender.com/api/products",
          // "/api/products",
          { withCredentials: true }
        );
        const productsData = await productsResponse.json();
        // console.log("productsData", productsData);
        setTotalProductsCount(productsData.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch(
          "https://surefinders-backend.onrender.com/api/users",
          // "/api/users",
          { withCredentials: true }
        );
        const usersData = await usersResponse.json();
        // console.log("usersData", usersData);
        setTotalUsersCount(usersData.data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    const fetchInactiveMarketers = async () => {
      try {
        const response = await fetch(
          // "https://surefinders-backend.onrender.com/api/marketers",
          "/api/marketers",
          { withCredentials: true }
        );       
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
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const approveMarketer = async (marketerId) => {
    try {
      const response = await fetch(
        `https://surefinders-backend.onrender.com/api/marketers/${marketerId}/approve`,
        // `/api/marketers/${marketerId}/approve`,
        { withCredentials: true ,
          method: "POST",
        }
      );      

      // console.log("Response status:", response.status);
      const data = await response.json();
      // console.log(data);

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
          <nav className="w-64 p-4">
            <h2 className="text-lg font-semibold mb-4 text-title">Menu</h2>
            <button onClick={() => setIsDrawerOpen(false)}>
              <span className="text-4xl">&times;</span>
            </button>
            <Link
              to="/manageproducts"
              className={`block py-2 px-4 rounded bg-primary hover:bg-blue text-white transition-colors font-medium mb-4 active`}
              onClick={(event) => {
                event.preventDefault();
                setCurrentView("manageproducts");
              }}
            >
              Manage Products
            </Link>
            <Link
              to="/managelands"
              className={`block py-2 px-4 rounded bg-primary hover:bg-blue text-white transition-colors font-medium mb-4 active`}
              onClick={(event) => {
                event.preventDefault();
                setCurrentView("managelands");
              }}
            >
              Manage Lands
            </Link>

            <Link
              to="/manageusers"
              className={`block py-2 px-4 rounded bg-primary hover:bg-blue text-white transition-colors font-medium mb-4 active`}
              onClick={(event) => {
                event.preventDefault();
                setCurrentView("manageusers");
              }}
            >
              Manage Users
            </Link>
            <Link
              to="/manageinvestments"
              className={`block py-2 px-4 rounded bg-primary hover:bg-blue text-white transition-colors font-medium mb-4 active`}
              onClick={(event) => {
                event.preventDefault();
                setCurrentView("manageinvestments");
              }}
            >
              Manage Investments
            </Link>
            <Link
              to="/managecategories"
              className={`block py-2 px-4 rounded bg-primary hover:bg-blue text-white transition-colors font-medium mb-4 active`}
              onClick={(event) => {
                event.preventDefault();
                setCurrentView("managecategories");
              }}
            >
              Manage Categories
            </Link>
            <Link
              to="/manage_event"
              className={`block py-2 px-4 rounded bg-primary hover:bg-blue text-white transition-colors font-medium mb-4 active`}
              onClick={(event) => {
                event.preventDefault();
                setCurrentView("manage_event");
              }}
            >
              Manage Event
            </Link>

            {/* Add more links as needed */}
          </nav>
        </Drawer>
        <header className="col-span-12 flex justify-between items-center p-4 bg-primary text-white w-full top-0 fixed z-10 shadow-xl ">
          <div className="flex items-center">
            <button onClick={() => setIsDrawerOpen(true)}>
              <span className="text-4xl">&#9776;</span>
            </button>
            <h1 className="ml-4 text-xl font-bold">Dashboard</h1>
          </div>
          {user && (
            <>
              <span className="text-indigo-500 bg-indigo-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-block font-medium bg-white text-primary hover:text-blue py-2 px-4 rounded-md"
              >
                Logout
              </button>
            </>
          )}
        </header>
        <main className="col-span-12 lg:col-span-12 p-6 m-4 mt-20 shadow-xl rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-title">Welcome, Admin!</h1>
          {/* Dashboard content goes here */}
          {currentView === "manageproducts" && <ProductManagement />}
          {currentView === "managelands" && <LandManagement />}
          {currentView === "manageusers" && <UserManagement />}
          {currentView === "manageinvestments" && <InvestmentManagement />}
          {currentView === "managecategories" && <CategoryManagement />}
          {currentView === "manage_event" && <EventManagement />}

          {error ? (
            <div className="p-4 bg-red text-white rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20 cursor-pointer">
              <div className="p-4 bg-primary hover:bg-blue shadow rounded flex justify-between items-center">
                <h2 className="font-bold text-lg mb-2 text-white">
                  Total Products
                </h2>
                <p className="text-lg border px-5 py-4 rounded-md  text-slate-200">
                  {totalProductsCount}
                </p>
              </div>
              <div className="p-4 bg-primary hover:bg-blue shadow rounded flex justify-between items-center">
                <h2 className="font-bold text-lg mb-2 text-white">
                  Total Users
                </h2>
                <p className="text-lg border px-5 py-4 rounded-md  text-slate-200">
                  {totalUsersCount}
                </p>
              </div>
              <div className="shadow rounded flex justify-between items-center">
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
            </div>
          )}

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
