import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { baseUrl } from "../../constants/APIs";

function UserDetails({ onEditProfile, onAddCatch }) {
  const { user } = useAuth();
  const [users, setUser] = useState({});
  const [anglers, setAnglers] = useState([]);

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

  useEffect(() => {
    const fetchAnglers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const anglersData = response.data
          .filter((user) => user.userType === "angler")
          .sort((a, b) => b.catches.length - a.catches.length)
          .map((angler, index) => ({ ...angler, rank: index + 1 }))
          .filter((angler) => angler._id === user._id);
        console.log("anglersData", anglersData);
        setAnglers(anglersData);
      } catch (error) {
        console.error("Error fetching anglers:", error);
      }
    };

    fetchAnglers();
  }, []);

  return (
    <>
      {/* <div className="bg-white rounded-lg shadow-2xl p-6">
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
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* User Profile Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <p className="font-semibold text-xl">{users?.firstName} {users?.lastName}</p>
            <p className="text-gray-200">{users?.email}</p>
            <button
              className="mt-4 px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition"
              onClick={onEditProfile}
            >
              Edit Profile
            </button>
          </div>
          <div className="rounded-full bg-white bg-opacity-20 w-16 h-16 flex items-center justify-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>


        {/* Total Catches */}
        <div className="flex flex-col bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Total Catches</p>
              <p className="text-3xl font-bold">{users?.catches?.length || 0}</p>
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
                onClick={onAddCatch}
              >
                Add Catch
              </button>
            </div>
            <div className="bg-white bg-opacity-25 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7zM4 12h16M9 9l3 3m0 0l3-3m-3 3V6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Followed Lakes */}
        <div className="flex flex-col bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Followed Lakes</p>
              <p className="text-3xl font-bold">{users?.following?.length || 0}</p>
            </div>
            <div className="bg-white bg-opacity-25 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16s3-3 7-3 7 3 7 3M3 12s3-3 7-3 7 3 7 3M3 8s3-3 7-3 7 3 7 3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Angler Rank */}
        <div className="flex flex-col bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Your Rank</p>
              <p className="text-3xl font-bold">{anglers?.[0]?.rank || "N/A"}</p>
            </div>
            <div className="bg-white bg-opacity-25 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}

export default UserDetails;
