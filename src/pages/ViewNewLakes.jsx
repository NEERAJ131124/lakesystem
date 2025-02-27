import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../constants/APIs";
import Loader from "../components/Loader";
import l0 from "../assets/wlake.jpg";
import { useAuth } from "../components/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ViewNewLakes = () => {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //     const fetchLakes = async () => {
  //         try {
  //             const response = await axios.get(`${baseUrl}/api/lakes/all`);
  //             setLakes(response.data);
  //             setDate(new Date());
  //         } catch (error) {
  //             console.error("Error fetching lakes:", error);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };
  //     fetchLakes();
  // }, []);

  useEffect(() => {
    const fetchRecentLakes = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/lakes/recent?userId=${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLakes(response.data);
      } catch (error) {
        console.error("Error fetching recent lakes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLakes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ minHeight: "500px" }}>
        <img
          src={l0}
          alt="Lakes scene"
          className="absolute inset-0 w-full h-full object-fill object-center"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Recent Added Lakes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Explore our latest additions, each offering unique fishing
              experiences, stunning scenery, and premium carp fishing
              opportunities. Find your perfect fishing spot today!
            </p>
          </div>
        </div>
      </div>

      {/* Lakes Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Recent Added Lakes
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Discover the newest lakes, each providing unique fishing
              adventures and breathtaking natural beauty.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {lakes.map((lake) => (
              <div
                key={lake._id}
                className="shadow-md border p-4 rounded-md flex flex-col items-start cursor-pointer"
                onClick={() => navigate(`/fish-stock/${lake._id}`)}
              >
                <div className="relative w-full">
                  <img
                    src={lake.image || l0}
                    alt={lake.name}
                    className="aspect-[16/9] w-full rounded-lg bg-gray-100 object-fill sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime="2024-03-16" className="text-gray-500">
                      Available Now
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                      Day Tickets
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-carp-600">
                      <span className="absolute inset-0" />
                      {lake.name}
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {lake.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNewLakes;
