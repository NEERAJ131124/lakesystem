import React, { useState } from "react";
import { useParams } from "react-router-dom";

const AddingFishStock = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fishType: "",
    weight: "",
    image: null,
    notes: "",
    lakeId: id,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setFormData({
          ...formData,
          image: file,
        });
        setImagePreview(URL.createObjectURL(file));
        setErrors({
          ...errors,
          image: "",
        });
      } else {
        setErrors({
          ...errors,
          image: "Please select an image file",
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fishType) {
      newErrors.fishType = "Please select a fish type";
    }

    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(formData.weight) || formData.weight <= 0) {
      newErrors.weight = "Please enter a valid weight";
    }

    if (!formData.image) {
      newErrors.image = "Please select an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Add Fish Stock</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="fishType" className="font-bold">
            Fish Type:
          </label>
          <select
            id="fishType"
            name="fishType"
            value={formData.fishType}
            onChange={handleInputChange}
            className={`p-2 border rounded-md text-base ${
              errors.fishType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Fish Type </option>
            <option value="type1">Carp </option>
            <option value="type2">Mirror Carp </option>
            <option value="type3">Common Carp</option>
          </select>
          {errors.fishType && (
            <span className="text-red-500 text-sm">{errors.fishType}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="weight" className="font-bold">
            Weight (lbs):
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Enter weight in lbs"
            className={`p-2 border rounded-md text-base ${
              errors.weight ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.weight && (
            <span className="text-red-500 text-sm">{errors.weight}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="font-bold">
            Fish Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className={`p-2 border rounded-md text-base ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image}</span>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Fish preview"
                className="max-w-[200px] max-h-[200px] object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className="font-bold">
            Additional Notes:
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Enter any additional notes"
            rows="4"
            className="p-2 border border-gray-300 rounded-md text-base"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#ae7a31] hover:bg-[#8e6429] text-white rounded-md cursor-pointer text-base"
        >
          Add Fish Stock
        </button>
      </form>
    </div>
  );
};

export default AddingFishStock;
