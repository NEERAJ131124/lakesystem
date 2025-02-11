import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import { handleFollowLake } from "../contexts/Methods";
import Loader from "../Loader";

function FollowedLakes() {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowedLakes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/users/follow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLakes(response.data.lakes);
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
              className="border-[1px] border-[#ae7a31] shadow-2xl rounded-lg p-4"
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
              <p className="text-gray-600">Price: £{lake.price}/day</p>
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
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FollowedLakes;
