import React from "react";

/**
 * API data loader for section-specific content
 * @param {Object} props
 * @param {string} props.height - Height of the loading container
 * @param {string} props.className - Additional CSS classes
 */
const Loader = ({ height = "200px", className = "" }) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ height }}
    >
      <div className="loader"></div>
    </div>
  );
};

/**
 * Full screen loader for auth and initial page loads
 */
export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
