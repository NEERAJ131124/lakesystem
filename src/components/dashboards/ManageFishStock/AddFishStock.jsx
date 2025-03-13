import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/APIs";
import toast from "react-hot-toast";
import Loader from "../../Loader";
import { compressImage } from "../../../constants/imageCompressor";

const AddingFishStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    // quantity: "",
    weight: "",
    // location: "",
    // averageSize: "",
    notes: "",
    image: null,
    lake: id,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const [loading, setLoading] = useState(false);
  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file, setLoading);
      setSelectedFileName(compressedFile.name)
      if (compressedFile.type.startsWith("image/")) {
        if (compressedFile.size > 5242880) {
          // 5MB limit
          setErrors({
            ...errors,
            image: "Image size should be less than 5MB",
          });
          return;
        }
        setFormData({
          ...formData,
          image: compressedFile,
        });
        setImagePreview(URL.createObjectURL(compressedFile));
        setErrors({
          ...errors,
          image: "",
        });
      } else {
        setErrors({
          ...errors,
          image: "Please select an image file (jpg, png, gif)",
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation - required and min length
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Species validation - required and alphabets only
    if (!formData.species.trim()) {
      newErrors.species = "Species is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.species)) {
      newErrors.species = "Species should contain only letters";
    }

    // Quantity validation - required, positive integer
    // if (!formData.quantity) {
    //   newErrors.quantity = "Quantity is required";
    // } else if (
    //   !Number.isInteger(Number(formData.quantity)) ||
    //   Number(formData.quantity) <= 0
    // ) {
    //   newErrors.quantity = "Please enter a valid positive whole number";
    // }

    // Weight validation - required, positive number with 2 decimal places
    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(formData.weight) || Number(formData.weight) <= 0) {
      newErrors.weight = "Please enter a valid weight in lbs";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.weight)) {
      newErrors.weight = "Weight should have a maximum of 2 decimal places";
    }

    // // Location validation - required and alphanumeric with spaces
    // if (!formData.location.trim()) {
    //   newErrors.location = "Location is required";
    // } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.location)) {
    //   newErrors.location =
    //     "Location should contain only letters, numbers and spaces";
    // }

    // // Average Size validation - positive number with 2 decimal places if provided
    // if (formData.averageSize) {
    //   if (isNaN(formData.averageSize) || Number(formData.averageSize) <= 0) {
    //     newErrors.averageSize = "Please enter a valid size";
    //   } else if (!/^\d+(\.\d{1,2})?$/.test(formData.averageSize)) {
    //     newErrors.averageSize = "Size should have maximum 2 decimal places";
    //   }
    // }

    // Notes validation - max length
    if (formData.notes.length > 500) {
      newErrors.notes = "Notes should not exceed 500 characters";
    }

    //Fish image required msg
    if (!formData.image) {
      newErrors.image = "Fish image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
          if (key === "image") {
            if (formData.image) {
              formDataToSend.append("image", formData.image);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
        const response = await axios.post(
          `${baseUrl}/api/fish`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Show success message
        toast.success("Fish stock added successfully!");

        // Clear form
        setFormData({
          name: "",
          species: "",
          // quantity: "",
          weight: "",
          // location: "",
          // averageSize: "",
          notes: "",
          image: null,
          lake: id,
        });
        setImagePreview(null);

        if (response.status === 201) {
          navigate(`/lake-owner-dashboard/manage-fish-stock/${id}`);
        }
        // Clear any previous errors
        setErrors({});
      } catch (error) {
        console.error("Error:", error);
        setErrors((prev) => ({
          ...prev,
          submit:
            error.response?.data?.message ||
            "Failed to submit fish stock data. Please try again.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const [selectedFileName,setSelectedFileName]=useState(null);

  const fishSpecies = [
    { label: "Mirror", value: "Mirror" },
    { label: "Common", value: "Common" },
    { label: "Grass", value: "Grass" },
    { label: "Leather", value: "Leather" },
    { label: "Ghosty", value: "Ghosty" },
    { label: "Koi", value: "Koi" },
    { label: "Cat fish", value: "Cat fish" },
    { label: "Other", value: "Other" },
  ];

  if (isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Add Fish Stock</h2>
      <form onSubmit={handleSubmit} className="gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-bold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter fish name"
              className={`p-2 border rounded-md text-base ${errors.name ? "border-red-500" : "border-gray-300"
                }`}
              maxLength={100}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="species" className="font-bold">
              Species:
            </label>
            <select
              id="species"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
              className={`p-2 border rounded-md text-base ${errors.species ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">Select a species</option>
              {fishSpecies.map((species) => (
                <option key={species.value} value={species.value}>
                  {species.label}
                </option>
              ))}
            </select>

            {errors.species && (
              <span className="text-red-500 text-sm">{errors.species}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="weight" className="font-bold">
              Weight (lbs):
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Enter weight"
              className={`p-2 border rounded-md text-base ${errors.weight ? "border-red-500" : "border-gray-300"
                }`}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Allow numbers and decimal
                if ((e.target.value.match(/\./g) || []).length > 1) {
                  e.target.value = e.target.value.replace(/\.+$/, ""); // Prevent multiple decimals
                }
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10); // Limit input to 10 characters
                }
              }}
            />
            {errors.weight && (
              <span className="text-red-500 text-sm">{errors.weight}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="font-bold">
              Fish Image:
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />

            {/* Custom Button to Trigger File Input */}
            <button
              type="button"
              onClick={() => document.getElementById("image").click()}
              className="flex items-center gap-2 sm:w-[12.5rem] bg-blue-500 text-white px-4 py-2 btn rounded-md shadow-md hover:bg-blue-600 transition text-center"
              style={{ background: "#ae7a31" }}
            >
              {loading ? "Uploading..." : (
                <>
                  <span>Select Image</span>
                </>
              )}
            </button>

            {/* Show Selected File Name */}
            {imagePreview && (
              <div className="mt-2 flex flex-col items-start">
                <img
                  src={imagePreview}
                  alt="Fish preview"
                  className="max-w-[200px] max-h-[200px] object-fill rounded-md border"
                />
                <p className="text-sm text-gray-600 mt-1">{selectedFileName}</p>
              </div>
            )}

            {/* Error Message */}
            {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
          </div>
          <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
         
            <label htmlFor="notes" className="font-bold">
              Notes:
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter additional notes"
              rows="4"
              maxLength="500"
              className={`p-2 border rounded-md text-base ${errors.notes ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.notes && (
              <span className="text-red-500 text-sm">{errors.notes}</span>
            )}
            <span className="text-sm text-gray-500">
              {formData.notes.length}/500 characters
            </span>
          </div>
          <div className="flex flex-row gap-3 col-span-1 md:col-span-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
            >
              Add Fish Stock
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddingFishStock;
