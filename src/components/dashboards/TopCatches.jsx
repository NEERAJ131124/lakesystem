import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";

function TopCatches() {
  const [anglers, setAnglers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnglers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("ranking data", response);
        const anglersData = response.data
          .filter((user) => user.userType === "angler")
          .sort((a, b) => b.catches.length - a.catches.length);
        setAnglers(anglersData);
      } catch (error) {
        console.error("Error fetching anglers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnglers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h2>
      {loading ? (
        <Loader />
      ) : anglers.length === 0 ? (
        <p className="text-gray-500">No anglers available.</p>
      ) : (
        <div className="grid gap-4">
          {anglers.map((angler) => (
            <div
              key={angler._id}
              className="bg-white border rounded-lg p-6 shadow-2xl border-[1px] border-[#ae7a31] relative"
            >
              {/* Responsive Layout: Column for small screens, Row for larger screens */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {angler.firstName[0]}
                    {angler.lastName[0]}
                  </span>
                </div>

                {/* Name & Email */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-semibold text-gray-900">{angler.firstName} {angler.lastName}</p>
                  <p className="text-gray-500 text-sm break-words">{angler.email}</p>
                </div>

                {/* Catch Count */}
                <div className="text-center sm:text-right">
                  <p className="font-medium text-gray-600">Catches: {angler.catches.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      )}
    </div>
  );
}

export default TopCatches;
