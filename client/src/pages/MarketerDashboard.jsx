import React, { useContext, useEffect, useState } from "react";
import {
  Footer,
  ReferralStats,
  Referrals,
  RegistrationForm,
} from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { MarketerContext } from "../MarketerContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

const MarketerDashboard = () => {
  const { setMarketer } = useContext(MarketerContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ismarketer, setIsMarketer] = useState(null);
  const [copied, setCopied] = useState(false); // State to track if the link is copied
  const { marketerId } = useParams(); // Get the marketerId from the route parameter
  const navigate = useNavigate();
  const [referralId, setReferralId] = useState(null);

  useEffect(() => {
    const fetchMarketer = async () => {
      const response = await axios.get(`/api/marketers/${marketerId}`);
      const marketerData = response.data.data;

      // Get the current URL without the pathname
      const baseUrl = window.location.protocol + "//" + window.location.host;

      // Construct the full URL
      const fullUrl = `${baseUrl}/signup?referral=${marketerData.referralLink}`;

      // Update the referralLink in the marketer's data
      marketerData.referralLink = fullUrl;

      setIsMarketer(marketerData);
      setMarketer(marketerData); // Update the marketer in your context

      // Extract the referral ID from the referralLink
      const referralId = new URL(marketerData.referralLink).searchParams.get(
        "referral"
      );

      // Set the referralId in the state
      setReferralId(referralId);
    };
    fetchMarketer();
  }, [marketerId, setMarketer]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/api/marketers/logout",
        {},
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      if (response.data.message === "Logged out successfully") {
        setMarketer(null); // Assuming you have a setMarketer function to update the marketer state
        navigate("/marketer/login"); // Redirect to the homepage after logout
        console.log("Marketer Logged Out");
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
    <div className=" bg-slate-200">
      <div className="grid grid-cols-12">
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <nav className="w-64 bg-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">Marketer Menu</h2>
            <button onClick={() => setIsDrawerOpen(false)}>
              <span className="text-4xl">&times;</span>
            </button>
            <Link
              to="/registration"
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Registration Form
            </Link>
            {ismarketer && referralId && (
              <Link
                to={`/referrals/${referralId}`}
                className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
              >
                Referrals
              </Link>
            )}

            <Link
              to="/stats"
              className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors font-medium mb-4"
            >
              Referral Stats
            </Link>
          </nav>
        </Drawer>
        <header className="col-span-12 p-4 bg-blue-500 text-white">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">Marketer Dashboard</h1>
            <div>
              {ismarketer && (
                <>
                  <p className="text-sm text-white">
                    Click to Copy your Referral Link
                  </p>
                  <CopyToClipboard
                    text={ismarketer.referralLink}
                    onCopy={handleCopy}
                  >
                    <button className="font-medium py-2 px-4 rounded bg-white text-blue-500 hover:text-blue-400">
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </CopyToClipboard>
                </>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="font-medium px-4 rounded bg-white text-blue-500 hover:text-blue-400"
            >
              Logout
            </button>
          </div>

          <button onClick={() => setIsDrawerOpen(true)}>
            <span className="text-4xl">&#9776;</span>
          </button>
        </header>
      </div>
      {/* <RegistrationForm /> */}
      <Referrals />
      <ReferralStats />
      <Footer />
    </div>
  );
};

export default MarketerDashboard;
