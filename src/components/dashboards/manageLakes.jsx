import React, { useCallback, useEffect, useState } from "react";
import { Edit, Trash2, Eye, X, Fish } from "lucide-react";
import DeleteModal from "./ManageLakes/DeleteLakeModal";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
// import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import ViewModal from "./ManageLakes/ViewLakeModal";

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
      lake.description.toLowerCase().includes(searchTerm.toLowerCase());
    // lake.pricing.toString().includes(searchTerm);

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

  // const allowedFishTypes = ["Common", "Mirror", "Grass", "Ghost"];
  const allowedFishTypes =  ["Common", "Mirror", "Grass", "Ghost","Leather","Ghosty","Koi","Cat fish","Other"]

  const uniqueFishTypes = [
    ...new Set(
      lakes
        .flatMap((lake) => lake.fishTypes)
        .filter((fish) => allowedFishTypes.includes(fish))
    ),
  ];

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
        {/* <select
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
        </select> */}

        {/* Price range filters */}
        {/* <div className="flex gap-2 items-center">
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
        </div> */}

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
        <p className="text-black">No lakes found.</p>
      ) : (
        <div className="space-y-6">
          {filteredLakes.map((lake) => (
            <div
              key={lake._id}
              className="bg-white relative bg-opacity-60 shadow-2xl rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border-2 border-gray-200"
            >
              <img
                src={lake.image || "/placeholder.svg?height=200&width=300"}
                alt={lake.name}
                className="w-full sm:w-1/4 h-48 object-fill rounded-lg"
              />
              <div className="flex-1 px-2 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-bold text-black">
                  {lake.name}
                </h3>
                <p className="text-black opacity-80 text-sm sm:text-base">
                  {lake.location}
                </p>
                {/* <p className="text-black opacity-80 text-sm sm:text-base">
                  £{lake.pricing}/day
                </p> */}
                <p className="text-black opacity-80 mt-2 text-sm sm:text-base line-clamp-4">
                  {lake.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-black opacity-80 text-sm sm:text-base">
                    Fish Types:{" "}
                  </span>
                  {lake.fishTypes.map((fish) => (
                    <span
                      key={fish}
                      className="inline-block bg-black bg-opacity-20 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm text-black"
                    >
                      {fish}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row sm:flex-col justify-start sm:justify-center space-x-4 sm:space-x-0 sm:space-y-4">
                <button
                  onClick={() => handleView(lake)}
                  className="text-black opacity-80 hover:opacity-100 flex items-center text-sm sm:text-base"
                >
                  <Eye size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">View</span>
                </button>
                <button
                  onClick={() =>
                    navigate(`/lake-owner-dashboard/edit-lake/${lake._id}`)
                  }
                  className="text-black opacity-80 hover:opacity-100 flex items-center text-sm sm:text-base"
                >
                  <Edit size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                {/* <button
                  onClick={() =>
                    navigate(`/lake-owner-dashboard/add-fish-stock/${lake._id}`)
                  }
                  className="text-black opacity-80 hover:opacity-100 flex items-center text-sm sm:text-base"
                >
                  <Edit size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Fish Stock</span>
                </button> */}
                <button
                  onClick={() =>
                    navigate(
                      `/lake-owner-dashboard/manage-fish-stock/${lake._id}`
                    )
                  }
                  className="text-black opacity-80 hover:opacity-100 flex items-center text-sm sm:text-base"
                >
                  <Fish size={16} className="mr-1 sm:mr-2" />
                  {/* <Edit size={16} className="mr-1 sm:mr-2" /> */}
                  <span className="hidden sm:inline">Manage Fish Stock</span>
                </button>
                <button
                  onClick={() => handleDelete(lake)}
                  className="text-red-500 sm:absolute sm:top-2 sm:right-2 opacity-80 hover:opacity-100 flex items-center text-sm sm:text-base"
                >
                  <Trash2 size={24} className="mr-1 sm:mr-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showViewModal && (
        <ViewModal
          selectedLake={selectedLake}
          setShowViewModal={setShowViewModal}
        />
      )}
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
