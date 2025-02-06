import React, { useState } from "react";
import { PlusCircle, User, Map, LogOut, Menu } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LakeOwnerDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed z-20 bottom-4 right-4 p-2 rounded-md bg-[#ae7a31] text-white"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static z-10 w-16 lg:w-64 bg-[#ae7a31] text-white transition-transform duration-300 ease-in-out h-screen`}
      >
        <div className="p-5 hidden lg:block">
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
            <User className="h-5 w-5 lg:mr-3" />
            <span className="hidden lg:inline">Profile</span>
          </Link>
          <Link
            to="manage-lakes"
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              currentPath === "manage-lakes"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
          >
            <Map className="h-5 w-5 lg:mr-3" />
            <span className="hidden lg:inline">Manage Lakes</span>
          </Link>
          <Link
            to="create-lake"
            className={`flex items-center py-3 px-5 transition-colors duration-200 w-full text-left ${
              currentPath === "create-lake"
                ? "bg-[#8e6429] text-white"
                : "text-gray-300 hover:bg-[#8e6429] hover:text-white"
            }`}
          >
            <PlusCircle className="h-5 w-5 lg:mr-3" />
            <span className="hidden lg:inline">Create Lake</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-5">
          <button
            onClick={logout}
            className="flex items-center justify-center lg:justify-start text-gray-300 hover:text-white transition-colors duration-200 w-full"
          >
            <LogOut className="h-5 w-5 lg:mr-3" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow pl-20 lg:pl-4">
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
