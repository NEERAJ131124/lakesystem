import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Team, Mission, Vision } from "lucide-react";
import StorySection from "../components/StorySection";
import l0 from "../assets/wlake.jpg";
import d1 from "../assets/d (1).png";
import d2 from "../assets/d (2).png";
import d3 from "../assets/d (3).png";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ minHeight: "500px" }}>
        <img
          src={l0}
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              About Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Learn more about CarpBook, our mission, vision, and the team
              behind it.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <Mission className="w-12 h-12 text-carp-600 mx-auto mb-4" /> */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              At CarpBook, our mission is to connect carp fishing enthusiasts
              with the best fishing spots and provide a platform for lake owners
              to showcase their lakes.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <Vision className="w-12 h-12 text-carp-600 mx-auto mb-4" /> */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Our vision is to become the go-to platform for carp fishing
              enthusiasts and lake owners, fostering a community of passionate
              anglers and providing valuable resources for successful fishing
              experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <Team className="w-12 h-12 text-carp-600 mx-auto mb-4" /> */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-lg leading-8 text-gray-600 mb-12">
              Our dedicated team is passionate about carp fishing and committed
              to providing the best experience for our users.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={d3}
                alt="Team Member 1"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                John Doe
              </h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={d1}
                alt="Team Member 2"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Jane Smith
              </h3>
              <p className="text-gray-600">Chief Marketing Officer</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={d2}
                alt="Team Member 3"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mark Johnson
              </h3>
              <p className="text-gray-600">Head of Product</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-lg leading-8 text-gray-600 mb-12">
              Have any questions or feedback? We'd love to hear from you!
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-carp-600 text-white rounded-md hover:bg-carp-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
