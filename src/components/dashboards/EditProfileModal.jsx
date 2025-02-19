import React, { useState } from "react";
import Modal from "../Modal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";
import { set } from "date-fns";
import toast from "react-hot-toast";

function EditProfileModal({ isOpen, onClose, setLoading, setRefresshUser }) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "");
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || "");
  // const [complexName, setComplexName] = useState(user.complexName || "");
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError(null);

    const updatedUser = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      mobileNumber,
      // complexName,
    };

    try {
      setRefresshUser(true);
      const response = await axios.put(`${baseUrl}/api/users/me`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Profile updated successfully!");
      onClose();
      // window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoadingState(false);
      setLoading(false);
      setRefresshUser(false);
    }
  };
  if (loading) {
    return <Loader />
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength={25}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength={25}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength={50}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-2 border rounded"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength={10}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User Type</label>
            <select
              value={user.userType}
              className="w-full p-2 border rounded"
              disabled
            >
              <option value="angler">Angler</option>
              <option value="lakeOwner">Lake Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
            onClick={() => {
              onClose();
              setFirstName(user.firstName);
              setLastName(user.lastName);
              setEmail(user.email);
              setDateOfBirth(user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "");
              setMobileNumber(user.mobileNumber || "");
            }}
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
