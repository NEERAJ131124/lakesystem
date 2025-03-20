import React from "react";

/**
 * ApiDataLoader component for displaying loading state during API calls
 * 
 * @param {Object} props
 * @param {string} props.height - Height of the loader container
 * @param {string} props.width - Width of the loader container (default: '100%')
 * @param {string} props.className - Additional CSS classes for styling
 * @param {string} props.spinnerColor - Color of the spinner (default: '#ae7131')
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.text - Text to display below spinner
 * @param {boolean} props.transparent - Whether the background should be transparent
 */
const ApiDataLoader = ({
  height = "200px",
  width = "100%",
  className = "",
  spinnerColor = "#ae7131",
  size = "md",
  text = "",
  transparent = false,
}) => {
  // Size based styling
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  const customStyles = {
    borderBottomColor: spinnerColor,
  };

  const containerStyles = {
    height,
    width,
    backgroundColor: transparent ? 'transparent' : '#f9fafb',
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center rounded-md ${className}`}
      style={containerStyles}
    >
      <div 
        className={`loader ${sizeClasses[size] || sizeClasses.md}`} 
        style={customStyles}
      ></div>
      
      {text && (
        <p className="mt-4 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

/**
 * Data table loading indicator
 */
export const TableLoader = ({ className = "", rowCount = 5 }) => (
  <ApiDataLoader 
    height="300px" 
    className={`my-4 ${className}`} 
    size="md"
    text="Loading data..."
  />
);

/**
 * Card grid loading indicator
 */
export const CardGridLoader = ({ className = "" }) => (
  <ApiDataLoader 
    height="400px" 
    className={`my-8 ${className}`} 
    size="md"
    transparent
  />
);

/**
 * Small inline loading indicator
 */
export const InlineLoader = ({ className = "" }) => (
  <ApiDataLoader 
    height="auto" 
    width="auto" 
    className={`inline-flex mx-2 ${className}`} 
    size="sm"
    transparent
  />
);

export default ApiDataLoader; 