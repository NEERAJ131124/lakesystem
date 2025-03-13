import imageCompression from "browser-image-compression";

export const compressImage = async (file, setLoading, maxSizeMB = 1, maxWidthOrHeight = 1920) => {
  if (!file) throw new Error("No file provided");

  console.log("Original File Size:", (file.size / 1024 / 1024).toFixed(2), "MB");

  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true, // Improves performance
  };

  try {
    setLoading(true); // Start loading
    const compressedFile = await imageCompression(file, options);
    console.log("Compressed File Size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");
    return compressedFile;
  } catch (error) {
    console.error("Image Compression Error:", error);
    throw error;
  } finally {
    setLoading(false); // Stop loading
  }
};
