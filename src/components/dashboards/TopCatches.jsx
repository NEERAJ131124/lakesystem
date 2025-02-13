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
          {anglers.map((angler, index) => (
            <div
              key={angler._id}
              className="bg-white border rounded-lg p-6 shadow-2xl border-[1px] border-[#ae7a31] relative"
            >
              {/* Responsive Column Layout for Small Screens & Row Layout for Larger Screens */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Image - Full Width on Small Screens */}
                <div className="w-full sm:w-auto flex justify-center sm:justify-start mb-3 sm:mb-0">
                  <div className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {angler.firstName[0]}
                      {angler.lastName[0]}
                    </span>
                  </div>
                </div>

                {/* Name & Email - Full Width on Small Screens */}
                <div className="w-full text-center sm:text-left sm:w-auto">
                  <p className="font-semibold">
                    {angler.firstName} {angler.lastName}
                  </p>
                  <p className="text-gray-500 text-sm break-words">
                    {angler.email}
                  </p>
                </div>

                {/* Catch Count - Full Width on Small Screens */}
                <div className="w-full text-center sm:w-auto mt-2 sm:mt-0">
                  <p className="font-medium text-gray-600">
                    Catches: {angler.catches.length}
                  </p>
                </div>

                {/* Serial Number - Full Width on Small Screens */}
                <div className="w-full text-center sm:w-auto mt-2 sm:mt-0 text-gray-600">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        // <div className="grid gap-4">
        //   {anglers.map((angler, index) => (
        //     <div
        //       key={angler._id}
        //       className="bg-white border rounded-lg p-6 shadow-2xl border-[1px] border-[#ae7a31] relative"
        //     >
        //       <div className="flex items-center justify-between mb-4">
        //         <div className="flex items-center">
        //           <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center">
        //             <span className="text-xl font-bold text-gray-600">
        //               {angler.firstName[0]}
        //               {angler.lastName[0]}
        //             </span>
        //           </div>
        //           <div className="ml-4">
        //             <p className="font-semibold">
        //               {angler.firstName} {angler.lastName}
        //             </p>
        //             <p className="text-gray-500 text-sm">{angler.email}</p>
        //           </div>
        //         </div>
        //         <div className="text-gray-600">
        //           <span className="text-2xl font-bold">{index + 1}</span>
        //         </div>
        //       </div>
        //       <div className="text-gray-600">
        //         <p className="font-medium">Catches: {angler.catches.length}</p>
        //       </div>
        //     </div>
        //   ))}
        // </div>
      )}
    </div>
  );
}

export default TopCatches;
