import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { baseUrl } from "../../../constants/APIs";

export default function EditLake() {
  const params = useParams();
  const id = params.lakeId;
  const navigate = useNavigate();
  const [lake, setLake] = useState({
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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // const fishTypeOptions = ["Common", "Mirror", "Grass", "Ghost"];
  const fishTypeOptions = ["Common", "Mirror", "Grass", "Ghost","Leather","Ghosty","Koi","Cat fish","Other"];;

  useEffect(() => {
    const fetchLake = async () => {
      try {
        console.log("Fetching lake details...", params);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/lakes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const lakeData = response.data;
        setLake(lakeData);
        if (lakeData.image) {
          setPreviewImage(lakeData.image);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching lake:", error);
        toast.error("Failed to load lake details. Please try again.");
        setIsLoading(false);
      }
    };

    fetchLake();
  }, [id]);

  const validateInputs = () => {
    if (!lake.name.trim()) {
      toast.error("Lake name is required");
      return false;
    }

    if (!lake.location.trim()) {
      toast.error("Location is required");
      return false;
    }

    if (!lake.currentStock || lake.currentStock < 0) {
      toast.error("Current stock must be a positive number");
      return false;
    }

    if (!lake.maxWeight || lake.maxWeight < 0) {
      toast.error("Maximum weight must be a positive number");
      return false;
    }

    if (lake.fishTypes.length === 0) {
      toast.error("Please select at least one fish type");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["currentStock", "maxWeight"].includes(name)) {
      if (value < 0) {
        toast.error(`${name} cannot be negative`);
        return;
      }
    }

    setLake({ ...lake, [name]: value });
  };

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setLake((prev) => ({
      ...prev,
      [type]: isChecked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setLake({ ...lake, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateInputs()) {
      return;
    }

    const loadingToast = toast.loading("Updating lake...");

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("name", lake.name.trim());
      formData.append("description", lake.description.trim());
      formData.append("location", lake.location.trim());
      formData.append("currentStock", lake.currentStock);
      formData.append("maxWeight", lake.maxWeight);
      formData.append("fishTypes", JSON.stringify(lake.fishTypes));
      if (lake.image && typeof lake.image !== "string") {
        formData.append("image", lake.image);
      }

      const token = localStorage.getItem("token");

      await axios.put(`${baseUrl}/api/lakes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      toast.success("Lake updated successfully!");
      navigate("/lake-owner-dashboard/manage-lakes");
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.message ||
          "Failed to update lake. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-0">
      <div className="bg-white shadow-md rounded-lg p-6 pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Lake</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                value={lake.name}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="mt-1 block w-full rounded-md border-2 border-[#ae7a31] py-2 px-3 shadow-sm focus:border-[#ae7a31] focus:outline-none focus:ring-[#ae7a31] sm:text-sm"
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
                value={lake.location}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="mt-1 block w-full rounded-md border-2 border-[#ae7a31] py-2 px-3 shadow-sm focus:border-[#ae7a31] focus:outline-none focus:ring-[#ae7a31] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="currentStock"
                className="block text-sm font-medium text-gray-700"
              >
                Current Stock
              </label>
              <input
                type="text"
                id="currentStock"
                name="currentStock"
                value={lake.currentStock}
                onChange={handleInputChange}
                required
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Allow numbers and decimal
                  if ((e.target.value.match(/\./g) || []).length > 1) {
                    e.target.value = e.target.value.replace(/\.+$/, ""); // Prevent multiple decimals
                  }
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10); // Limit input to 10 characters
                  }
                }}
                className="mt-1 block w-full rounded-md border-2 border-[#ae7a31] py-2 px-3 shadow-sm focus:border-[#ae7a31] focus:outline-none focus:ring-[#ae7a31] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="maxWeight"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Weight (lbs)
              </label>
              <input
                type="text"
                id="maxWeight"
                name="maxWeight"
                value={lake.maxWeight}
                onChange={handleInputChange}
                required
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Allow numbers and decimal
                  if ((e.target.value.match(/\./g) || []).length > 1) {
                    e.target.value = e.target.value.replace(/\.+$/, ""); // Prevent multiple decimals
                  }
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10); // Limit input to 10 characters
                  }
                }}
                className="mt-1 block w-full rounded-md border-2 border-[#ae7a31] py-2 px-3 shadow-sm focus:border-[#ae7a31] focus:outline-none focus:ring-[#ae7a31] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={lake.description}
              onChange={handleInputChange}
              rows={4}
              maxLength={500}
              className="mt-1 block w-full rounded-md border-2 border-[#ae7a31] py-2 px-3 shadow-sm focus:border-[#ae7a31] focus:outline-none focus:ring-[#ae7a31] sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fish Types
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {fishTypeOptions.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type}
                    value={type}
                    checked={lake.fishTypes.includes(type)}
                    onChange={(e) => handleCheckboxChange(e, "fishTypes")}
                    className="h-4 w-4 text-[#ae7a31] border-2 border-2 focus:ring-[#ae7a31] border-[#ae7a31] rounded"
                  />
                  <label htmlFor={type} className="ml-2 text-sm text-gray-700">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="cursor-pointer inline-flex border-2 items-center px-4 py-2 border-[#ae7a31] rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Choose Image
              </label>
            </div>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-4 h-48 w-full object-fill border-2 rounded-lg"
              />
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating Lake..." : "Update Lake"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
