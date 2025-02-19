import React, { useEffect, useState } from "react";
import UserDetails from "./UserDetails";
import EditProfileModal from "./EditProfileModal";
import AddCatch from "./ManageCatch/AddCatch";
import BrowseLakes from "./BrowseLakes";
import FollowedLakes from "./FollowedLakes";
import YourCatches from "./YourCatches";
import TopCatches from "./TopCatches";
import Loader from "../Loader";
import { XCircle } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function WaterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C12 2 4 10 4 16a8 8 0 1 0 16 0c0-6-8-14-8-14z"></path>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15 10 22 10 16 14 18 22 12 18 6 22 8 14 2 10 9 10"></polygon>
    </svg>
  );
}

function FishIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 10c4.5 0 6 2 6 2s-1.5 2-6 2c-2.7 0-5.2 1.3-7 3-1.8-1.7-4.3-3-7-3-4.5 0-6-2-6-2s1.5-2 6-2c2.7 0 5.2-1.3 7-3 1.8 1.7 4.3 3 7 3z"></path>
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8M12 17v4m5-4h1a4 4 0 0 0 4-4V5H3v8a4 4 0 0 0 4 4h1"></path>
    </svg>
  );
}

function AnglerDashboard() {
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCatchOpen, setIsAddCatchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "yourCatches"
  );
  const [visible, setVisible] = useState(true);

  const [lakes, setLakes] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  // const [msg, setMsg] = useState(null);
  // const [index, setIndex] = useState(0);
  const [refresshUser, setRefresshUser] = useState(false);
  const [refreshCatches, setRefreshCatches] = useState(false);
  const [refreshFollowedLakes, setRefreshFollowedLakes] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "browseLakes":
        return <BrowseLakes setRefreshFollowedLakes={setRefreshFollowedLakes} setActiveTab={setActiveTab} />;
      case "followedLakes":
        return <FollowedLakes setRefreshFollowedLakes={setRefreshFollowedLakes} />;
      case "yourCatches":
        return <YourCatches setRefreshCatches={setRefreshCatches} />;
      case "topCatches":
        return <TopCatches />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchRecentLakes = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/lakes/recent?userId=${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLakes(response.data);
      } catch (error) {
        console.error("Error fetching recent lakes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLakes();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleViewNewLakes = () => {
    navigate("/new-lakes");
  };

  const tabs = [
    { id: "yourCatches", label: "Your Catches", icon: <FishIcon /> },
    { id: "browseLakes", label: "Browse Lakes", icon: <WaterIcon /> },
    { id: "followedLakes", label: "Followed Lakes", icon: <StarIcon /> },
    { id: "topCatches", label: "Users Favourites ", icon: <TrophyIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-full mx-auto md:mx-[5vw]">
          {visible && lakes.length > 0 && (
            <div className="py-6">
              <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-100 text-blue-700 rounded-lg shadow-md">
                <span className="font-medium">
                  {`${lakes.length} new lakes have been added since your last visit. Click `}
                  <span
                    onClick={handleViewNewLakes}
                    className="text-purple-600 font-semibold underline hover:text-purple-800 cursor-pointer transition"
                  >
                    View New Lakes
                  </span>

                  {` to explore.`}
                </span>
                <button
                  onClick={() => setVisible(false)}
                  className="text-lg text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Angler Dashboard
          </h1>

          <div className="mb-8">
            <UserDetails
              onEditProfile={() => setIsEditProfileOpen(true)}
              onAddCatch={() => setIsAddCatchOpen(true)}
              setActiveTab={() => setActiveTab("followedLakes")}
              refresshUser={refresshUser}
              refreshCatches={refreshCatches}
              refreshFollowedLakes={refreshFollowedLakes}
            />
          </div>

          <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex justify-around sm:justify-center gap-4 sm:gap-8 mb-4 border-b border-gray-300 pb-2 w-full overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex flex-col sm:flex-row items-center sm:gap-2 px-4 py-2 rounded-lg transition duration-300
              ${activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>

          {/* <div className="space-y-6">
            <div className="flex space-x-2 sm:space-x-4 mb-4">
              <button
                className={`px-2 sm:px-4 sm:py-2 text-sm mb-0.5 rounded ${activeTab === "browseLakes"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => setActiveTab("browseLakes")}
              >
                Browse Lakes
              </button>
              <button
                className={`px-2 sm:px-4 sm:py-2 text-sm mb-0.5 rounded ${activeTab === "followedLakes"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => setActiveTab("followedLakes")}
              >
                Followed Lakes
              </button>
              <button
                className={`px-2 sm:px-4 sm:py-2 text-sm mb-0.5 rounded ${activeTab === "yourCatches"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => setActiveTab("yourCatches")}
              >
                Your Catches
              </button>
              <button
                className={`px-2 sm:px-4 sm:py-2 text-sm mb-0.5 rounded ${activeTab === "topCatches"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => setActiveTab("topCatches")}
              >
                Top Catches
              </button>
            </div>
            {renderTabContent()}
          </div> */}

          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            setLoading={setLoading}
            setRefresshUser={setRefresshUser}
          />
          <AddCatch
            isOpen={isAddCatchOpen}
            onClose={() => setIsAddCatchOpen(false)}
            setLoading={setLoading}
            onCatchAdded={() => {
              // Refresh the catches list or perform any other necessary actions
            }}
            fetchFollowedLakes={() => {
              // Refresh the followed lakes list or perform any other necessary actions
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AnglerDashboard;
