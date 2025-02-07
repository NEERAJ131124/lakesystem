import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../constants/APIs";
import { MapPin, Fish, Target } from "lucide-react";
import Loader from "../components/Loader";
import l0 from "../assets/wlake.jpg";
import l1 from "../assets/l1.png";
import l2 from "../assets/l2.png";
import l3 from "../assets/l3.png";

const FeatureCard = ({ icon, title, description, imageSrc }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-carp-100 rounded-full mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const LakesPage = () => {
  const [lakes, setLakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLakes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/lakes/all`);
        setLakes(response.data);
      } catch (error) {
        console.error("Error fetching lakes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLakes();
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
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Explore Our Lakes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover the Perfect Fishing Spot from Our Curated Selection of
              Premium Carp Fishing Lakes
            </p>
          </div>
        </div>
      </div>

      {/* Lakes Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Lakes
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Explore a variety of lakes, each offering unique fishing
              experiences and beautiful surroundings.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {lakes.map((lake) => (
              <div key={lake._id} className="flex flex-col items-start">
                <div className="relative w-full">
                  <img
                    src={lake.image || l0}
                    alt={lake.name}
                    className="aspect-[16/9] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
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

      {/* Additional Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Lakes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-carp-600" />}
              title="Prime Locations"
              description="Our lakes are situated in prime locations, offering easy access and beautiful surroundings."
              imageSrc={l1}
            />
            <FeatureCard
              icon={<Fish className="w-6 h-6 text-carp-600" />}
              title="Rich Fish Stock"
              description="Enjoy fishing in lakes stocked with a variety of fish species, ensuring a rewarding experience."
              imageSrc={l2}
            />
            <FeatureCard
              icon={<Target className="w-6 h-6 text-carp-600" />}
              title="Top Facilities"
              description="Our lakes are equipped with top-notch facilities, including parking, toilets, and cafes."
              imageSrc={l3}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Visitors Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "The best fishing experience I've ever had! The lake was
                beautiful and well-stocked."
              </p>
              <p className="text-gray-900 font-semibold">- John Doe</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "Amazing facilities and friendly staff. I will definitely come
                back!"
              </p>
              <p className="text-gray-900 font-semibold">- Jane Smith</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "A perfect spot for a weekend getaway. Highly recommended!"
              </p>
              <p className="text-gray-900 font-semibold">- Mark Johnson</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LakesPage;
