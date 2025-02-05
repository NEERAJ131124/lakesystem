import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../components/contexts/AuthContext";
import { PlusCircle, User, Map, LogOut } from "lucide-react";
import CreateLake from "./CreateLake";
import ManageLakes from "./manageLakes";
import Profile from "./Profile";

function LakeOwnerDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const { user, logout } = useAuth();
  const [lakes, setLakes] = useState([]);

  const fetchLakes = useCallback(async () => {
    console.log("user", user);
    try {
      const response = await axios.get("http://localhost:5000/api/lakes", {
        params: { ownerId: user?.id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLakes(response.data);
    } catch (error) {
      console.error("Error fetching lakes:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLakes();
  }, [fetchLakes]);

  const handleDeleteLake = async (lakeId) => {
    if (window.confirm("Are you sure you want to delete this lake?")) {
      try {
        await axios.delete(`/api/lakes/${lakeId}`);
        fetchLakes();
      } catch (error) {
        console.error("Error deleting lake:", error);
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "createLake":
        return <CreateLake onLakeCreated={fetchLakes} />;
      case "profile":
        return <Profile user={user} />;
      case "manageLakes":
      default:
        return <ManageLakes lakes={lakes} onDeleteLake={handleDeleteLake} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#ae7a31] text-white">
        <div className="p-5">
          <h2 className="text-2xl font-semibold">CarpBook</h2>
          <p className="text-sm mt-1 text-gray-300">Lake Owner Dashboard</p>
        </div>
        <nav className="mt-8">
          <button
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              activeSection === "profile"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </button>
          <button
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              activeSection === "manageLakes"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
            onClick={() => setActiveSection("manageLakes")}
          >
            <Map className="mr-3 h-5 w-5" />
            Manage Lakes
          </button>
          <button
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              activeSection === "createLake"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
            onClick={() => setActiveSection("createLake")}
          >
            <PlusCircle className="mr-3 h-5 w-5" />
            Create Lake
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-5">
          <button
            onClick={logout}
            className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.firstName}!
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default LakeOwnerDashboard;
