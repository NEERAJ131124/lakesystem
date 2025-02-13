import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { baseUrl } from "../../constants/APIs";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";

function UserDetails({ onEditProfile, onAddCatch }) {
  const { user } = useAuth();
  const [users, setUser] = useState({});
  const [anglers, setAnglers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

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
      console.log(res.data.profilePhoto);
      setUser((prevUser) => ({
        ...prevUser,
        profilePhoto: res.data.profilePhoto,
      }));
      setIsModalOpen(false);
      getUser(); // Refresh user data
    } catch (error) {
      console.log(error);
      console.error("Error uploading profile photo:", error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div
                className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center cursor-pointer relative group"
                onClick={handleProfilePhotoClick}
              >
                {user?.profilePhoto ? (
                  <>
                    <img
                      src={user.profilePhoto}
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
                )}
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
                  Email: {users?.email}
                </p>
              )}
              {users?.dateOfBirth && (
                <p className="text-gray-600">
                  Date of Birth:{" "}
                  {new Date(users.dateOfBirth)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")}
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Total Catches */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
          <div>
            <p className="text-lg font-semibold">Total Catches</p>
            <p className="text-3xl font-bold">{users?.catches?.length || 0}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            {/* Fish Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 12c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7zM4 12h16M9 9l3 3m0 0l3-3m-3 3V6"
              />
            </svg>
          </div>
        </div>

        {/* Following Lakes */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
          <div>
            <p className="text-lg font-semibold">Following Lakes</p>
            <p className="text-3xl font-bold">
              {users?.following?.length || 0}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            {/* Water Waves Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16s3-3 7-3 7 3 7 3M3 12s3-3 7-3 7 3 7 3M3 8s3-3 7-3 7 3 7 3"
              />
            </svg>
          </div>
        </div>

        {/* Angular Rank */}
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
          <div>
            <p className="text-lg font-semibold">Your Rank</p>
            <p className="text-3xl font-bold">{anglers?.[0]?.rank || "N/A"}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            {/* Star Icon for Ranking */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
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
