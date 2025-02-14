import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import { handleFollowLake } from "../contexts/Methods";
import Loader from "../Loader";
import Modal from "../Modal";
import StarRating from "../StarRating";

function FollowedLakes() {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLake, setSelectedLake] = useState(null);

  const fetchFollowedLakes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/users/follow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLakes(response.data.followedLakes);
    } catch (error) {
      console.error("Error fetching followed lakes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowedLakes();
  }, [fetchFollowedLakes]);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Followed Lakes
      </h2>
      {loading ? (
        <Loader />
      ) : lakes.length === 0 ? (
        <p className="text-gray-500">No lakes followed yet.</p>
      ) : (
        <div className="grid gap-4">
          {lakes.map((lake) => (
            <div
              key={lake._id}
              className="border-[1px] border-[#ae7a31] shadow-2xl rounded-lg p-4 relative"
            >
              {lake.image && (
                <img
                  src={lake.image}
                  alt={lake.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-semibold text-lg">{lake.name}</h3>
              <p className="text-gray-600">{lake.location}</p>
              {/* <p className="text-gray-600">Price: £{lake.price}/day</p> */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setSelectedLake(lake)}
              >
                <StarRating rating={lake.averageRating} setRating={() => { }} />
                <span className="ml-2 text-gray-600">
                  ({lake.reviews.length} reviews)
                </span>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  handleFollowLake(
                    lake._id,
                    false,
                    setLoading,
                    fetchFollowedLakes
                  );
                }}
              >
                Remove from Profile
              </button>
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
                    <p className="font-semibold">{review.user.username}</p>
                    <p className="text-gray-600">{review.review}</p>
                    <p className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default FollowedLakes;
