import React, { useState } from "react";
import UserDetails from "./UserDetails";
import EditProfileModal from "./EditProfileModal";
import AddCatch from "./ManageCatch/AddCatch";
import BrowseLakes from "./BrowseLakes";
import FollowedLakes from "./FollowedLakes";
import YourCatches from "./YourCatches";
import TopCatches from "./TopCatches";
import Loader from "../Loader";

function AnglerDashboard() {
  const [loading, setLoading] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCatchOpen, setIsAddCatchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("yourCatches");

  const renderTabContent = () => {
    switch (activeTab) {
      case "browseLakes":
        return <BrowseLakes />;
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-full mx-auto md:mx-[5vw]">
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
                className={`px-2 sm:px-4 sm:py-2 rounded ${
                  activeTab === "browseLakes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("browseLakes")}
              >
                Browse Lakes
              </button>
              <button
                className={`px-2 sm:px-4 sm:py-2 rounded ${
                  activeTab === "followedLakes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("followedLakes")}
              >
                Followed Lakes
              </button>
              <button
                className={`px-2 sm:px-4 sm:py-2 rounded ${
                  activeTab === "yourCatches"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("yourCatches")}
              >
                Your Catches
              </button>
              <button
                className={`px-2 sm:px-4 sm:py-2 rounded ${
                  activeTab === "topCatches"
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
