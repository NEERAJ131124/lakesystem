import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WeatherSection } from "../features/weather";
import { MapPin, Fish, Target } from "lucide-react";
import { useAuth } from "../components/contexts/AuthContext";
import LakeOwnerDashboard from "../components/dashboards/LakeOwnerDashboard";

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

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (user?.userType === "lakeOwner") {
    navigate("/lake-owner-dashboard");
  } else if (user?.userType === "angler") {
    navigate("/angler-dashboard");
  } else if (user?.userType === "admin") {
    navigate("/admin-dashboard");
  }

  useEffect(() => {
    if (user) {
      if (user?.userType === "lakeOwner") {
        navigate("/lake-owner-dashboard");
      } else if (user?.userType === "angler") {
        navigate("/angler-dashboard");
      } else if (user?.userType === "admin") {
        navigate("/admin-dashboard");
      }
    }
  });
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ minHeight: "500px" }}>
        <img
          src="/images/hero-image.jpeg"
          alt="Carp fishing scene"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Welcome to Carpbook
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Your Ultimate Platform for Carp Fishing Enthusiasts and Lake
              Owners
            </p>
            <div className="mt-10 flex gap-x-6">
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-carp-600 hover:bg-carp-700 transition-all duration-300 ease-in-out"
              >
                Learn More
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What is Carpbook section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What is Carpbook?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-carp-600" />}
              title="Discover New Lakes"
              description="Explore a vast network of carp fishing locations, from hidden gems to popular hotspots."
              imageSrc="/images/discover-lakes.jpg"
            />
            <FeatureCard
              icon={<Fish className="w-6 h-6 text-carp-600" />}
              title="View Lake Stock"
              description="Get up-to-date information on lake stocks, including species, sizes, and recent catches."
              imageSrc="/images/lake-stock.jpg"
            />
            <FeatureCard
              icon={<Target className="w-6 h-6 text-carp-600" />}
              title="Capture Your Goals"
              description="Set personal fishing goals, track your progress, and celebrate your achievements."
              imageSrc="/images/goals.jpg"
            />
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <WeatherSection />

      {/* Lakes Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore Our Lakes
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Discover the Perfect Fishing Spot from Our Curated Selection of
              Premium Carp Fishing Lakes
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col items-start">
                <div className="relative w-full">
                  <img
                    src={`/placeholder.svg?height=600&width=800&text=Lake+${item}`}
                    alt={`Sample Lake ${item}`}
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
                      Sample Lake {item}
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      A Beautiful Lake Situated in Peaceful Surroundings,
                      Perfect for Carp Fishing Enthusiasts
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

export default HomePage;
