import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/APIs";
import toast, { Toaster } from "react-hot-toast";

const ManageFishStockUser = () => {
    const params = useParams();
    const navigate = useNavigate();
    const lakeId = params.id;
    const [fishStocks, setFishStocks] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFish, setSelectedFish] = useState(null);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        species: "",
        quantity: "",
        weight: "",
        dateAdded: "",
        location: "",
        averageSize: "",
        notes: "",
        image: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFishStocks();
    }, [lakeId, currentPage]);

    const fetchFishStocks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/fish/lakes/${lakeId}`, {
                params: { page: currentPage, limit },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFishStocks(response.data.fish);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching fish stocks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Fish Stock</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Back
                </button>
            </div>

            {hoveredImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-6">
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
                            onClick={() => setHoveredImage(null)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <img
                            src={hoveredImage}
                            alt="Enlarged fish"
                            className="max-h-[360px] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {fishStocks.map((fish) => (
                        <div
                            key={fish?._id}
                            className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center md:items-start"
                        >
                            {fish?.image && (
                                <img
                                    src={fish?.image}
                                    alt={fish?.name}
                                    className="w-full md:w-48 h-48 object-cover rounded mb-4 md:mb-0 md:mr-4 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setHoveredImage(fish.image)}
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{fish?.name}</h3>
                                <p className="text-gray-600">Species: {fish?.species}</p>
                                {/* <p className="text-gray-600">Quantity: {fish?.quantity}</p> */}
                                <p className="text-gray-600">Weight: {fish?.weight} (lbs)</p>
                                {/* <p className="text-gray-600">Location: {fish?.location}</p> */}
                                <p className="text-gray-600">
                                    Date Added: {new Date(fish?.dateAdded).toLocaleDateString()}
                                </p>
                                {fish?.averageSize && (
                                    <p className="text-gray-600">
                                        Average Size: {fish?.averageSize}cm
                                    </p>
                                )}
                                {fish?.notes && (
                                    <p className="text-gray-600">Notes: {fish?.notes}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 flex justify-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ManageFishStockUser;
