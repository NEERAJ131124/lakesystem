import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";
import { useAuth } from "../contexts/AuthContext";
import { handleFollowLake } from "../contexts/Methods";
import l0 from "../../assets/wlake.jpg";

function BrowseLakes() {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchLakes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/lakes/all`);
      const filteredLakes = response.data.filter(
        (lake) => !user.following.includes(lake._id)
      );
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
              {/* {lake.image && ( */}
              <img
                src={lake.image || l0}
                alt={lake.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              {/* )} */}
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
                  <span className="font-medium text-gray-700">Max Weight</span>
                  <span className="text-gray-600">{lake.maxWeight} kg</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">
                    Average Rating
                  </span>
                  <span className="text-gray-600">{lake.averageRating}/5</span>
                </div>

                <div className="flex flex-col col-span-2">
                  <span className="font-medium text-gray-700">Fish Types</span>
                  <span className="text-gray-600">
                    {lake.fishTypes.join(", ")}
                  </span>
                </div>

                <div className="flex flex-col col-span-2">
                  <span className="font-medium text-gray-700">Description</span>
                  <span className="text-gray-600">{lake.description}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <button
                  className="mt-4 px-4 py-2 bg-[#ae7a31] text-white rounded hover:bg-blue-600  bottom-4 right-4"
                  onClick={() => {
                    handleFollowLake(lake._id, true, setLoading, () => {
                      fetchLakes();
                    });
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseLakes;
