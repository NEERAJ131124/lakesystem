import React, { useCallback, useEffect, useState } from "react";
import { Edit, Trash2, Eye, X } from "lucide-react";
import DeleteModal from "./ManageLakes/DeleteLakeModal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";

function ManageLakes({ onDeleteLake, setActiveSection }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLake, setSelectedLake] = useState(null);
  const [lakes, setLakes] = useState([]);
  const { user } = useAuth();

  const fetchLakes = useCallback(async () => {
    console.log("user", user);
    try {
      console.log("token", localStorage.getItem("token"));
      const response = await axios.get(`${baseUrl}/api/lakes`, {
        // params: { ownerId: user?._id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("response", response.data);
      setLakes(response.data);
    } catch (error) {
      console.error("Error fetching lakes:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLakes();
  }, [fetchLakes]);

  const handleEdit = (lake) => {
    // setSelectedLake(lake);
    // setShowEditModal(true);

    // Get the current URL
    const url = new URL(window.location.href);
    // Add user._id to the URL parameters
    url.searchParams.set("id", user._id);
    // Update the URL without reloading the page
    window.history.pushState({}, "", url);
    localStorage.setItem("selectedLake", JSON.stringify(lake));
    localStorage.setItem("id", user._id);
    setActiveSection("createLake");
  };

  const handleView = (lake) => {
    setSelectedLake(lake);
    setShowViewModal(true);
  };

  const handleDelete = (lake) => {
    setSelectedLake(lake);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDeleteLake(selectedLake._id);
    setShowDeleteModal(false);
  };

  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 w-1/2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Edit Lake</h3>
          <button onClick={() => setShowEditModal(false)}>
            <X className="text-white" />
          </button>
        </div>
        <form className="space-y-4">
          <input
            defaultValue={selectedLake?.name}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Lake Name"
          />
          <input
            defaultValue={selectedLake?.location}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Location"
          />
          <input
            defaultValue={selectedLake?.pricing}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Price per day"
            type="number"
          />
          <textarea
            defaultValue={selectedLake?.description}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Description"
          />
          <input
            type="file"
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            accept="image/*"
          />
          <input
            defaultValue={selectedLake?.currentStock}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Current Stock"
            type="number"
          />
          <input
            defaultValue={selectedLake?.maxWeight}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Max Weight (kg)"
            type="number"
          />
          <input
            defaultValue={selectedLake?.fishTypes.join(", ")}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Fish Types (comma separated)"
          />
          <input
            defaultValue={selectedLake?.facilities.join(", ")}
            className="w-full p-2 rounded bg-black bg-opacity-10 text-white"
            placeholder="Facilities (comma separated)"
          />
          <button className="bg-[#ae7a31] text-white px-4 py-2 rounded hover:bg-[#8b6328]">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );

  const ViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {selectedLake?.name}
          </h3>
          <button onClick={() => setShowViewModal(false)}>
            <X className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <img
            src={selectedLake?.image}
            alt={selectedLake?.name}
            className="rounded-lg w-full h-64 object-cover"
          />
          <div className="text-white space-y-4">
            <p>
              <span className="font-bold">Location:</span>{" "}
              {selectedLake?.location}
            </p>
            <p>
              <span className="font-bold">Price:</span> £{selectedLake?.pricing}
              /day
            </p>
            <p>
              <span className="font-bold">Description:</span>{" "}
              {selectedLake?.description}
            </p>
            <p>
              <span className="font-bold">Fish Types:</span>{" "}
              {selectedLake?.fishTypes.join(", ")}
            </p>
            <p>
              <span className="font-bold">Facilities:</span>{" "}
              {selectedLake?.facilities.join(", ")}
            </p>
            <p>
              <span className="font-bold">Current Stock:</span>{" "}
              {selectedLake?.currentStock}
            </p>
            <p>
              <span className="font-bold">Max Weight:</span>{" "}
              {selectedLake?.maxWeight}kg
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff] to-[#ddd] p-8">
      <div className="backdrop-filter backdrop-blur-lg bg-black bg-opacity-10 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-[#111]">
          Manage Lakes
        </h2>
        {lakes.length === 0 ? (
          <p className="text-white">No lakes added yet.</p>
        ) : (
          <div className="space-y-6">
            {lakes.map((lake) => (
              <div
                key={lake._id}
                className="bg-black bg-opacity-20 rounded-xl p-6 flex"
              >
                <img
                  src={lake.image || "/placeholder.svg?height=200&width=300"}
                  alt={lake.name}
                  className="w-1/4 h-48 object-cover rounded-lg"
                />
                <div className="flex-1 px-6">
                  <h3 className="text-2xl font-bold text-white">{lake.name}</h3>
                  <p className="text-white opacity-80">{lake.location}</p>
                  <p className="text-white opacity-80">£{lake.pricing}/day</p>
                  <p className="text-white opacity-80 mt-2">
                    {lake.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-white opacity-80">Fish Types: </span>
                    {lake.fishTypes.map((fish) => (
                      <span
                        key={fish}
                        className="inline-block bg-black bg-opacity-20 rounded-full px-3 py-1 text-sm text-white mr-2"
                      >
                        {fish}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <button
                    onClick={() => handleView(lake)}
                    className="text-white opacity-80 hover:opacity-100 flex items-center"
                  >
                    <Eye size={18} className="mr-2" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(lake)}
                    className="text-white opacity-80 hover:opacity-100 flex items-center"
                  >
                    <Edit size={18} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lake)}
                    className="text-white opacity-80 hover:opacity-100 flex items-center"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && <EditModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && (
        <DeleteModal
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
          name={selectedLake?.name}
        />
      )}
    </div>
  );
}

export default ManageLakes;
