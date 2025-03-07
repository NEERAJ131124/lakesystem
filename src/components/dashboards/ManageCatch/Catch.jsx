import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/APIs";
import axios from "axios";
import Loader from "../../Loader";

const Catch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const stockID = queryParams.get("stockID");
  const lakeID = queryParams.get("lakeID");
  const [catchPosts, setCatchPosts] = useState([]);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    const getCatch = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `${baseUrl}/api/users/catchpost?stockID=${stockID}&lakeID=${lakeID}}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCatchPosts(res?.data?.catchPosts);
        console.log("catchPosts", res);
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoading(false)
      }
    };

    if (stockID) {
      getCatch();
    }
  }, [stockID]);

  if(loading){
    return    <Loader />
  }

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Catch Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back
        </button>
      </div>
      <div>
        <div>
          {catchPosts.length === 0 ? (
            <div className="flex justify-center items-center h-24">
              <p className="text-gray-500">No catches in this stock.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-6 gap-4">
              {catchPosts.map((post) => (
                <div
                  key={post._id}
                  className="relative bg-cover text-white bg-center rounded-lg shadow-md p-2 aspect-square"
                  style={{ backgroundImage: `url(${post.fish.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                  <div className="absolute bottom-1.5 left-2">
                    <p className="text-lg font-semibold ml-0.5">
                      {post.fish.species}
                    </p>
                    <p className="text-xs ml-0.5">{post.fish.weight} lbs</p>
                    <p className="text-xs ml-0.5 overflow-hidden">
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catch;
