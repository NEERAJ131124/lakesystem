import React, { useState, useEffect, useRef } from "react";
import { Edit } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    complexName: "",
    userType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileNumberRef = useRef(null);
  const complexNameRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!editedUser.firstName.trim()) newErrors.firstName = "First name is required";
    if (!editedUser.lastName.trim()) newErrors.lastName = "Last name is required";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!editedUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(editedUser.email)) {
      newErrors.email = "Invalid email format";
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!editedUser.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!mobilePattern.test(editedUser.mobileNumber)) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
    }

    if (!editedUser.complexName.trim()) newErrors.complexName = "Complex Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setUser(response.data);
        setEditedUser({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          mobileNumber: response.data.mobileNumber || "",
          complexName: response.data.complexName || "",
          userType: response.data.userType,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details");
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      complexName: user.complexName || "",
      userType: user.userType,
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isValid = validateForm();
    if (!isValid) {
      if (errors.firstName) firstNameRef.current.focus();
      else if (errors.lastName) lastNameRef.current.focus();
      else if (errors.email) emailRef.current.focus();
      else if (errors.mobileNumber) mobileNumberRef.current.focus();
      else if (errors.complexName) complexNameRef.current.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(`${baseUrl}/api/users/me`, editedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ ...user, ...editedUser });
      setShowEditModal(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>Error loading user profile</div>;
  }

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
                  minLength={3}
                  maxLength={50}
                  ref={firstNameRef}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-[#ae7a31] focus:ring-1 focus:ring-[#ae7a31]"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
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
                  ref={lastNameRef}
                  value={editedUser.lastName}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-[#ae7a31] focus:ring-1 focus:ring-[#ae7a31]"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  ref={emailRef}
                  value={editedUser.email}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-[#ae7a31] focus:ring-1 focus:ring-[#ae7a31]"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  maxLength={10}
                  ref={mobileNumberRef}
                  value={editedUser.mobileNumber}
                  onChange={handleInputChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // number only in react
                  }}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-[#ae7a31] focus:ring-1 focus:ring-[#ae7a31]"
                />
                {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
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
                  maxLength={50}
                  ref={complexNameRef}
                  value={editedUser.complexName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-[#ae7a31] focus:ring-1 focus:ring-[#ae7a31]"
                />
                {errors.complexName && <p className="text-red-500 text-sm">{errors.complexName}</p>}
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
