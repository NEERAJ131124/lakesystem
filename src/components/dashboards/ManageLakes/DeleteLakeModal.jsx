import axios from "axios";
import { baseUrl } from "../../../constants/APIs";
import Loader from "../../Loader";
import { useState } from "react";
import toast from "react-hot-toast";

const DeleteModal = ({ setShowDeleteModal, name, id, fetchLakes }) => {
  const [loading, setLoading] = useState(false);
  const deleteLakeHandler = async () => {
    try {
      setLoading(true);
      await axios.delete(`${baseUrl}/api/lakes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchLakes();
      setShowDeleteModal(false);
      toast.success("Lake deleted successfully");
    } catch (error) {
      console.error("Error deleting lake:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  } // Add a loader here
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h3>
        <p className="text-white mb-6">
          Are you sure you want to delete {name}?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 rounded bg-black text-white hover:bg-opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={deleteLakeHandler}
            className="px-4 py-2 rounded bg-[#ae7a31] text-white hover:bg-[#8b6328]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
