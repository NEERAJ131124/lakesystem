import React, { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Loader from "../../Loader";
import { baseUrl } from "../../../constants/APIs";

const CatchModal = ({ stockID, lakeID, isOpen, onClose }) => {
  const [catchPosts, setCatchPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !stockID) return;

    const getCatch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/users/catchpost?stockID=${stockID}&lakeID=${lakeID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCatchPosts(res?.data?.catchPosts || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCatch();
  }, [isOpen, stockID, lakeID]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl relative max-h-[90vh] overflow-y-auto"
      >
        <Toaster />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full p-2"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Catch Details</h2>
        {loading ? (
          <Loader />
        ) : catchPosts.length === 0 ? (
          <p className="text-gray-500 text-center">No catches in this stock.</p>
        ) : (
          <div className="space-y-6">
            {catchPosts.map((post) => (
               <div key={post._id} className="flex flex-col sm:flex-row gap-4 items-center border-b pb-4">
               {/* Image on Top for Mobile, Left for Larger Screens */}
               <div
                 className="w-full sm:w-1/3 h-32 bg-cover bg-center rounded-lg"
                 style={{ backgroundImage: `url(${post.fish.image})` }}
               ></div>
               
               {/* Details Below Image on Mobile, Right on Larger Screens */}
               <div className="w-full sm:w-2/3 text-left">
                 <p className="text-lg font-semibold text-gray-800">{post.fish.species}</p>
                 <p className="text-sm text-gray-600">Catch Time: {new Date(post.createdAt).toLocaleDateString('en-GB')}</p>
                 <p className="text-sm text-gray-600">Weight: {post.fish.weight} lbs</p>
                 <p className="text-sm text-gray-600">Description: {post.description}</p>
               </div>
             </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatchModal;
