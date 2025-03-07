import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/APIs";
import toast, { Toaster } from "react-hot-toast";

const Catch = () => {
  const params = useParams();
  const navigate = useNavigate();
  const lakeId = params.id;

  return (
    <div className="p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">About Lake</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Catch;
