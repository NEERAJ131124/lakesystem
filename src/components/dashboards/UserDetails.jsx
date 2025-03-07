import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { baseUrl } from "../../constants/APIs";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import { Fish, Mountain } from "lucide-react";

function UserDetails({
  onEditProfile,
  onAddCatch,
  setActiveTab,
  refresshUser,
  refreshCatches,
  refreshFollowedLakes,
}) {
  const { user } = useAuth();
  const [users, setUser] = useState({});
  const [anglers, setAnglers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showProfilePhoto, setShowProfilePhoto] = useState(null);

  const getUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
      setShowProfilePhoto(response?.data?.profilePhoto ?? null);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, [refresshUser, refreshCatches, refreshFollowedLakes]);

  const handleProfilePhotoClick = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleUpload = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedArea);
      const formData = new FormData();
      formData.append("profilePhoto", croppedImage);

      const res = await axios.put(
        `${baseUrl}/api/users/profile-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsModalOpen(false);
      getUser();
    } catch (error) {
      console.log(error);
      console.error("Error uploading profile photo:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mt-6">
        {/* User Profile Card */}
        <div className="bg-gradient-to-r col-span-8 md:col-span-4 from-green-900 to-green-900 text-white rounded-xl shadow-md p-6 flex  items-center md:items-start justify-between flex-wrap transition-transform transform hover:scale-105">
          <div className="flex gap-2">
            <div
              className="rounded-full bg-white bg-opacity-20 w-16 h-16 flex items-center justify-center shadow-sm relative group cursor-pointer"
              onClick={handleProfilePhotoClick}
            >
              {showProfilePhoto ? (
                <>
                  <img
                    src={showProfilePhoto}
                    alt="Profile"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </>
              ) : (
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
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-semibold text-xl">
                {users?.firstName} {users?.lastName}
              </p>
              <p className="text-gray-200">{users?.email}</p>
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition"
            onClick={onEditProfile}
          >
            Edit Profile
          </button>
        </div>

        {/* Total Catches */}
        {/* <div className="flex col-span-8 flex-col md:col-span-2 bg-gradient-to-r from-gray-500 to-gray-500 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-start justify-between flex-col">
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="text-lg font-semibold">Total Catches</p>
              <div className="flex items-center justify-end">
                <Fish className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-left">
              {users?.catches?.length || 0}
            </p>
            <button
              className="mt-4 px-4 py-1 w-full bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition"
              onClick={onAddCatch}
            >
              Add Catch
            </button>
          </div>
        </div> */}

        {/* Followed Lakes */}
        <div className="flex col-span-8 flex-col md:col-span-4 bg-gradient-to-r from-gray-900 to-gray-900 text-white rounded-xl shadow-md p-6 hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="flex items-start justify-between flex-col">
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="text-lg font-semibold">Followed Lakes</p>
              <div className="flex items-center justify-center">
                <Mountain className="h-8 w-8 text-white" />
              </div>
            </div>
            {/* <p className="text-3xl font-bold text-left">
              {users?.following?.length || 0}
            </p>
            <button
              className="mt-4 px-4 py-1 w-full bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition"
              onClick={setActiveTab}
            >
              Followed Lakes
            </button> */}
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="text-3xl font-bold text-left">
                {users?.following?.length || 0}
              </p>
              <button
                className="mt-4 px-4 py-1 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition"
                onClick={setActiveTab}
              >
                Followed Lakes
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 fixed inset-0"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
            <h2 className="text-xl font-semibold mb-4">Update Profile Photo</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageSrc && (
              <div className="relative w-full h-64 mt-4">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                onClick={handleUpload}
              >
                Upload
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDetails;
