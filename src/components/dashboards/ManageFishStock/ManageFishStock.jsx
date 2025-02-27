import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/APIs";
import toast, { Toaster } from "react-hot-toast";

const ManageFishStock = () => {
  const params = useParams();
  const navigate = useNavigate();
  const lakeId = params.id;
  const [fishStocks, setFishStocks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    species: "",
    quantity: "",
    weight: "",
    dateAdded: "",
    location: "",
    averageSize: "",
    notes: "",
    image: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFishStocks();
  }, [lakeId, currentPage]);

  const fetchFishStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/fish/lakes/${lakeId}`, {
        params: { page: currentPage, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFishStocks(response.data.fish);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching fish stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fish) => {
    const formattedDate = new Date(fish.dateAdded).toISOString().split("T")[0];
    setSelectedFish(fish);
    setEditForm({
      name: fish.name,
      species: fish.species,
      quantity: fish.quantity,
      weight: fish.weight,
      dateAdded: formattedDate,
      location: fish.location,
      averageSize: fish.averageSize || "",
      notes: fish.notes || "",
      image: fish.image || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (fishId) => {
    if (window.confirm("Are you sure you want to delete this fish stock?")) {
      setLoading(true);
      try {
        await axios.delete(`${baseUrl}/api/fish/${fishId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Fish stock deleted successfully");
        fetchFishStocks();
      } catch (error) {
        console.error("Error deleting fish stock:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowEditModal(false);

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("species", editForm.species);
    formData.append("quantity", editForm.quantity);
    formData.append("weight", editForm.weight);
    formData.append("dateAdded", editForm.dateAdded);
    formData.append("location", editForm.location);
    formData.append("averageSize", editForm.averageSize);
    formData.append("notes", editForm.notes);
    if (editForm.image instanceof File) {
      formData.append("image", editForm.image);
    } else {
      formData.append("imageUrl", editForm.image);
    }

    try {
      const res = await axios.put(
        `${baseUrl}/api/fish/${selectedFish?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Fish stock updated successfully!");
      fetchFishStocks();
    } catch (error) {
      setShowEditModal(true);
      console.error("Error updating fish stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditForm({ ...editForm, image: file });
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

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800">
          Fish Stock Management
        </h2>

        {/* Buttons Container */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back
          </button>
          <button
            onClick={() =>
              navigate(`/lake-owner-dashboard/add-fish-stock/${lakeId}`)
            }
            className="bg-[#ae7a31] hover:bg-[#8e6429] text-white px-4 py-2 rounded-md 
      flex items-center gap-2 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Fish Stock
          </button>
        </div>
      </div>

      {hoveredImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
              onClick={() => setHoveredImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={hoveredImage}
              alt="Enlarged fish"
              className="max-h-[360px] object-fill rounded-lg"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {fishStocks.map((fish) => (
            <div
              key={fish?._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center md:items-start"
            >
              {fish?.image && (
                <img
                  src={fish?.image}
                  alt={fish?.name}
                  className="w-full md:w-48 h-48 object-fill rounded mb-4 md:mb-0 md:mr-4 cursor-pointer"
                  onClick={() => setHoveredImage(fish.image)}
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{fish?.name}</h3>
                <p className="text-gray-600">Species: {fish?.species}</p>
                {/* <p className="text-gray-600">Quantity: {fish?.quantity}</p> */}
                <p className="text-gray-600">Weight: {fish?.weight} (lbs)</p>
                {/* <p className="text-gray-600">Location: {fish?.location}</p> */}
                <p className="text-gray-600">
                  Date Added: {new Date(fish?.dateAdded).toLocaleDateString()}
                </p>
                {fish?.averageSize && (
                  <p className="text-gray-600">
                    Average Size: {fish?.averageSize}cm
                  </p>
                )}
                {fish?.notes && (
                  <p className="text-gray-600">Notes: {fish?.notes}</p>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex flex-col space-y-2">
                <button
                  onClick={() => handleEdit(fish)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(fish?._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showEditModal && (
        <div className="absolute top-0 left-0 right-0 bg-black py-[10vh] w-full bg-opacity-50 flex items-center justify-center z-[50]">
          <div className="bg-white p-6 rounded-lg w-[85%] h-fit my-16 z-[11] ">
            <h3 className="text-xl font-bold mb-4">Edit Fish Stock</h3>
            <form onSubmit={handleUpdate} className="w-full">
              <div className="flex flex-wrap mx-2">
                <div className="w-full md:w-100 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                    maxLength={100}
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Species</label>
                  <select
                    value={editForm.species}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        species: e.target.value,
                        customSpecies: "",
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select a species</option>
                    {fishSpecies.map((species) => (
                      <option key={species.value} value={species.value}>
                        {species.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Species</label>
                  <input
                    type="text"
                    value={editForm.species}
                    onChange={(e) =>
                      setEditForm({ ...editForm, species: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div> */}
                {/* <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, quantity: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div> */}
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) =>
                      setEditForm({ ...editForm, weight: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
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
                  />
                </div>
                {/* <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div> */}
                {/* <div className="w-full md:w-1/2 px-2 mb-4 hidden">
                  <label className="block text-gray-700 mb-2">Date Added</label>
                  <input
                    type="date"
                    value={editForm.dateAdded}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dateAdded: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div> */}
                {/* <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">
                    Average Size (cm)
                  </label>
                  <input
                    type="number"
                    value={editForm.averageSize}
                    onChange={(e) =>
                      setEditForm({ ...editForm, averageSize: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div> */}
                {/* <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={(e) =>
                      setEditForm({ ...editForm, image: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div> */}
                <div className="w-full px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    maxLength={500}
                  />
                </div>
                <div className="w-full px-2 mb-4">
                  <label className="block text-gray-700 mb-2">
                    Change Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  {editForm.image && (
                    <div className="mt-2">
                      <img
                        src={
                          editForm.image instanceof File
                            ? URL.createObjectURL(editForm.image)
                            : editForm.image
                        }
                        alt="Preview"
                        className="w-48 h-48 object-fill rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFishStock;
