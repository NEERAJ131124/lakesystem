import React from "react";
import { useAuth } from "../contexts/AuthContext";

function UserDetails({ onEditProfile, onAddCatch }) {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="bg-white rounded-lg shadow-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            {user.dateOfBirth && (
              <p className="text-gray-600">
                Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}
              </p>
            )}
            {user.mobileNumber && (
              <p className="text-gray-600">
                Mobile Number: {user.mobileNumber}
              </p>
            )}
            {user.complexName && (
              <p className="text-gray-600">Complex Name: {user.complexName}</p>
            )}
            {user.userType && (
              <p className="text-gray-600">User Type: {user.userType}</p>
            )}
            <p className="text-gray-600">
              Total Catches: {user.catches?.length || 0}
            </p>
            <p className="text-gray-600">
              Following Lakes: {user.following?.length || 0}
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
