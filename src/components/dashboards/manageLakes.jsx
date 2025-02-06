import React, { useCallback, useEffect, useState } from "react";
import { Edit, Trash2, Eye, X } from "lucide-react";
import DeleteModal from "./ManageLakes/DeleteLakeModal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

function ManageLakes() {
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLake, setSelectedLake] = useState(null);
  const [lakes, setLakes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [facilityFilter, setFacilityFilter] = useState("all");

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchLakes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/lakes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLakes(response.data);
    } catch (error) {
      console.error("Error fetching lakes:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLakes();
  }, [fetchLakes]);

  const handleView = (lake) => {
    setSelectedLake(lake);
    setShowViewModal(true);
  };

  const handleDelete = (lake) => {
    setSelectedLake(lake);
    setShowDeleteModal(true);
  };

  const uniqueFacilities = [
    ...new Set(lakes.flatMap((lake) => lake.facilities)),
  ];

  const filteredLakes = lakes.filter((lake) => {
    // Search term matching
    const matchesSearch =
      lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lake.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lake.pricing.toString().includes(searchTerm);

    // Fish type filtering
    const matchesFishType =
      filterType === "all" || lake.fishTypes.includes(filterType);

    // Facility filtering
    const matchesFacility =
      facilityFilter === "all" || lake.facilities.includes(facilityFilter);

    // Price range filtering
    const matchesPrice =
      (!priceRange.min || lake.pricing >= Number(priceRange.min)) &&
      (!priceRange.max || lake.pricing <= Number(priceRange.max));

    return matchesSearch && matchesFishType && matchesFacility && matchesPrice;
  });

  const uniqueFishTypes = [...new Set(lakes.flatMap((lake) => lake.fishTypes))];

  const ViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff] to-[#ddd] p-8">
      <div className="mb-6 flex gap-4 flex-wrap">
        {/* Existing search input */}
        <input
          type="text"
          placeholder="Search lakes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-64"
        />

        {/* Existing fish type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Fish Types</option>
          {uniqueFishTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* New facility filter */}
        <select
          value={facilityFilter}
          onChange={(e) => setFacilityFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Facilities</option>
          {uniqueFacilities.map((facility) => (
            <option key={facility} value={facility}>
              {facility}
            </option>
          ))}
        </select>

        {/* Price range filters */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-32"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-32"
          />
        </div>

        {/* Optional: Clear filters button */}
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterType("all");
            setFacilityFilter("all");
            setPriceRange({ min: "", max: "" });
          }}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
        >
          Clear Filters
        </button>
      </div>

      {filteredLakes.length === 0 ? (
        <p className="text-white">No lakes found.</p>
      ) : (
        <div className="space-y-6">
          {filteredLakes.map((lake) => (
            <div
              key={lake._id}
              className="bg-black relative bg-opacity-60 shadow-xl rounded-xl p-6 flex"
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
                <p className="text-white opacity-80 mt-2">{lake.description}</p>
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
                  onClick={() =>
                    navigate(`/lake-owner-dashboard/edit-lake/${lake._id}`)
                  }
                  className="text-white opacity-80 hover:opacity-100 flex items-center"
                >
                  <Edit size={18} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() =>
                    navigate(`/lake-owner-dashboard/add-fish-stock/${lake._id}`)
                  }
                  className="text-white opacity-80 hover:opacity-100 flex items-center"
                >
                  <Edit size={18} className="mr-2" />
                  Add Fish Stock
                </button>
                <button
                  onClick={() => handleDelete(lake)}
                  className="text-red-500 absolute top-2 right-2 opacity-80 hover:opacity-100 flex items-center"
                >
                  <Trash2 size={24} className="mr-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showViewModal && <ViewModal />}
      {showDeleteModal && (
        <DeleteModal
          setShowDeleteModal={setShowDeleteModal}
          name={selectedLake?.name}
          id={selectedLake?._id}
          fetchLakes={fetchLakes}
        />
      )}
    </div>
  );
}

export default ManageLakes;
