import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../../constants/APIs";
import { Toaster } from "react-hot-toast";
import Loader from "../../Loader";
import { useNavigate } from "react-router-dom";

function CreateLake() {
  const [errors, setErrors] = useState({});
  const [newLake, setNewLake] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
    currentStock: "",
    maxWeight: "",
    fishTypes: [],
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fishTypeOptions = ["Common", "Mirror", "Grass", "Ghost"];

  const validateForm = () => {
    let tempErrors = {};
    if (!newLake.name.trim()) {
      tempErrors.name = "Lake name is required";
    } else if (newLake.name.length < 3 || newLake.name.length > 50) {
      tempErrors.name = "Lake name must be at least 3 characters";
    }

    if (!newLake.description.trim()) {
      tempErrors.description = "Description is required";
    } else if (newLake.description.length < 20) {
      tempErrors.description = "Description must be at least 20 characters";
    }

    if (!newLake.location.trim() || newLake.location.length > 50) {
      tempErrors.location = "Location is required";
    }

    if (!newLake.currentStock || parseInt(newLake.currentStock) < 0) {
      tempErrors.currentStock = "Current stock is required";
    } else if (parseInt(newLake.currentStock) < 0) {
      tempErrors.currentStock = "Current stock cannot be negative";
    }

    if (!newLake.maxWeight || parseInt(newLake.maxWeight) <= 0) {
      tempErrors.maxWeight = "Maximum weight is required";
    } else if (parseInt(newLake.maxWeight) <= 0) {
      tempErrors.maxWeight = "Maximum weight must be greater than 0";
    }

    if (newLake.fishTypes.length === 0) {
      tempErrors.fishTypes = "At least one fish type must be selected";
    }

    if (!newLake.image) {
      tempErrors.image = "Lake image is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLake({ ...newLake, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setNewLake((prev) => ({
      ...prev,
      [type]: isChecked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
    if (errors[type]) {
      setErrors({ ...errors, [type]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        setErrors({ ...errors, image: "Image size should not exceed 5MB" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please upload a valid image file" });
        return;
      }
      setNewLake({ ...newLake, image: file });
      setPreviewImage(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("name", newLake.name);
      formData.append("description", newLake.description);
      formData.append("location", newLake.location);
      formData.append("currentStock", newLake.currentStock);
      formData.append("maxWeight", newLake.maxWeight);
      formData.append("fishTypes", JSON.stringify(newLake.fishTypes));
      if (newLake.image) {
        formData.append("image", newLake.image);
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(`${baseUrl}/api/lakes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Lake created successfully!");

      setNewLake({
        name: "",
        description: "",
        location: "",
        image: null,
        currentStock: "",
        maxWeight: "",
        fishTypes: [],
      });
      setPreviewImage(null);
      navigate("/lake-owner-dashboard/manage-lakes");
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "Error creating lake. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Add New Lake</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="name"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Lake Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newLake.name}
              onChange={handleInputChange}
              required
              minLength={3}
              className={`w-full px-4 py-1.5 text-base rounded-lg border-2 ${
                errors.name ? "border-red-500" : "border-[#ae7a31]"
              } focus:ring-4 focus:ring-[#ae7a31]/20 focus:border-[#ae7a31] transition duration-200`}
            />
            {errors.name && <p className="text-red-500 mt-2">{errors.name}</p>}
          </div>

          <div>
            <label
              htmlFor="location"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={newLake.location}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-1.5 text-base rounded-lg border-2 ${
                errors.location ? "border-red-500" : "border-[#ae7a31]"
              } focus:ring-4 focus:ring-[#ae7a31]/20 focus:border-[#ae7a31] transition duration-200`}
            />
            {errors.location && (
              <p className="text-red-500 mt-2">{errors.location}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="currentStock"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Current Stock
            </label>
            <input
              type="number"
              id="currentStock"
              name="currentStock"
              value={newLake.currentStock}
              onChange={handleInputChange}
              min="0"
              required
              className={`w-full px-4 py-1.5 text-base rounded-lg border-2 ${
                errors.currentStock ? "border-red-500" : "border-[#ae7a31]"
              } focus:ring-4 focus:ring-[#ae7a31]/20 focus:border-[#ae7a31] transition duration-200`}
            />
            {errors.currentStock && (
              <p className="text-red-500 mt-2">{errors.currentStock}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="maxWeight"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Maximum Weight (lbs)
            </label>
            <input
              type="number"
              id="maxWeight"
              name="maxWeight"
              value={newLake.maxWeight}
              onChange={handleInputChange}
              min="1"
              required
              className={`w-full px-4 py-1.5 text-base rounded-lg border-2 ${
                errors.maxWeight ? "border-red-500" : "border-[#ae7a31]"
              } focus:ring-4 focus:ring-[#ae7a31]/20 focus:border-[#ae7a31] transition duration-200`}
            />
            {errors.maxWeight && (
              <p className="text-red-500 mt-2">{errors.maxWeight}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-base font-semibold text-gray-700 mb-2 block"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newLake.description}
            onChange={handleInputChange}
            rows={3}
            required
            minLength={20}
            className={`w-full px-4 py-1.5 text-base rounded-lg border-2 ${
              errors.description ? "border-red-500" : "border-[#ae7a31]"
            } focus:ring-4 focus:ring-[#ae7a31]/20 focus:border-[#ae7a31] transition duration-200`}
          />
          {errors.description && (
            <p className="text-red-500 mt-2">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="text-base font-semibold text-gray-700 mb-4 block">
            Fish Types
          </label>
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-3 rounded-lg border-2 w-full ${
              errors.fishTypes ? "border-red-500" : "border-[#ae7a31]"
            }`}
          >
            {fishTypeOptions.map((type) => (
              <div key={type} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={type}
                  value={type}
                  checked={newLake.fishTypes.includes(type)}
                  onChange={(e) => handleCheckboxChange(e, "fishTypes")}
                  className="w-5 h-5 text-[#ae7a31] border-2 border-[#ae7a31] rounded focus:ring-[#ae7a31]"
                />
                <label htmlFor={type} className="text-base text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
          {errors.fishTypes && (
            <p className="text-red-500 mt-2">{errors.fishTypes}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="text-base font-semibold text-gray-700 mb-2 block"
          >
            Lake Image
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              required
            />
            <label
              htmlFor="image"
              className={`inline-flex items-center px-6 py-1.5 border-2 ${
                errors.image ? "border-red-500" : "border-[#ae7a31]"
              } rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-[#ae7a31]/20 transition duration-200 cursor-pointer`}
            >
              <PlusCircle className="h-6 w-6 mr-2" />
              Choose Image
            </label>
          </div>
          {errors.image && <p className="text-red-500 mt-2">{errors.image}</p>}
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-4 h-48 object-cover rounded-lg w-full"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-6 text-lg font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-[#ae7a31]/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Lake..." : "Add Lake"}
        </button>
      </form>
    </div>
  );
}

export default CreateLake;
