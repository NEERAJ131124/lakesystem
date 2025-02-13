import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = () => {
    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState(null);
    const cropperRef = useRef(null);

    // Handle Image Upload
    const onChange = (e) => {
        e.preventDefault();
        let files = e.target.files || e.dataTransfer.files;
        if (files.length === 0) return;

        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(files[0]);
    };

    // Get Cropped Image Data
    const getCropData = () => {
        if (!cropperRef.current) return;
        const cropper = cropperRef.current.cropper;
        setCropData(cropper.getCroppedCanvas().toDataURL());
    };

    // Download Cropped Image
    const downloadCroppedImage = () => {
        if (!cropData) return;
        const link = document.createElement("a");
        link.href = cropData;
        link.download = "cropped-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Image Cropper</h2>

            <div className="flex flex-col items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />

                {image && (
                    <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <Cropper
                            ref={cropperRef}
                            style={{ height: 400, width: "100%" }}
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={image}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive
                            autoCropArea={1}
                            checkOrientation={false}
                            guides
                        />
                    </div>
                )}

                <div className="w-full flex justify-between gap-4 mt-4">
                    <button
                        onClick={getCropData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Crop Image
                    </button>
                    {cropData && (
                        <button
                            onClick={downloadCroppedImage}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Download Cropped Image
                        </button>
                    )}
                </div>

                {cropData && (
                    <div className="mt-4 w-full flex flex-col items-center">
                        <h3 className="text-lg font-medium">Cropped Image Preview</h3>
                        <img src={cropData} alt="Cropped" className="mt-2 rounded-lg shadow-lg max-w-xs" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCropper;
