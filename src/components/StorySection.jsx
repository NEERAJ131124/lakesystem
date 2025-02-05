import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StorySection = ({ title, content, imageSrc, imageAlt, isEven }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [isEven ? 100 : -100, 0, 0, isEven ? -100 : 100]
  );
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [isEven ? 10 : -10, 0, 0, isEven ? -10 : 10]);

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 sm:py-24"
      style={{ opacity }}
    >
      <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}>
        <motion.div 
          className="w-full md:w-1/2"
          style={{ x, scale, rotate }}
        >
          <h2 className="text-3xl font-bold mb-4 text-carp-800">{title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{content}</p>
        </motion.div>
        <motion.div 
          className="w-full md:w-1/2"
          style={{ x: useTransform(x, value => -value), scale, rotate: useTransform(rotate, value => -value) }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="rounded-lg shadow-xl w-full h-[300px] sm:h-[400px] object-cover"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StorySection;

