import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import { handleFollowLake } from "../contexts/Methods";
import Loader from "../Loader";
import { Eye, Star, Trash2, View } from "lucide-react";
import toast from "react-hot-toast";
import EditCatch from "./ManageCatch/EditCatch";
import AddCatch from "./ManageCatch/AddCatch";
import { useNavigate, useParams } from "react-router-dom";

function FollowedLakes({ setRefreshFollowedLakes, onAddCatch, setFishData }) {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCatch, setSelectedCatch] = useState(null);
  const [selectedLake, setSelectedLake] = useState(null);
  const [isAddCatchOpen, setIsAddCatchOpen] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);

  const fetchFollowedLakes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/users/follow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response);
      setLakes(
        response?.data?.followedLakes.map((lake) => ({
          ...lake,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching followed lakes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowedLakes();
  }, [fetchFollowedLakes]);

  const handleFavourite = async (postId, favourite) => {
    setRequestInProgress(true);
    try {
      const res = await axios.put(
        `${baseUrl}/api/users/favourite`,
        { postId, favourite },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      toast.success(
        favourite
          ? "The catch has been added to your favorites."
          : "The catch has been removed from your favorites."
      );

      // Update the local state without refetching
      setLakes((prevLakes) =>
        prevLakes.map((lake) => ({
          ...lake,
          catchPosts: lake.catchPosts.map((post) =>
            post._id === postId ? { ...post, favourite: favourite } : post
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status.");
    } finally {
      setRequestInProgress(false);
    }
  };

  const handleUnfollowLake = async (lakeId) => {
    try {
      await handleFollowLake(
        lakeId,
        false,
        setLoading,
        fetchFollowedLakes,
        setRefreshFollowedLakes
      );
      // toast.success("Lake removed from followed lakes.");
    } catch (error) {
      console.error("Error unfollowing lake:", error);
      toast.error("Failed to unfollow lake.");
    }
  };

  const handleAddCatch = (fish) => {
    if (onAddCatch) {
      onAddCatch(true);
      setFishData(fish);
    }
  };

  const navigate = useNavigate();
  // useEffect(() => {
  //   lakes.map((lake) => {});
  // }, [lakes]);

  return (
    <div className="p-6 px-0 overflow-x-hidden">
      {loading ? (
        <Loader />
      ) : lakes?.length === 0 ? (
        <p className="text-gray-500">No lakes followed yet.</p>
      ) : (
        <div className="grid gap-4">
          {lakes?.map((lake) => {
            const caughtCount =
              lake?.stocks.filter((data) => data?.caught === "caught").length ||
              0;
            const totalCount = lake?.stocks.length || 0;
            const caughtPercentage =
              totalCount > 0 ? (lake / totalCount) * 100 : 0;

            return (
              <div
                key={lake?._id}
                className="border-[1px] shadow-2xl rounded-lg p-4 relative bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{lake?.name}</h3>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">
                      <div className="w-16 md:w-32 bg-gray-200 rounded-full h-2 md:h-5">
                        <div
                          className="bg-green-500 h-2 md:h-5 rounded-full"
                          style={{ width: `${caughtPercentage}%` }}
                        ></div>
                      </div>
                    </span>
                    <div className="flex items-center">
                      <span className="text-green-500 font-semibold">
                        {caughtCount}
                      </span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-gray-500 font-semibold">
                        {totalCount}
                      </span>
                    </div>
                    <button
                      className="ml-4 text-red-500 hover:text-red-700"
                      onClick={() => handleUnfollowLake(lake._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h5 className="mb-2">Fish Stock :</h5>
                {lake?.stocks?.length === 0 ? (
                  <div className="flex justify-center items-center h-24">
                    <p className="text-gray-500">No fish stocks available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-6 gap-4">
                    {lake?.stocks
                      ?.sort((a, b) => {
                        if (a.caught === b.caught) {
                          return b.weight - a.weight; // Sort by weight if caught status is the same
                        }
                        return a.caught === "caught" ? -1 : 1; // Caught fish first
                      })
                      .map((fish) => {
                        // Check if the fish is caught
                        const isCaught =
                          fish?.caught === "caught" ? true : false;
                        console.log("isCaught", isCaught);

                        return (
                          <div
                            key={fish?._id}
                            className="relative bg-cover text-white bg-center rounded-2xl shadow-lg overflow-hidden aspect-square group border border-gray-300"
                            style={{
                              backgroundImage: `url(${fish?.image})`,
                              filter: !isCaught ? "grayscale(100%)" : "none",
                            }}
                          >
                            {/* Dark overlay for better contrast */}
                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>

                            {/* Fish Info Card */}
                            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-10 text-white text-black p-2 rounded-b-2xl flex justify-between ">
                              <div>
                                <p className="text-lg font-semibold">
                                  {fish?.name}
                                </p>
                                <p className="text-xs">
                                  Weight: {fish?.weight} lbs
                                </p>
                              </div>
                              {/* <View size={36} className="cursor-pointer"/> */}
                              <Eye
                                size={36}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (isCaught) {
                                    navigate(
                                      `/catch?stockID=${fish?._id}&lakeID=${fish.lake}`
                                    );
                                  } else {
                                    toast.error("No catches in this stock.");
                                  }
                                }}
                              />
                            </div>

                            {/* Buttons for Catch & Uncatch */}
                            <div className="absolute top-2 right-2 flex gap-2">
                              {isCaught ? (
                                <button
                                  className="bg-green-500 text-white px-3 py-1 rounded-full shadow-md"
                                  onClick={() => handleAddCatch(fish)}
                                >
                                  Caught
                                </button>
                              ) : (
                                <button
                                  className="bg-green-500 text-white px-3 py-1 rounded-full shadow-md"
                                  onClick={() => handleAddCatch(fish)}
                                >
                                  uncaught
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
                {/* end new 06-03-2025 */}
              </div>
            );
          })}
        </div>
      )}
      {selectedCatch && (
        <EditCatch
          catchData={selectedCatch}
          onClose={() => setSelectedCatch(null)}
          onSave={fetchFollowedLakes}
          isOpen={!!selectedCatch}
          setLoading={setLoading}
          onCatchUpdated={fetchFollowedLakes}
        />
      )}
      {isAddCatchOpen && (
        <AddCatch
          isOpen={isAddCatchOpen}
          onClose={() => setIsAddCatchOpen(false)}
          onCatchAdded={fetchFollowedLakes}
          fetchFollowedLakes={fetchFollowedLakes}
          setLoading={setLoading}
          selectedLake={selectedLake}
        />
      )}
    </div>
  );
}

export default FollowedLakes;
