import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Team, Mission, Vision } from "lucide-react";
import StorySection from "../components/StorySection";
import l0 from "../assets/wlake.jpg";

const AboutUs = () => {
  const storyContent = [
    {
      title: "Hooked at Eleven",
      content:
        "Alex Mollart first discovered the thrill of angling at age eleven, standing knee-deep in a small, reedy pond near his childhood home. The gentle chirping of insects and the soft lapping of water against the bank provided a symphony that captured his heart. Every bite on the line felt electric, as if time slowed to a standstill whenever a fish teased the bait. Although it began as a simple hobby—an escape from homework and household chores—the youthful excitement Alex experienced was truly transformative. Fishing became his gateway to understanding patience and respecting the rhythm of nature. Even at such a young age, he sensed he'd stumbled upon a lifelong passion, one that would eventually take him around the world and lead to innovative new ideas in the angling community.",
      imageSrc: "/images/young-boy-fishing.jpg",
      imageAlt: "Young boy fishing in a small pond",
    },
    {
      title: "The Early Adventures",
      content:
        "In his late teens, Alex ventured beyond the cozy pond of his childhood, exploring local canals and broad riverways. With every cast, he sought new species and greater challenges—carp, barbel, pike—each offering a lesson in skill and perseverance. He'd rise before sunrise on weekends, the anticipation fueling him long before the day's first light. Countless hours at the water's edge taught him how nature could both reward and humble an angler. It wasn't always about landing the biggest fish; sometimes, the true victory came from embracing the peaceful solitude of the moment. By the time he headed off to college, Alex's tackle bag was as essential as his textbooks, and his friends knew better than to schedule events that conflicted with his precious fishing slots.",
      imageSrc: "/images/canal-fishing.jpg",
      imageAlt: "Scenic view of canals and riverways",
    },
    {
      title: "Far and Wide",
      content:
        "As Alex entered adulthood, his restless curiosity propelled him further afield. Weekend trips morphed into weeklong expeditions across the UK and abroad, where he found expansive lakes and hidden gravel pits that beckoned with the promise of record-breaking fish. Each new body of water presented a puzzle—different ecosystems, unique fish behaviors, and regional fishing traditions that Alex absorbed like a sponge. He formed unlikely bonds with fellow anglers, exchanging tales of triumphant catches and those that got away. This shared camaraderie across language barriers and national borders shaped Alex's understanding of angling as a unifying passion. He'd return home with not just bigger fish on his record, but also deeper respect for how this sport could connect people from vastly different walks of life.",
      imageSrc: "/images/large-lake.jpg",
      imageAlt: "Panoramic shot of a large lake",
    },
    {
      title: "A Vision Takes Shape",
      content:
        "By his mid-thirties, Alex's dedication had transformed him from weekend enthusiast to recognized authority in the angling world. Yet he saw challenges emerging—lakes becoming busier, fish stocks needing better tracking, and new anglers eager for authentic guidance. Watching technology evolve, he sensed an opportunity to enhance the angling experience through a modern, digital platform. After countless late-night chats with fishing buddies, he drafted the blueprint for a comprehensive solution. It wasn't only about providing anglers with interactive lake maps; it was about empowering lake owners to manage their stocks responsibly and building a community where sharing catches and insights became a collective triumph. His vision was as ambitious as it was heartfelt, reflecting a genuine love for the sport and the people who shared it.",
      imageSrc: "/images/tech-fishing.jpg",
      imageAlt: "Alex using a laptop by a lake",
    },
    {
      title: "The Birth of Carpbook",
      content:
        "At forty-nine, Alex realized the time was right to bring his lifelong dream to life. Carpbook began as a humble concept—an online space where anglers and lake owners could collaborate. But it quickly grew into a powerful tool, capable of tracking fish populations, sharing real-time catch updates, and documenting the stories behind each memorable outing. For Alex, Carpbook is the culmination of decades spent kneeling at the water's edge, patiently waiting for the telltale tug on the line. It's his gift to the angling community: a fusion of old-school passion and innovative technology, designed to help everyone—from curious newcomers to veteran carp hunters—embrace the thrill of the catch and the bond that only fellow anglers can truly understand.",
      imageSrc: "/images/carpbook-collage.jpg",
      imageAlt: "Collage of fishing scenes and Carpbook interface",
    },
  ];

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
                src="/images/team-member-1.jpg"
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
                src="/images/team-member-2.jpg"
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
                src="/images/team-member-3.jpg"
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
