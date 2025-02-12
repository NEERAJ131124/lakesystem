import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { baseUrl } from "../../../constants/APIs";
import { handleFollowLake } from "../../contexts/Methods";
import Modal from "../../Modal";
import StarRating from "../../StarRating";

function AddCatch({
  isOpen,
  onClose,
  onCatchAdded,
  fetchFollowedLakes,
  setLoading,
  selectedLake,
}) {
  const [lakes, setLakes] = useState([]);
  const [newCatch, setNewCatch] = useState({
    species: "",
    weight: "",
    length: "",
    photo: null,
    lake: selectedLake ? selectedLake._id : "",
    description: "",
    taggedUsers: "",
    review: "",
    rating: 0,
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
    setNewCatch({ ...newCatch, photo: e.target.files[0] });
    if (errors.photo) {
      setErrors({ ...errors, photo: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newCatch.species.trim()) {
      newErrors.species = "Fish species is required";
    }

    if (!newCatch.weight || isNaN(newCatch.weight) || newCatch.weight <= 0) {
      newErrors.weight = "Please enter a valid weight";
    }

    if (!newCatch.length || isNaN(newCatch.length) || newCatch.length <= 0) {
      newErrors.length = "Please enter a valid length";
    }

    if (!newCatch.lake) {
      newErrors.lake = "Please select a lake";
    }

    if (!newCatch.photo) {
      newErrors.photo = "Please upload a photo";
    }
    if (newCatch.rating === 0 && (newCatch.rating < 1 || newCatch.rating > 5)) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

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
    formData.append("species", newCatch.species);
    formData.append("weight", newCatch.weight);
    formData.append("length", newCatch.length);
    formData.append("image", newCatch.photo);
    formData.append("lake", newCatch.lake);
    formData.append("description", newCatch.description);
    formData.append("taggedUsers", newCatch.taggedUsers);
    formData.append("review", newCatch.review);
    formData.append("rating", newCatch.rating);

    try {
      const res = await axios.post(`${baseUrl}/api/catches`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNewCatch({
        species: "",
        weight: "",
        length: "",
        photo: null,
        lake: "",
        description: "",
        taggedUsers: "",
        review: "",
        rating: 0,
      });
      console.log(res);
      onCatchAdded();
      onClose();
    } catch (error) {
      console.error("Error adding new catch:", error);
    } finally {
      setLoading(false);
    }
  };

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
                htmlFor="species"
                className="block text-sm font-medium text-gray-700"
              >
                Fish Species
              </label>
              <input
                type="text"
                id="species"
                name="species"
                value={newCatch.species}
                onChange={handleInputChange}
                required
                className={`p-2 border w-full rounded-md text-base ${errors.species ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.species && (
                <span className="text-red-500 text-sm">{errors.species}</span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                id="weight"
                name="weight"
                value={newCatch.weight}
                onChange={handleInputChange}
                required
                className={`p-2 w-full border rounded-md text-base ${errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.weight && (
                <span className="text-red-500 text-sm">{errors.weight}</span>
              )}
            </div>

            <div className="mb-4">
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
                value={newCatch.length}
                onChange={handleInputChange}
                required
                className={`p-2 w-full border rounded-md text-base ${errors.length ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.length && (
                <span className="text-red-500 text-sm">{errors.length}</span>
              )}
            </div>

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
                  value={newCatch.lake}
                  onChange={handleInputChange}
                  required
                  className={`p-2 border w-full rounded-md text-base ${errors.lake ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select a lake</option>
                  {lakes.map((lake) => (
                    <option key={lake._id} value={lake._id}>
                      {lake.name}
                    </option>
                  ))}
                </select>
                {/* {newCatch.lake && (
                  <button
                    type="button"
                    onClick={() => {
                      handleFollowLake(
                        newCatch.lake,
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
                className={`p-2 w-full border rounded-md text-base ${errors.photo ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.photo && (
                <span className="text-red-500 text-sm">{errors.photo}</span>
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
                value={newCatch.description}
                onChange={handleInputChange}
                rows={3}
                className={`p-2 border w-full rounded-md text-base ${errors.description ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700"
              >
                Review
              </label>
              <textarea
                id="review"
                name="review"
                value={newCatch.review}
                onChange={handleInputChange}
                rows={3}
                className={`p-2 border w-full rounded-md text-base ${errors.review ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.review && (
                <span className="text-red-500 text-sm">{errors.review}</span>
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating (1-5)
              </label>
              <StarRating
                rating={newCatch.rating}
                setRating={(value) =>
                  setNewCatch({ ...newCatch, rating: value })
                }
              />
              {errors.rating && (
                <span className="text-red-500 text-sm">{errors.rating}</span>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-3 w-full">
            <button
              type="button"
              onClick={() =>
                setNewCatch({
                  species: "",
                  weight: "",
                  length: "",
                  photo: null,
                  lake: "",
                  description: "",
                  taggedUsers: "",
                  review: "",
                  rating: 0,
                })
              }
              className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md cursor-pointer text-base flex-1 whitespace-nowrap"
            >
              Add Catch
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddCatch;
