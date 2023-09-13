import React, { useContext, useEffect, useState } from "react";
import {
  Footer,
  MarketerProfile,
  Referrals,
  RegistrationForm,
} from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { MarketerContext } from "../contexts/MarketerContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaChevronDown } from "react-icons/fa";

const MarketerDashboard = () => {
  const { marketer, setMarketer } = useContext(MarketerContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ismarketer, setIsMarketer] = useState(null);
  const [copied, setCopied] = useState(false); // State to track if the link is copied
  const { marketerId } = useParams(); // Get the marketerId from the route parameter
  const navigate = useNavigate();
  const [referralId, setReferralId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  // State to control the modal visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileModalOpen = () => {
    setIsProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };

  useEffect(() => {
    const fetchMarketer = async () => {
      const response = await axios.get(
        // `/api/marketers/${marketerId}`,
        `https://surefinders-backend.onrender.com/api/marketers/${marketerId}`,
        {
          withCredentials: true,
        }
      );
      const marketerData = response.data.data;

      // Get the current URL without the pathname
      const baseUrl = window.location.protocol + "//" + window.location.host;

      // Construct the full URL
      const fullUrl = `${baseUrl}/signup?referral=${marketerData.referralLink}`;

      // Update the referralLink in the marketer's data
      marketerData.referralLink = fullUrl;

      setIsMarketer({
        ...marketerData,
        isActive: marketerData.isActive,
      });

      setMarketer(marketerData); // Update the marketer in your context

      // Extract the referral ID from the referralLink
      const referralId = new URL(marketerData.referralLink).searchParams.get(
        "referral"
      );

      // Set the referralId in the state
      setReferralId(referralId);
    };
    fetchMarketer();

    // Fetch marketer's data every 5 minutes
    const intervalId = setInterval(fetchMarketer, 5 * 60 * 1000); // 5 * 60 * 1000 ms = 5 minutes

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [marketerId, setMarketer]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/marketers/logout",
        // "/api/marketers/logout",
        { withCredentials: true }
      );
      if (response.data.message === "Logged out successfully") {
        setMarketer(null); // Assuming you have a setMarketer function to update the marketer state
        navigate("/marketer/login"); // Redirect to the homepage after logout
        // console.log("Marketer Logged Out");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    // Reset the "copied" state after a certain time (e.g., 3 seconds)
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className=" bg-slate-50">
      <div className="grid grid-cols-12">
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <nav className="w-64 p-4">
            <h2 className="text-lg font-semibold mb-4">Marketer Menu</h2>
            <button onClick={() => setIsDrawerOpen(false)}>
              <span className="text-4xl">&times;</span>
            </button>
            {/* Links */}
          </nav>
        </Drawer>

        <header className="col-span-12 flex justify-between items-center p-4 bg-primary text-white">
          <div className="flex items-center">
            <button onClick={() => setIsDrawerOpen(true)} className="text-4xl">
              &#9776;
            </button>
            <h1 className="ml-4 text-xl font-bold">Marketer Dashboard</h1>
          </div>
          <div className="flex justify-between items-center relative gap-3">
            {ismarketer && !ismarketer.isActive && (
              <p className="flex text-orange-500 bg-orange-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
                Inactive
              </p>
            )}
            {ismarketer && ismarketer.isActive && (
              <p className="flex text-cyan-500 bg-cyan-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
                Active
              </p>
            )}
            <p className="capitalize ">
              Welcome{" "}
              <span className="capitalize text-indigo-500 bg-indigo-100 rounded-lg p-1 text-xs font-semibold py-1 px-2 last:mr-0 mr-1">
                {marketer.firstName}
              </span>
            </p>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="font-medium py-2 px-4 rounded bg-white text-blue-500 hover:text-blue-400 flex justify-between items-center gap-4"
            >
              <img
                src={marketer.profilePicture}
                alt=""
                className="inline-block w-5 h-5 rounded-full"
              />
              <FaChevronDown className="text-[#1A1619] h-4 w-4" />
            </button>
            {showOptions && (
              <div className="absolute right-0 left-7 top-14 mt-2 py-2slate-100 p-3 rounded shadow-lg flex flex-col bg-white gap-2">
                {ismarketer && (
                  <>
                    <CopyToClipboard
                      text={ismarketer.referralLink}
                      onCopy={handleCopy}
                    >
                      <button className="font-medium py-2 px-4 rounded bg-primary hover:bg-blue  text-white">
                        {copied ? "Copied!" : "Copy Referral Link"}
                      </button>
                    </CopyToClipboard>
                  </>
                )}
                <button
                  className="font-medium py-2 px-4 rounded bg-primary hover:bg-blue  text-white"
                  onClick={handleProfileModalOpen}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="font-medium px-4 py-2 rounded bg-primary hover:bg-blue  text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
      </div>
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl relative">
            <button
              onClick={handleProfileModalClose}
              className="absolute top-0 right-0 m-3 text-white px-2 py-1 rounded p-2 bg-primary hover:bg-blue text-xl"
            >
              &#x2715;
            </button>
            <div className="">
              <MarketerProfile />
            </div>
          </div>
        </div>
      )}
      {/* <RegistrationForm /> */}
      {referralId && <Referrals referralId={referralId} />}
      <Footer />
    </div>
  );
};

export default MarketerDashboard;
