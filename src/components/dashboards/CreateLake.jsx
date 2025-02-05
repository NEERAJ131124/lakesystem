import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";

function CreateLake({ onLakeCreated }) {
  const [newLake, setNewLake] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (e) => {
    setNewLake({ ...newLake, [e.target.name]: e.target.value });
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
      console.log("Starting form submission...");

      const formData = new FormData();

      // Append lake details
      formData.append("name", newLake.name);
      formData.append("description", newLake.description);
      formData.append("location", newLake.location);
      if (newLake.image) {
        formData.append("image", newLake.image);
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");

      console.log("Form data:", Object.fromEntries(formData));
      console.log("Token:", token);

      const response = await axios.post(`${baseUrl}/api/lakes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response received:", response.data);

      setNewLake({
        name: "",
        description: "",
        location: "",
        image: null,
      });
      setPreviewImage(null);
      onLakeCreated();
      toast.success("Lake created successfully!");
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Lake</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Lake Image
          </label>
          <div className="mt-1 flex items-center">
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
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
            >
              <PlusCircle className="h-5 w-5 inline-block mr-2" />
              Choose Image
            </label>
          </div>
          {previewImage && (
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Lake..." : "Add Lake"}
        </button>
      </form>
    </div>
  );
}

export default CreateLake;
