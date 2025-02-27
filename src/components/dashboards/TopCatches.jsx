import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../constants/APIs";
import Loader from "../Loader";
import { Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function TopCatches() {
  const [favoriteCatches, setFavoriteCatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteCatches = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/users/favourites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFavoriteCatches(response.data.favourites);
      } catch (error) {
        console.error("Error fetching favorite catches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCatches();
  }, []);

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
      setFavoriteCatches((prevCatches) =>
        prevCatches.filter((catchItem) => catchItem._id !== postId)
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Favorite Catches
      </h2>
      {loading ? (
        <Loader />
      ) : favoriteCatches.length === 0 ? (
        <p className="text-gray-500">No favorite catches available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 overflow-auto">
          {favoriteCatches.map((fish) => (
            <div
              key={fish._id}
              className="bg-white border rounded-lg p-6 shadow-2xl border-[1px] border-[#ae7a31] relative max-w-full overflow-hidden"
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
                    className="text-yellow-500 hover:text-yellow-600"
                    onClick={() => handleFavourite(fish._id, false)}
                  >
                    <Star className="h-5 w-5 fill-yellow-500" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4 text-gray-600 text-sm">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {fish?.lake?.name}, {fish?.lake?.location}
              </div>

              {/* Fish Image */}
              {fish.fish.image && (
                <div className="mb-4">
                  <img
                    src={fish.fish.image}
                    alt={fish.fish.species}
                    className="w-full h-48 object-fill rounded-lg max-w-full"
                  />
                </div>
              )}

              {/* Description */}
              <p className="w-full mb-4 max-w-full break-words line-clamp-3 hover:line-clamp-none transition-all duration-300">
                {fish.description}
              </p>

              {/* Fish Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  {fish.fish.species}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Weight</p>
                    <p className="font-medium">{fish.fish.weight} lbs</p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500">Length</p>
                    <p className="font-medium">{fish.fish.length} cm</p>
                  </div> */}
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
              {/* {commentingCatchId === fish._id && (
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
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopCatches;
