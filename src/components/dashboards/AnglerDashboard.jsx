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

function AnglerDashboard() {
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCatchOpen, setIsAddCatchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("yourCatches");
  const [visible, setVisible] = useState(true);

  const [lakes, setLakes] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  // const [msg, setMsg] = useState(null);
  // const [index, setIndex] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case "browseLakes":
        return <BrowseLakes setActiveTab={setActiveTab} />;
      case "followedLakes":
        return <FollowedLakes />;
      case "yourCatches":
        return <YourCatches />;
      case "topCatches":
        return <TopCatches />;
      default:
        return null;
    }
  };


  useEffect(() => {
    const fetchRecentLakes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/lakes/recent?userId=${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLakes(response.data);
      } catch (error) {
        console.error("Error fetching recent lakes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLakes();
  }, []);

  const handleViewNewLakes = () => {
    navigate("/new-lakes"); // Change the route as per your project
  };

  // useEffect(() => {
  //   if (lakes.length > 0) {
  //     setMsg(`${lakes.length} new lakes have been added since your last visit. Click 'View New Lakes' to explore.`);
  //     if (visible === false) {
  //       setVisible(true);
  //     }
  //     setMsg(`Recently added lake since your last login: ${lakes[index].name} (added on ${new Date(lakes[index].createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')} at ${lakes[index].location}).`);
  //     const interval = setInterval(() => {
  //       setIndex((prevIndex) => (prevIndex + 1) % lakes.length);
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   }
  // }, [index, lakes]);


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
            />
          </div>

          <div className="space-y-6">
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
          </div>

          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            setLoading={setLoading}
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
