import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { baseUrl } from "../../constants/APIs";

function UserDetails({ onEditProfile, onAddCatch }) {
  const { user } = useAuth();
  const [users, setUser] = useState({});

  const getUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                <div className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </span>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-lg">
                {users?.firstName} {users?.lastName}
              </p>
              <p className="text-gray-500 hidden sm:block">{users?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            {users?.email && (
              <p className="text-gray-600 block sm:hidden">
                Email:{" "}
                {users?.email}
              </p>
            )}
            {users?.dateOfBirth && (
              <p className="text-gray-600">
                Date of Birth:{" "}
                {new Date(users.dateOfBirth).toLocaleDateString("en-GB").replace(/\//g, "-")}
              </p>
            )}
            {users?.mobileNumber && (
              <p className="text-gray-600">
                Mobile Number: {users?.mobileNumber}
              </p>
            )}
            {users?.complexName && (
              <p className="text-gray-600">
                Complex Name: {users?.complexName}
              </p>
            )}
            {users?.userType && (
              <p className="text-gray-600">Users Type: {users?.userType}</p>
            )}
            <p className="text-gray-600">
              Total Catches: {users?.catches?.length || 0}
            </p>
            <p className="text-gray-600">
              Following Lakes: {users?.following?.length || 0}
            </p>
          </div>
        </div>
        <div className="flex flex-row md:flex-col space-y-0 space-x-4 md:space-x-0 md:space-y-4 mt-4 md:mt-0">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onEditProfile}
          >
            Edit Profile
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onAddCatch}
          >
            Add Catch
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
