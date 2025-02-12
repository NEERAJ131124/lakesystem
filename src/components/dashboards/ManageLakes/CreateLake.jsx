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
    // facilities: [],
    // pricing: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fishTypeOptions = ["Common", "Mirror", "Grass", "Ghost"];
  // const fishTypeOptions = ["Carp", "Mirror Carp", "Common Carp"];
  // const facilityOptions = ["Parking", "Toilets", "Cafe"];

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

    // if (!newLake.pricing || parseFloat(newLake.pricing) <= 0) {
    //   tempErrors.pricing = "Pricing is required";
    // } else if (parseFloat(newLake.pricing) <= 0) {
    //   tempErrors.pricing = "Price must be greater than 0";
    // }

    if (newLake.fishTypes.length === 0) {
      tempErrors.fishTypes = "At least one fish type must be selected";
    }

    // if (newLake.facilities.length === 0) {
    //   tempErrors.facilities = "At least one facility must be selected";
    // }

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
      // formData.append("facilities", JSON.stringify(newLake.facilities));
      // formData.append("pricing", newLake.pricing);
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
        // facilities: [],
        // pricing: "",
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
    <div className="bg-white rounded-xl shadow-lg p-8 mx-auto">
      <Toaster />
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Lake</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 w-full"
      >
        <div className="col-span-12 md:col-span-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            // className={`w-full rounded-md border ${errors.name ? "border-red-500" : "border-[#ae7a31]"
            //   } shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm focus:ring-2 focus:outline-none transition duration-200 ease-in-out py-2 px-4`}
            className={`w-full rounded-xl border bg-white py-3 px-5 text-gray-800 text-lg shadow-md focus:ring-2 focus:outline-none transition duration-200 ease-in-out 
              ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae7a31] focus:border-[#ae7a31]"}
            `}
            placeholder="Lake Name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-6">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            // className={`w-full rounded-md border ${errors.location ? "border-red-500" : "border-[#ae7a31]"
            //   } shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm focus:ring-2 focus:outline-none transition duration-200 ease-in-out py-2 px-4`}
            className={`w-full rounded-xl border bg-white py-3 px-5 text-gray-800 text-lg shadow-md focus:ring-2 focus:outline-none transition duration-200 ease-in-out 
              ${errors.location ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae7a31] focus:border-[#ae7a31]"}
            `}
            placeholder="Location"
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-6">
          <label
            htmlFor="currentStock"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            // className={`w-full rounded-md border ${errors.currentStock ? "border-red-500" : "border-[#ae7a31]"
            //   } shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm focus:ring-2 focus:outline-none transition duration-200 ease-in-out py-2 px-4`}
            className={`w-full rounded-xl border bg-white py-3 px-5 text-gray-800 text-lg shadow-md focus:ring-2 focus:outline-none transition duration-200 ease-in-out 
            ${errors.currentStock ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae7a31] focus:border-[#ae7a31]"}
          `}
            placeholder="Current Stock"
          />
          {errors.currentStock && (
            <p className="text-red-500 text-xs mt-1">{errors.currentStock}</p>
          )}
        </div>

        <div className="col-span-12 md:col-span-6">
          <label
            htmlFor="maxWeight"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            // className={`w-full rounded-md border ${errors.maxWeight ? "border-red-500" : "border-[#ae7a31]"
            //   } shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm focus:ring-2 focus:outline-none transition duration-200 ease-in-out py-2 px-4`}
            className={`w-full rounded-xl border bg-white py-3 px-5 text-gray-800 text-lg shadow-md focus:ring-2 focus:outline-none transition duration-200 ease-in-out 
            ${errors.maxWeight ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae7a31] focus:border-[#ae7a31]"}
          `}
            placeholder="Maximum Weight (lbs)"
          />
          {errors.maxWeight && (
            <p className="text-red-500 text-xs mt-1">{errors.maxWeight}</p>
          )}
        </div>

        {/* <div className="space-y-2">
          <label
            htmlFor="pricing"
            className="block text-sm font-medium text-gray-700"
          >
            Pricing (£) Per Hour
          </label>
          <input
            type="number"
            id="pricing"
            name="pricing"
            value={newLake.pricing}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            required
            className={`w-full rounded-md border ${
              errors.pricing ? "border-red-500" : "border-[#ae7a31]"
            } shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm`}
          />
          {errors.pricing && (
            <p className="text-red-500 text-xs mt-1">{errors.pricing}</p>
          )}
        </div> */}

        <div className="col-span-12">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            // className={`w-full rounded-md border ${errors.description ? "border-red-500" : "border-[#ae7a31]"
            //   } shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm focus:ring-2 focus:outline-none transition duration-200 ease-in-out py-2 px-4`}
            className={`w-full rounded-xl border bg-white py-3 px-5 text-gray-800 text-lg shadow-md focus:ring-2 focus:outline-none transition duration-200 ease-in-out 
              ${errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae7a31] focus:border-[#ae7a31]"}`}
            placeholder="Description"
          />
          {errors.description && (
            <p className="text-red-500 mt-2">{errors.description}</p>
          )}
        </div>

        <div className="col-span-12">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fish Types
          </label>
          <div
            // className={`space-y-2 bg-white p-3 rounded-md border grid grid-cols-4 ${errors.fishTypes ? "border-red-500" : "border-[#ae7a31]"
            //   }`}
            className={`bg-white p-5 rounded-xl border shadow-md grid grid-cols-2 md:grid-cols-4 gap-4 
              ${errors.fishTypes ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae7a31] focus:border-[#ae7a31]"}
            `}
          >
            {fishTypeOptions.map((type) => (
              <div key={type} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={type}
                  value={type}
                  checked={newLake.fishTypes.includes(type)}
                  onChange={(e) => handleCheckboxChange(e, "fishTypes")}
                  className="h-5 w-5 text-[#ae7a31] focus:ring-2 focus:ring-[#ae7a31] border-gray-300 rounded-md"
                // className="h-4 w-4 text-[#ae7a31] focus:ring-[#ae7a31] border-[#ae7a31] rounded"
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

        {/* <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Facilities
          </label>
          <div
            className={`space-y-2 bg-white p-3 rounded-md border ${errors.facilities ? "border-red-500" : "border-[#ae7a31]"
              }`}
          >
            {facilityOptions.map((facility) => (
              <div key={facility} className="flex items-center">
                <input
                  type="checkbox"
                  id={facility}
                  value={facility}
                  checked={newLake.facilities.includes(facility)}
                  onChange={(e) => handleCheckboxChange(e, "facilities")}
                  className="h-4 w-4 text-[#ae7a31] focus:ring-[#ae7a31] border-[#ae7a31] rounded"
                />
                <label
                  htmlFor={facility}
                  className="ml-2 text-sm text-gray-700"
                >
                  {facility}
                </label>
              </div>
            ))}
          </div>
          {errors.facilities && (
            <p className="text-red-500 text-xs mt-1">{errors.facilities}</p>
          )}
        </div> */}

        {/* <div className="md:col-span-2 lg:col-span-3 space-y-2">
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
              className={`cursor-pointer bg-white py-2 px-3 border ${errors.image ? "border-red-500" : "border-[#ae7a31]"
                } rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]`}
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
              className="mt-2 h-32 object-cover rounded-md"
            />
          )}
        </div> */}
        <div className="col-span-12">
          {/* Label */}
          <label htmlFor="image" className="block text-lg font-semibold text-gray-800 mb-2">
            Lake Image
          </label>

          {/* File Input Wrapper */}
          <div className="flex items-center">
            {/* Hidden Input */}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {/* Custom Button */}
            <label
              htmlFor="image"
              className={`cursor-pointer bg-[#ae7a31] py-2 px-5 text-white text-md rounded-md shadow-md flex items-center space-x-2 transition-all duration-200 ease-in-out hover:bg-[#945f26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31] ${errors.image ? "border border-red-500" : "border border-transparent"
                }`}
            >
              <PlusCircle className="h-6 w-6" />
              <span>Upload Image</span>
            </label>
          </div>

          {/* Error Message */}
          {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}

          {/* Image Preview */}
          {previewImage && (
            <div className="mt-3 flex items-center">
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 w-32 md:h-40 md:w-40 rounded-xl shadow-md border border-gray-300 object-contain"
              />
            </div>
          )}

        </div>


        <div className="col-span-12 md:col-span-6 xl:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Lake..." : "Add Lake"}
          </button>
        </div>
      </form >
    </div >
  );
}

export default CreateLake;
