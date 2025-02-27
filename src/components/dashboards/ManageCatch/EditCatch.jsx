import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { baseUrl } from "../../../constants/APIs";
import Modal from "../../Modal";
import StarRating from "../../StarRating";
import { handleFollowLake } from "../../contexts/Methods";
import toast from "react-hot-toast";

function EditCatch({
  isOpen,
  onClose,
  catchData,
  onCatchUpdated,
  fetchFollowedLakes,
  setLoading,
}) {
  const [lakes, setLakes] = useState([]);
  const [updatedCatch, setUpdatedCatch] = useState({
    species: catchData.fish.species,
    fishName: catchData.fish.name || "",
    weight: catchData.fish.weight,
    status: catchData.status || "caught",
    // length: catchData.fish.length,
    photo: catchData.fish.image || null,
    lake: catchData.lake._id,
    description: catchData.description,
    taggedUsers: catchData.taggedUsers.join(", "),
    review: catchData.review || "",
    rating: catchData.rating || 0,
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

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

  const handleInputChange = (e) => {
    setUpdatedCatch({ ...updatedCatch, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    setUpdatedCatch({ ...updatedCatch, photo: e.target.files[0] });
    if (errors.photo) {
      setErrors({ ...errors, photo: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!updatedCatch.species.trim()) {
      newErrors.species = "Fish species is required";
    }

    if (
      !updatedCatch.weight ||
      isNaN(updatedCatch.weight) ||
      updatedCatch.weight <= 0
    ) {
      newErrors.weight = "Please enter a valid weight";
    }

    // if (
    //   !updatedCatch.length ||
    //   isNaN(updatedCatch.length) ||
    //   updatedCatch.length <= 0
    // ) {
    //   newErrors.length = "Please enter a valid length";
    // }

    if (!updatedCatch.lake) {
      newErrors.lake = "Please select a lake";
    }

    // if (
    //   updatedCatch.rating &&
    //   (updatedCatch.rating < 1 || updatedCatch.rating > 5)
    // ) {
    //   newErrors.rating = "Rating must be between 1 and 5";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("species", updatedCatch.species);
    formData.append("name", updatedCatch.fishName);
    formData.append("weight", updatedCatch.weight);
    formData.append("status", updatedCatch.status);
    // formData.append("length", updatedCatch.length);
    if (updatedCatch.photo && typeof updatedCatch.photo !== "string") {
      formData.append("image", updatedCatch.photo);
    }
    formData.append("lake", updatedCatch.lake);
    formData.append("description", updatedCatch.description);
    formData.append("taggedUsers", updatedCatch.taggedUsers);
    formData.append("review", updatedCatch.review);
    formData.append("rating", updatedCatch.rating ? updatedCatch.rating : 4);

    try {
      const res = await axios.put(
        `${baseUrl}/api/catches/${catchData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Catch updated successfully!");
      onCatchUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating catch:", error);
    } finally {
      setLoading(false);
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Catch</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="species"
                className="block text-sm font-medium text-gray-700"
              >
                Fish Species
              </label>
              <select
                id="species"
                name="species"
                value={updatedCatch.species}
                onChange={handleInputChange}
                required
                className={`p-2 border w-full rounded-md text-base ${
                  errors.species ? "border-red-500" : "border-gray-300"
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

            {/* <div className="mb-4">
              <label
                htmlFor="fishName"
                className="block text-sm font-medium text-gray-700"
              >
                Fish Name
              </label>
              <input
                type="text"
                id="fishName"
                name="fishName"
                value={updatedCatch.fishName}
                onChange={handleInputChange}
                className={`p-2 w-full border rounded-md text-base ${
                  errors.fishName ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={50}
              />
              {errors.fishName && (
                <span className="text-red-500 text-sm">{errors.fishName}</span>
              )}
            </div> */}

            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={updatedCatch.status}
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
                className="block text-sm font-medium text-gray-700"
              >
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.01"
                id="weight"
                name="weight"
                value={updatedCatch.weight}
                onChange={handleInputChange}
                required
                className={`p-2 w-full border rounded-md text-base ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.weight && (
                <span className="text-red-500 text-sm">{errors.weight}</span>
              )}
            </div>

            {/* <div className="mb-4">
              <label
                htmlFor="length"
                className="block text-sm font-medium text-gray-700"
              >
                Length (cm)
              </label>
              <input
                type="number"
                step="0.01"
                id="length"
                name="length"
                value={updatedCatch.length}
                onChange={handleInputChange}
                required
                className={`p-2 w-full border rounded-md text-base ${errors.length ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.length && (
                <span className="text-red-500 text-sm">{errors.length}</span>
              )}
            </div> */}

            <div className="mb-4">
              <label
                htmlFor="lake"
                className="block text-sm font-medium text-gray-700"
              >
                Lake
              </label>
              <div className="flex gap-2">
                <select
                  id="lake"
                  name="lake"
                  // disabled
                  value={updatedCatch.lake}
                  onChange={handleInputChange}
                  required
                  className={`p-2 border w-full rounded-md text-base ${
                    errors.lake ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a lake</option>
                  {lakes.map((lake) => (
                    <option key={lake._id} value={lake._id}>
                      {lake.name}
                    </option>
                  ))}
                </select>
                {/* {updatedCatch.lake && (
                  <button
                    type="button"
                    onClick={() => {
                      handleFollowLake(
                        updatedCatch.lake,
                        true,
                        setLoading,
                        fetchFollowedLakes
                      );
                    }}
                    className="mt-1 px-4 py-2 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md whitespace-nowrap"
                  >
                    Follow Lake
                  </button>
                )} */}
              </div>
              {errors.lake && (
                <span className="text-red-500 text-sm">{errors.lake}</span>
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Photo
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className={`p-2 w-full border rounded-md text-base ${
                  errors.photo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.photo && (
                <span className="text-red-500 text-sm">{errors.photo}</span>
              )}
              {updatedCatch.photo && typeof updatedCatch.photo === "string" && (
                <img
                  src={updatedCatch.photo}
                  alt="Catch"
                  className="mt-4 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={updatedCatch.description}
                onChange={handleInputChange}
                rows={3}
                className={`p-2 border w-full rounded-md text-base ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>

            {/* <div className="mb-4 md:col-span-2">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700"
              >
                Review
              </label>
              <textarea
                id="review"
                name="review"
                value={updatedCatch.review}
                onChange={handleInputChange}
                rows={3}
                className={`p-2 border w-full rounded-md text-base ${errors.review ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.review && (
                <span className="text-red-500 text-sm">{errors.review}</span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating (1-5)
              </label>
              <StarRating
                rating={updatedCatch.rating}
                setRating={(value) =>
                  setUpdatedCatch({ ...updatedCatch, rating: value })
                }
              />
              {errors.rating && (
                <span className="text-red-500 text-sm">{errors.rating}</span>
              )}
            </div> */}
          </div>

          <div className="flex flex-row gap-3 w-full">
            <button
              type="button"
              onClick={
                () => onClose()
                // setUpdatedCatch({
                //   species: catchData.fish.species,
                //   weight: catchData.fish.weight,
                //   // length: catchData.fish.length,
                //   photo: null,
                //   lake: catchData.lake._id,
                //   description: catchData.description,
                //   taggedUsers: catchData.taggedUsers.join(", "),
                //   review: catchData.review || "",
                //   rating: catchData.rating || 0,
                // })
              }
              className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
            >
              Update Catch
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default EditCatch;
