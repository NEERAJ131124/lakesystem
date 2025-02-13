import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StorySection from "../components/StorySection";

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
    <div className="bg-gray-50">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/images/hero-image.jpeg"
          alt="Carp fishing scene"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Discover how Carpbook became the ultimate platform for carp fishing
            enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="bg-carp-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-carp-700 transition-colors w-full sm:w-auto"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-carp-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {storyContent.map((section, index) => (
          <StorySection
            key={index}
            title={section.title}
            content={section.content}
            imageSrc={section.imageSrc}
            imageAlt={section.imageAlt}
            isEven={index % 2 === 0}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-carp-600 text-white py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Whether you're an experienced angler or just starting out, there's a
            place for you in the Carpbook community.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-carp-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
