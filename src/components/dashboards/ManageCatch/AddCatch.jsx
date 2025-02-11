import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { baseUrl } from "../../../constants/APIs";
import { handleFollowLake } from "../../contexts/Methods";
import Loader from "../../Loader";
import { ChevronDown, ChevronRight } from "lucide-react";

function AddCatch({ onCatchAdded, fetchFollowedLakes }) {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCatch, setNewCatch] = useState({
    species: "",
    weight: "",
    length: "",
    photo: null,
    lake: "",
    description: "",
    taggedUsers: "",
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("species", newCatch.species);
    formData.append("weight", newCatch.weight);
    formData.append("length", newCatch.length);
    formData.append("image", newCatch.photo);
    formData.append("lake", newCatch.lake);
    formData.append("description", newCatch.description);
    formData.append("taggedUsers", newCatch.taggedUsers);

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
      });
      console.log(res);
      onCatchAdded();
    } catch (error) {
      console.error("Error adding new catch:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add New Catch
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-2xl transform transition-transform duration-200"
        >
          {showForm ? (
            <ChevronDown className="h-6 w-6 transition-transform duration-300" />
          ) : (
            <ChevronRight className="h-6 w-6 transition-transform duration-300" />
          )}
        </button>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showForm ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
              className={`p-2 border w-full rounded-md text-base ${
                errors.species ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.species && (
              <span className="text-red-500 text-sm">{errors.species}</span>
            )}
          </div>

          <div>
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
              className={`p-2 w-full border rounded-md text-base ${
                errors.weight ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.weight && (
              <span className="text-red-500 text-sm">{errors.weight}</span>
            )}
          </div>

          <div>
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
              className={`p-2 w-full border rounded-md text-base ${
                errors.length ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.length && (
              <span className="text-red-500 text-sm">{errors.length}</span>
            )}
          </div>

          <div>
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
              {newCatch.lake && (
                <button
                  type="button"
                  onClick={() => {
                    handleFollowLake(
                      newCatch.lake,
                      true,
                      setLoading,
                      fetchFollowedLakes
                    );
                    // fetchFollowedLakes();
                  }}
                  className="mt-1 px-4 py-2 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md whitespace-nowrap"
                >
                  Follow Lake
                </button>
              )}
            </div>
            {errors.lake && (
              <span className="text-red-500 text-sm">{errors.lake}</span>
            )}
          </div>

          <div>
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
              className={`p-2 border rounded-md text-base ${
                errors.photo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.photo && (
              <span className="text-red-500 text-sm">{errors.photo}</span>
            )}
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
              value={newCatch.description}
              onChange={handleInputChange}
              rows={3}
              className={`p-2 border w-full rounded-md text-base ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="taggedUsers"
              className="block text-sm font-medium text-gray-700"
            >
              Tagged Users (comma separated usernames)
            </label>
            <input
              type="text"
              id="taggedUsers"
              name="taggedUsers"
              value={newCatch.taggedUsers}
              onChange={handleInputChange}
              className={`p-2 border w-full rounded-md text-base ${
                errors.taggedUsers ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.taggedUsers && (
              <span className="text-red-500 text-sm">{errors.taggedUsers}</span>
            )}
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
    </div>
  );
}

export default AddCatch;
