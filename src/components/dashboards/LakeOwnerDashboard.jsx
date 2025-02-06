import React from "react";
import { PlusCircle, User, Map, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LakeOwnerDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#ae7a31] text-white">
        <div className="p-5">
          <h2 className="text-2xl font-semibold">CarpBook</h2>
          <p className="text-sm mt-1 text-gray-300">Lake Owner Dashboard</p>
        </div>
        <nav className="mt-8">
          <Link
            to="profile"
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              currentPath === "profile"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
          <Link
            to="manage-lakes"
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              currentPath === "manage-lakes"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
          >
            <Map className="mr-3 h-5 w-5" />
            Manage Lakes
          </Link>
          <Link
            to="create-lake"
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              currentPath === "create-lake"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
          >
            <PlusCircle className="mr-3 h-5 w-5" />
            Create Lake
          </Link>
          {/* <Link
            aria-disabled="true"
            to="edit-lake"
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              currentPath === "edit-lake"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
          >
            <PlusCircle className="mr-3 h-5 w-5" />
            Edit Lake
          </Link> */}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LakeOwnerDashboard;
