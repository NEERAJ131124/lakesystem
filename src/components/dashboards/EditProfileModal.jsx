import React, { useRef, useState } from "react";
import Modal from "../Modal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";
import toast from "react-hot-toast";

function EditProfileModal({ isOpen, onClose, setLoading, setRefresshUser }) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""
  );
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || "");
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // State to track field errors

  // Create refs for input fields
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const mobileNumberRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError(null);

    // Validation
    const newErrors = {};

    // First Name validation
    if (!firstName.trim()) newErrors.firstName = "First Name is required";

    // Last Name validation
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";

    // Email validation (basic regex check for email format)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Date of Birth validation
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";

    // Mobile Number validation (only numbers, exactly 10 digits)
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!mobilePattern.test(mobileNumber)) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoadingState(false);

      // Find the first error field and focus on it
      if (newErrors.firstName) firstNameRef.current.focus();
      else if (newErrors.lastName) lastNameRef.current.focus();
      else if (newErrors.email) emailRef.current.focus();
      else if (newErrors.dateOfBirth) dateOfBirthRef.current.focus();
      else if (newErrors.mobileNumber) mobileNumberRef.current.focus();

      return;
    }

    const updatedUser = { firstName, lastName, email, dateOfBirth, mobileNumber };

    try {
      setRefresshUser(true);
      await axios.put(`${baseUrl}/api/users/me`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Profile updated successfully!");
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoadingState(false);
      setLoading(false);
      setRefresshUser(false);
    }
  };

  if (loading) return <Loader />;

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
              ref={firstNameRef}
            />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength={25}
              ref={lastNameRef}
            />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength={50}
              ref={emailRef}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-2 border rounded"
              ref={dateOfBirthRef}
            />
            {errors.dateOfBirth && <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>}
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
              ref={mobileNumberRef}
            />
            {errors.mobileNumber && <span className="text-red-500 text-sm">{errors.mobileNumber}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User Type</label>
            <select value={user.userType} className="w-full p-2 border rounded" disabled>
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
