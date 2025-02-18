import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/APIs";
import toast, { Toaster } from "react-hot-toast";
import l0 from "../../../assets/wlake.jpg";

const ManageFishStockUser = () => {
    const params = useParams();
    const navigate = useNavigate();
    const lakeId = params.id;
    const [fishStocks, setFishStocks] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(false);
    const [lake, setLake] = useState([]);

    useEffect(() => {
        fetchLakeByID();
        fetchFishStocks();
        console.log("filterLakeByID", lake);
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
            console.error("Error fetching lakes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLakeByID = async () => {
        setLoading(true);
        try {
            // const response = await axios.get(`${baseUrl}/api/lakes/${lakeId}`, {
            const response = await axios.get(`${baseUrl}/api/lakes/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            var filterLakeByID = response.data.filter((lake) => lake._id === lakeId);
            if (filterLakeByID.length > 0) {
                setLake(filterLakeByID);
            }
        } catch (error) {
            console.error("Error fetching lake:", error);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">About Lake</h2>
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

            <div className="grid gap-4">
                {lake.map((lake) => (
                    <div
                        key={lake._id}
                        className="shadow-md border rounded-lg p-4 relative bg-white"
                    >
                        <img
                            src={lake.image || l0}
                            alt={lake.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-lg mb-4">{lake.name}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-700">Location</span>
                                <span className="text-gray-600">{lake.location}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-gray-700">
                                    Current Stock
                                </span>
                                <span className="text-gray-600">{lake.currentStock}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-gray-700">Fish Types</span>
                                <span className="text-gray-600">
                                    {lake.fishTypes.join(", ")}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-gray-700">Max Weight</span>
                                <span className="text-gray-600">{lake.maxWeight} kg</span>
                            </div>

                            <div className="flex flex-col col-span-2">
                                <span className="font-medium text-gray-700">Description</span>
                                <span className="text-gray-600">{lake.description}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            {/* <button
                                className="mt-4 px-4 py-2 bg-[#ae7a31] text-white rounded hover:bg-blue-600  bottom-4 right-4"
                                onClick={() => {
                                    handleFollowLake(lake._id, true, setLoading, handleFollow);
                                }}
                            >
                                Add to Profile
                            </button>*/}
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 py-4">Fish Stocks</h2>
                    {fishStocks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {fishStocks.map((fish) => (
                                <div
                                    key={fish?._id}
                                    className="border bg-white rounded-2xl shadow-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
                                >
                                    {fish?.image && (
                                        <img
                                            src={fish?.image}
                                            alt={fish?.name}
                                            className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setHoveredImage(fish.image)}
                                        />
                                    )}
                                    <div className="w-full">
                                        <h3 className="text-lg font-bold text-gray-900">{fish?.name}</h3>
                                        <p className="text-gray-600 mt-1">Species: {fish?.species}</p>
                                        <p className="text-gray-600">Weight: {fish?.weight} lbs</p>
                                        <p className="text-gray-500 text-sm">
                                            Date Added: {new Date(fish?.dateAdded).toLocaleDateString()}
                                        </p>
                                        {fish?.averageSize && (
                                            <p className="text-gray-600">Average Size: {fish?.averageSize} cm</p>
                                        )}
                                        {fish?.notes && (
                                            <p className="text-gray-600 mt-2 italic">"{fish?.notes}"</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500 text-lg">No fish stocks available.</p>
                        </div>
                    )}
                </>
            )}

            {/* <div className="mt-4 flex justify-center">
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
            </div> */}
        </div>
    );
};

export default ManageFishStockUser;
