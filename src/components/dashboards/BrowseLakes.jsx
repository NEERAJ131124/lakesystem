import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";
import { useAuth } from "../contexts/AuthContext";
import { handleFollowLake } from "../contexts/Methods";
import Modal from "../Modal";
import StarRating from "../StarRating";
import AddCatch from "./ManageCatch/AddCatch";
import l0 from "../../assets/wlake.jpg";
import { useNavigate } from "react-router-dom";

function BrowseLakes({ setRefreshFollowedLakes, setActiveTab }) {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLake, setSelectedLake] = useState(null);
  const [isAddCatchOpen, setIsAddCatchOpen] = useState(false);
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [user, setUser] = useState([]);
  const getUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("response", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    }
  }, []);

  const fetchLakes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/lakes/all`);
      const filteredLakes = response.data
        .filter((lake) => !user.following.includes(lake._id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));;
      setLakes(filteredLakes);
    } catch (error) {
      console.error("Error fetching lakes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLakes();
  }, [user.following]);

  const handleFollow = async () => {
    setActiveTab("followedLakes");
  };

  const handleAddCatch = (lake) => {
    setSelectedLake(lake);
    setIsAddCatchOpen(true);
  };

  // if (loading)
  //   return (
  //     <div className="bg-white rounded-lg shadow-2xl p-6">
  //       <Loader />
  //     </div>
  //   );

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse Lakes</h2>
      {loading ? (
        <Loader />
      ) : lakes.length === 0 ? (
        <p className="text-gray-500">No lakes available.</p>
      ) : (
        <div className="grid gap-4">
          {lakes.map((lake) => (
            <div
              key={lake._id}
              className="border-[1px] border-[#ae7a31] shadow-2xl rounded-lg p-4 relative"
            >
              <img
                src={lake.image || l0}
                alt={lake.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-4">{lake.name}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">Location</span>
                  <span className="text-gray-600">{lake.location}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">
                    Current Stock
                  </span>
                  <span className="text-gray-600">{lake.currentStock}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">Fish Types</span>
                  <span className="text-gray-600">
                    {lake.fishTypes.join(", ")}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">Max Weight</span>
                  <span className="text-gray-600">{lake.maxWeight} kg</span>
                </div>

                {/* <div className="flex flex-col">
                  <span className="font-medium text-gray-700">
                    Average Rating
                  </span>
                  <div
                    className="flex items-center cursor-pointer flex-col"
                    onClick={() => setSelectedLake(lake)}
                  >
                    <StarRating
                      rating={lake.averageRating}
                      setRating={() => { }}
                    />
                    <span className="ml-2 text-gray-600">
                      ({lake.reviews.length} reviews)
                    </span>
                  </div>
                </div> */}

                <div className="flex flex-col col-span-2">
                  <span className="font-medium text-gray-700">Description</span>
                  <span className="text-gray-600">{lake.description}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <button
                  className="mt-4 px-4 py-2 bg-[#ae7a31] text-white rounded hover:bg-blue-600  bottom-4 right-4"
                  onClick={() => {
                    handleFollowLake(lake._id, true, setLoading, handleFollow, setRefreshFollowedLakes);
                  }}
                >
                  Add to Profile
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() =>
                    navigate(
                      `/fish-stock/${lake._id}`
                    )
                  }
                >
                  See Stock
                </button>
                {/* <button
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleAddCatch(lake)}
                >
                  Add Catch
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLake && (
        <Modal isOpen={!!selectedLake} onClose={() => setSelectedLake(null)}>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews for {selectedLake.name}
            </h2>
            {selectedLake.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews available.</p>
            ) : (
              <div className="space-y-4">
                {selectedLake.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="md:flex md:justify-between md:items-center flex-col md:flex-row">
                      <p className="font-semibold mb-2 md:mb-0">
                        {review.user.username}
                      </p>
                      <p className="text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-2">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      <AddCatch
        isOpen={isAddCatchOpen}
        onClose={() => setIsAddCatchOpen(false)}
        setLoading={setLoading}
        onCatchAdded={() => {
          // Refresh the catches list or perform any other necessary actions
        }}
        fetchFollowedLakes={() => {
          // Refresh the followed lakes list or perform any other necessary actions
        }}
        selectedLake={selectedLake}
      />
    </div>
  );
}

export default BrowseLakes;
