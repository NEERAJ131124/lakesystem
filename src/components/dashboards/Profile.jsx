import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Edit } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";

function UserProfile({ user }) {
  const {
    complexName,
    createdAt,
    email,
    firstName,
    lastName,
    mobileNumber,
    updatedAt,
    userType,
  } = user;
  console.log("User Profile Props:", user);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName,
    lastName,
    email,
    mobileNumber: mobileNumber || "",
    complexName: complexName || "",
    userType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useAuth();

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditedUser({
      firstName,
      lastName,
      email,
      mobileNumber: mobileNumber || "",
      complexName: complexName || "",
      userType,
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(`${baseUrl}/api/users`, editedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setShowEditModal(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
        <button
          onClick={handleEditClick}
          className="flex items-center px-4 py-2 bg-[#ae7a31] text-white rounded-md hover:bg-[#8e6429]"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <p className="mt-1 text-gray-900">{`${firstName} ${lastName}`}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-gray-900">{email}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            User Type
          </label>
          <p className="mt-1 text-gray-900 capitalize">{userType}</p>
        </div>

        {mobileNumber && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <p className="mt-1 text-gray-900">{mobileNumber}</p>
          </div>
        )}

        {complexName && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700">
              Complex Name
            </label>
            <p className="mt-1 text-gray-900">{complexName}</p>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            Created At
          </label>
          <p className="mt-1 text-gray-900">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">
            Last Updated
          </label>
          <p className="mt-1 text-gray-900">
            {new Date(updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={editedUser.mobileNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="complexName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Complex Name
                </label>
                <input
                  type="text"
                  id="complexName"
                  name="complexName"
                  value={editedUser.complexName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
