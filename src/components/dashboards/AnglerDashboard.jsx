import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AddCatch from "./ManageCatch/AddCatch";
import { baseUrl } from "../../constants/APIs";
import { handleFollowLake } from "../contexts/Methods";
import Loader from "../Loader";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

function AnglerDashboard() {
  const [lakes, setLakes] = useState([]);
  const [catches, setCatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [selectedCatch, setSelectedCatch] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentingCatchId, setCommentingCatchId] = useState(null);

  const fetchFollowedLakes = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/follow`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      setLakes(response.data.lakes);
    } catch (error) {
      console.error("Error fetching followed lakes:", error);
    }
  }, []);

  useEffect(() => {
    fetchFollowedLakes();
  }, [fetchFollowedLakes]);

  const fetchCatches = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/catches/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      setCatches(response.data.catches);
    } catch (error) {
      console.error("Error fetching catches:", error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchCatches();
  }, [fetchCatches]);

  const handleEdit = (catchData) => {
    setSelectedCatch(catchData);
    // Implement edit functionality
  };

  const handleDelete = async (catchId) => {
    if (window.confirm("Are you sure you want to delete this catch?")) {
      setLoading(true);
      try {
        await axios.delete(`${baseUrl}/api/catches/${catchId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchCatches();
      } catch (error) {
        console.error("Error deleting catch:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLike = async (catchId) => {
    try {
      await axios.post(
        `${baseUrl}/api/catches/${catchId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCatches();
    } catch (error) {
      console.error("Error liking catch:", error);
    }
  };

  const handleComment = async (catchId) => {
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${baseUrl}/api/catches/${catchId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCommentText("");
      setCommentingCatchId(null);
      fetchCatches();
    } catch (error) {
      console.error("Error commenting on catch:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-full  mx-auto md:mx-[5vw]">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Angler Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            {/* Lakes Section */}
            <div className="bg-white rounded-lg shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Followed Lakes
              </h2>
              {lakes.length === 0 ? (
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

            <div className="space-y-6">
              {/* Add New Catch Form */}
              <AddCatch
                onCatchAdded={fetchCatches}
                fetchFollowedLakes={fetchFollowedLakes}
              />

              {/* Catches List */}
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Catches
                </h2>
                {catches.length === 0 ? (
                  <p className="text-gray-500">No catches recorded yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {catches.map((fish) => (
                      <div
                        key={fish._id}
                        className="bg-white border rounded-lg p-6 shadow-2xl border-[1px] border-[#ae7a31] relative"
                      >
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-600">
                                {fish.angler.firstName[0]}
                                {fish.angler.lastName[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <p className="font-semibold">
                                {fish.angler.firstName} {fish.angler.lastName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {new Date(fish.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowOptions(
                                  showOptions === fish._id ? null : fish._id
                                )
                              }
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                            {showOptions === fish._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                <button
                                  onClick={() => handleEdit(fish)}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(fish._id)}
                                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mb-4 text-gray-600 text-sm">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          {fish.lake.name}, {fish.lake.location}
                        </div>

                        {/* Description */}
                        <p className="mb-4">{fish.description}</p>

                        {/* Fish Image */}
                        {fish.fish.image && (
                          <div className="mb-4">
                            <img
                              src={fish.fish.image}
                              alt={fish.fish.species}
                              className="w-full h-96 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Fish Details */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {fish.fish.species}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-500">Weight</p>
                              <p className="font-medium">
                                {fish.fish.weight} kg
                              </p>{" "}
                            </div>
                            <div>
                              <p className="text-gray-500">Length</p>
                              <p className="font-medium">
                                {fish.fish.length} cm
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Engagement */}
                        {/* <div className="flex items-center justify-between border-t pt-4">
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleLike(fish._id)}
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                            >
                              <i className="far fa-heart"></i>
                              <span>{fish.likes.length} Likes</span>
                            </button>
                            <button
                              onClick={() =>
                                setCommentingCatchId(
                                  commentingCatchId === fish._id
                                    ? null
                                    : fish._id
                                )
                              }
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                            >
                              <i className="far fa-comment"></i>
                              <span>{fish.comments.length} Comments</span>
                            </button>
                          </div>
                          <button className="text-gray-600 hover:text-blue-600">
                            <i className="far fa-share-square"></i>
                          </button>
                        </div> */}

                        {/* Comments Section */}
                        {commentingCatchId === fish._id && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 p-2 border rounded-md"
                              />
                              <button
                                onClick={() => handleComment(fish._id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Post
                              </button>
                            </div>
                            <div className="space-y-2">
                              {fish.comments.map((comment) => (
                                <div
                                  key={comment._id}
                                  className="bg-gray-100 p-2 rounded-md"
                                >
                                  <p className="text-sm font-semibold">
                                    {comment.user.username}
                                  </p>
                                  <p className="text-sm">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnglerDashboard;
