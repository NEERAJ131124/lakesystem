import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function AnglerDashboard() {
  const [lakes, setLakes] = useState([]);
  const [catches, setCatches] = useState([]);
  const [newCatch, setNewCatch] = useState({ name: '', weight: '', photo: null });
  const { user } = useAuth();

  const fetchLakes = useCallback(async () => {
    try {
      const response = await axios.get('/api/lakes');
      setLakes(response.data);
    } catch (error) {
      console.error('Error fetching lakes:', error);
    }
  }, []);

  const fetchCatches = useCallback(async () => {
    try {
      const response = await axios.get('/api/fish', {
        params: { caughtBy: user.id }
      });
      setCatches(response.data);
    } catch (error) {
      console.error('Error fetching catches:', error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchLakes();
    fetchCatches();
  }, [fetchLakes, fetchCatches]);

  const handleInputChange = (e) => {
    setNewCatch({ ...newCatch, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewCatch({ ...newCatch, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newCatch.name);
    formData.append('weight', newCatch.weight);
    formData.append('photo', newCatch.photo);
    formData.append('caughtBy', user.id);

    try {
      await axios.post('/api/fish', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewCatch({ name: '', weight: '', photo: null });
      fetchCatches();
    } catch (error) {
      console.error('Error adding new catch:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Angler Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lakes Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Followed Lakes</h2>
            {lakes.length === 0 ? (
              <p className="text-gray-500">No lakes followed yet.</p>
            ) : (
              <div className="grid gap-4">
                {lakes.map(lake => (
                  <div key={lake._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{lake.name}</h3>
                    <p className="text-gray-600">{lake.location}</p>
                    <p className="text-gray-600">Price: £{lake.price}/day</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Catches Section */}
          <div className="space-y-6">
            {/* Add New Catch Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Catch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Fish Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCatch.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="weight"
                    name="weight"
                    value={newCatch.weight}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ae7a31] focus:ring-[#ae7a31] sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#ae7a31] file:text-white
                            hover:file:bg-[#8e6429]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ae7a31] hover:bg-[#8e6429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ae7a31]"
                >
                  Add Catch
                </button>
              </form>
            </div>

            {/* Catches List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Catches</h2>
              {catches.length === 0 ? (
                <p className="text-gray-500">No catches recorded yet.</p>
              ) : (
                <div className="grid gap-4">
                  {catches.map(fish => (
                    <div key={fish._id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        {fish.photo && (
                          <img 
                            src={fish.photo} 
                            alt={fish.name} 
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{fish.name}</h3>
                          <p className="text-gray-600">{fish.weight} kg</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnglerDashboard;

