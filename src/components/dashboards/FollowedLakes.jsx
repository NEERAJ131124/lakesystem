import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import { handleFollowLake } from "../contexts/Methods";
import Loader from "../Loader";
import { Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditCatch from "./ManageCatch/EditCatch";
import AddCatch from "./ManageCatch/AddCatch";

function FollowedLakes({ setRefreshFollowedLakes }) {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCatch, setSelectedCatch] = useState(null);
  const [selectedLake, setSelectedLake] = useState(null);
  const [isAddCatchOpen, setIsAddCatchOpen] = useState(false);
  const navigate = useNavigate();

  const fetchFollowedLakes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/users/follow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response?.data);
      setLakes(response?.data?.followedLakes || []);
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
      fetchFollowedLakes();
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status.");
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
              lake?.catchPosts?.filter((post) => post?.status === "caught")
                ?.length || 0;
            const totalCount = lake?.catchPosts?.length || 0;
            const caughtPercentage =
              totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

            return (
              <div
                key={lake?._id}
                className="border-[1px] shadow-2xl rounded-lg p-4 relative bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{lake?.name}</h3>
                  <div className="flex items-center flex-wrap">
                    <span className="text-gray-600 mr-2">
                      <div className="w-32 bg-gray-200 rounded-full h-5 ">
                        <div
                          className="bg-green-500 h-5 rounded-full"
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

                <div className="flex justify-between items-center mb-4">
                  {/* <p className="text-gray-600">{lake?.location}</p> */}
                  {/* <div className="flex items-center">
                    <span className="text-gray-600 mr-2">
                      <div className="w-32 bg-gray-200 rounded-full h-5 ">
                        <div
                          className="bg-green-500 h-5 rounded-full"
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
                  </div> */}
                </div>

                <h5 className="mb-2">Fish Stock : </h5>
                {lake?.catchPosts?.length === 0 ? (
                  <div className="flex justify-center items-center h-24">
                    <p className="text-gray-500">No catches in this lake.</p>
                    <button
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedLake(lake);
                        setIsAddCatchOpen(true);
                      }}
                    >
                      Add Catch
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-6 gap-2">
                    {lake?.catchPosts
                      ?.sort((a, b) => (a?.status === "caught" ? -1 : 1))
                      ?.map((post) => (
                        <div
                          key={post?._id}
                          className="relative bg-cover text-white bg-center rounded-lg shadow-md p-2 aspect-square group"
                          style={{
                            backgroundImage: `url(${post?.fish?.image})`,
                          }}
                        >
                          {post?.status === "caught" ? (
                            <>
                              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                              <div
                                className="absolute top-0.5 right-0.5 rounded-full p-2 cursor-pointer"
                                onClick={() =>
                                  handleFavourite(post?._id, !post?.favourite)
                                }
                              >
                                <Star
                                  size={20}
                                  className={`${
                                    post?.favourite
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-white"
                                  }`}
                                />
                              </div>
                              <div className="absolute bottom-1.5 left-2 ">
                                <p className="text-xs font-semibold bg-[#22c55e] rounded-full px-2 py-1 m-auto pt-0.5">
                                  Caught
                                </p>
                                <p className="text-lg font-semibold ml-0.5">
                                  {post?.fish?.species}
                                </p>
                                <p className="text-xs ml-0.5">
                                  {post?.fish?.weight} lbs
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                              <div className="absolute top-1.5 left-1.5">
                                <p className="text-xs font-semibold bg-[#3B82F6] rounded-full px-1.5 py-1 m-auto pt-0.5">
                                  Uncaught
                                </p>
                                <p className="text-lg font-semibold ml-0.5">
                                  {post?.fish?.species}
                                </p>
                                <p className="text-xs ml-0.5">
                                  {post?.fish?.weight} lbs
                                </p>
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  className="bg-white text-white font-semibold bg-opacity-30 px-2 py-1.5 rounded-full text-md pt-1 transition-colors"
                                  onClick={() => setSelectedCatch(post)}
                                >
                                  Catch Now
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                )}
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
