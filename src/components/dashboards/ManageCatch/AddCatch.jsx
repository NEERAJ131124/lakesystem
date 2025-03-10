import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { baseUrl } from "../../../constants/APIs";
import Modal from "../../Modal";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

function AddCatch({
  isOpen,
  onClose,
  onCatchAdded,
  fetchFollowedLakes,
  setLoading,
  selectedLake,
  fishData,
}) {
  const [lakes, setLakes] = useState([]);
  const [newCatch, setNewCatch] = useState({
    species: "",
    fishName: "",
    weight: "",
    status: "caught",
    photo: null,
    lake: selectedLake ? selectedLake._id : "",
    description: "",
    taggedUsers: "",
    review: "",
    rating: 0,
    stockID: 0,
  });

  useEffect(() => {
    if (fishData) {
      setNewCatch({
        species: fishData?.species,
        fishName: "",
        weight: "",
        status: "caught",
        photo: null,
        lake: fishData?.lake,
        description: "",
        taggedUsers: "",
        review: "",
        rating: 0,
        stockID: fishData?._id,
      });
    }
    // console.log("fishStocks", fishData);
  }, [fishData]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const previousFileRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchLakes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/lakes/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLakes(response.data);
      } catch (error) {
        console.error("Error fetching lakes:", error);
      }
    };
    fetchLakes();
  }, []);

  useEffect(() => {
    if (selectedLake) {
      setNewCatch((prevCatch) => ({
        ...prevCatch,
        lake: selectedLake._id,
      }));
    }
  }, [selectedLake]);

  const handleInputChange = (e) => {
    setNewCatch({ ...newCatch, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewCatch((prevCatch) => ({
        ...prevCatch,
        photo: file,
      }));
      previousFileRef.current = file; // Store the previous valid file selection
      setPreviewImage(URL.createObjectURL(file)); // Set preview image
      if (errors.photo) {
        setErrors((prevErrors) => ({ ...prevErrors, photo: "" }));
      }
    } else {
      // Restore the previous file if user cancels file selection
      setNewCatch((prevCatch) => ({
        ...prevCatch,
        photo: previousFileRef.current || null, // Keep previous file if available
      }));
      setPreviewImage(
        previousFileRef.current
          ? URL.createObjectURL(previousFileRef.current)
          : null
      ); // Set preview image
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.value = ""; // Clear input before opening file selection
  };

  const clearImage = () => {
    setNewCatch((prevCatch) => ({
      ...prevCatch,
      photo: null,
    }));
    setPreviewImage(null);
    fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newCatch.species.trim()) {
      newErrors.species = "Fish species is required";
    }

    if (!newCatch.weight || isNaN(newCatch.weight) || newCatch.weight <= 0) {
      newErrors.weight = "Please enter a valid weight";
    }

    if (!newCatch.lake) {
      newErrors.lake = "Please select a lake";
    }

    if (!newCatch.photo) {
      newErrors.photo = "Please upload a photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("species", newCatch.species);
    formData.append("name", newCatch.fishName);
    formData.append("weight", newCatch.weight);
    formData.append("status", newCatch.status);
    formData.append("image", newCatch.photo);
    formData.append("lake", newCatch.lake);
    formData.append("description", newCatch.description);
    formData.append("taggedUsers", newCatch.taggedUsers);
    formData.append("review", newCatch.review);
    formData.append("rating", newCatch.rating ? newCatch.rating : 4);
    formData.append("stockID", newCatch.stockID);

    try {
      const res = await axios.post(`${baseUrl}/api/catches`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNewCatch({
        species: "",
        fishName: "",
        weight: "",
        status: "caught",
        photo: null,
        lake: "",
        description: "",
        taggedUsers: "",
        review: "",
        rating: 0,
        stockID: 0,
      });
      setPreviewImage(null); // Clear preview image
      toast.success("Catch added successfully!");
      onCatchAdded();
      onClose();
    } catch (error) {
      console.error("Error adding new catch:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

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

  const statusOptions = [
    { label: "Caught", value: "caught" },
    { label: "Uncaught", value: "uncaught" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add New Catch
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="lake"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Lake
              </label>
              <div className="flex gap-2">
                <select
                  id="lake"
                  name="lake"
                  value={newCatch.lake}
                  onChange={handleInputChange}
                  required
                  className={`p-2 border w-full rounded-md text-base ${
                    errors.lake ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled
                >
                  <option value="">Select a lake</option>
                  {lakes.map((lake) => (
                    <option key={lake._id} value={lake._id}>
                      {lake.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.lake && (
                <span className="text-red-500 text-sm">{errors.lake}</span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="species"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fish Species
              </label>
              <select
                id="species"
                name="species"
                value={newCatch.species}
                onChange={handleInputChange}
                required
                className={`p-2 border w-full rounded-md text-base ${
                  errors.species ? "border-red-500" : "border-gray-300"
                }`}
                disabled
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

            <div className="mb-4" style={{ display: "none" }}>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={newCatch.status}
                onChange={handleInputChange}
                required
                className={`p-2 border w-full rounded-md text-base ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <span className="text-red-500 text-sm">{errors.status}</span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Weight (lbs)
              </label>
              <input
                type="text"
                maxLength={5}
                id="weight"
                name="weight"
                value={newCatch.weight}
                onChange={handleInputChange}
                required
                className={`p-2 w-full border rounded-md text-base ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Allow numbers and decimal
                  if ((e.target.value.match(/\./g) || []).length > 1) {
                    e.target.value = e.target.value.replace(/\.+$/, ""); // Prevent multiple decimals
                  }
                }}
              />
              {errors.weight && (
                <span className="text-red-500 text-sm">{errors.weight}</span>
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Photo
              </label>

              <div className="flex items-center gap-4">
                {/* Custom File Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md text-base"
                >
                  Select Image
                </button>

                {/* Display Selected File Name */}
                {newCatch.photo && (
                  <span className="text-gray-700">{newCatch.photo.name}</span>
                )}
              </div>
              {errors.photo && (
                <span className="text-red-500 text-sm">{errors.photo}</span>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
              />
              {/* <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                onClick={handleFileInputClick}
                accept="image/*"
                className={`p-2 w-full border rounded-md text-base ${
                  errors.photo ? "border-red-500" : "border-gray-300"
                }`}
                ref={fileInputRef}
              />
              {errors.photo && (
                <span className="text-red-500 text-sm">{errors.photo}</span>
              )} */}
              {previewImage && (
                <div className="mt-2 relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                    onClick={clearImage}
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newCatch.description}
                onChange={handleInputChange}
                rows={3}
                className={`p-2 border w-full rounded-md text-base ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={250}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setNewCatch({
                  species: fishData?.species,
                  fishName: "",
                  weight: "",
                  status: "caught",
                  photo: "",
                  lake: fishData?.lake,
                  description: "",
                  taggedUsers: "",
                  review: "",
                  rating: 0,
                  stockID: fishData?._id,
                });
                setPreviewImage(null); // Clear preview image
                fileInputRef.current.value = ""; // Clear file input
              }}
              className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
              disabled={isSubmitting}
            >
              Clear
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#ae7a31] hover:bg-[#8e6429] cursor-pointer"
              } text-white rounded-md text-base flex-1 whitespace-nowrap`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Catch"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddCatch;
