import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import { useParams } from "react-router-dom";

function CreateLake({ setActiveSection }) {
  const params = useParams();
  const id = localStorage.getItem("id");
  const [newLake, setNewLake] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
    currentStock: "",
    maxWeight: "",
    fishTypes: [],
    facilities: [],
    pricing: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fishTypeOptions = ["Carp", "Mirror Carp", "Common Carp"];
  const facilityOptions = ["Parking", "Toilets", "Cafe"];
  console.log(params);
  useEffect(() => {
    const fetchLakeDetails = async () => {
      if (id) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${baseUrl}/api/lakes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          const lakeData = response.data;
          setNewLake({
            name: lakeData.name,
            description: lakeData.description,
            location: lakeData.location,
            currentStock: lakeData.currentStock,
            maxWeight: lakeData.maxWeight,
            fishTypes: lakeData.fishTypes,
            facilities: lakeData.facilities,
            pricing: lakeData.pricing,
            image: null,
          });
          if (lakeData.image) {
            setPreviewImage(lakeData.image);
          }
        } catch (error) {
          toast.error("Error fetching lake details");
        }
      }
    };

    fetchLakeDetails();
  });

  const handleInputChange = (e) => {
    setNewLake({ ...newLake, [e.target.name]: e.target.value });
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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLake({ ...newLake, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("name", newLake.name);
      formData.append("description", newLake.description);
      formData.append("location", newLake.location);
      formData.append("currentStock", newLake.currentStock);
      formData.append("maxWeight", newLake.maxWeight);
      formData.append("fishTypes", JSON.stringify(newLake.fishTypes));
      formData.append("facilities", JSON.stringify(newLake.facilities));
      formData.append("pricing", newLake.pricing);
      if (newLake.image) {
        formData.append("image", newLake.image);
      }

      const token = localStorage.getItem("token");

      let response;
      if (id) {
        response = await axios.put(`${baseUrl}/api/lakes/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Lake updated successfully!");
      } else {
        response = await axios.post(`${baseUrl}/api/lakes`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Lake created successfully!");
      }

      setNewLake({
        name: "",
        description: "",
        location: "",
        image: null,
        currentStock: "",
        maxWeight: "",
        fishTypes: [],
        facilities: [],
        pricing: "",
      });
      setPreviewImage(null);
      // onLakeCreated();
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          `Error ${id ? "updating" : "creating"} lake. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {id ? "Edit Lake" : "Add New Lake"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
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
            className="w-full rounded-md border border-[#ae7a31] shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={newLake.location}
            onChange={handleInputChange}
            className="w-full rounded-md border border-[#ae7a31] shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="currentStock"
            className="block text-sm font-medium text-gray-700"
          >
            Current Stock
          </label>
          <input
            type="number"
            id="currentStock"
            name="currentStock"
            value={newLake.currentStock}
            onChange={handleInputChange}
            className="w-full rounded-md border border-[#ae7a31] shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="maxWeight"
            className="block text-sm font-medium text-gray-700"
          >
            Maximum Weight (lbs)
          </label>
          <input
            type="number"
            id="maxWeight"
            name="maxWeight"
            value={newLake.maxWeight}
            onChange={handleInputChange}
            className="w-full rounded-md border border-[#ae7a31] shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
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
            className="w-full rounded-md border border-[#ae7a31] shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3 space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newLake.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-md border border-[#ae7a31] shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fish Types
          </label>
          <div className="space-y-2 bg-white p-3 rounded-md border border-[#ae7a31]">
            {fishTypeOptions.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={type}
                  value={type}
                  checked={newLake.fishTypes.includes(type)}
                  onChange={(e) => handleCheckboxChange(e, "fishTypes")}
                  className="h-4 w-4 text-[#ae7a31] focus:ring-[#ae7a31] border-[#ae7a31] rounded"
                />
                <label htmlFor={type} className="ml-2 text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Facilities
          </label>
          <div className="space-y-2 bg-white p-3 rounded-md border border-[#ae7a31]">
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
        </div>

        <div className="md:col-span-2 lg:col-span-3 space-y-2">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
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
            />
            <label
              htmlFor="image"
              className="cursor-pointer bg-white py-2 px-3 border border-[#ae7a31] rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
            >
              <PlusCircle className="h-5 w-5 inline-block mr-2" />
              Choose Image
            </label>
          </div>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded-md"
            />
          )}
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? `${id ? "Updating" : "Creating"} Lake...`
              : `${id ? "Update" : "Add"} Lake`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateLake;
