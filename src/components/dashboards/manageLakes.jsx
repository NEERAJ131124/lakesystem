import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

function ManageLakes({ lakes, onDeleteLake }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Lakes</h2>
      {lakes.length === 0 ? (
        <p className="text-gray-500">No lakes added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lakes.map(lake => (
            <div key={lake._id} className="border rounded-lg p-4 flex flex-col">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={lake.image || '/placeholder.svg?height=200&width=300'}
                  alt={lake.name}
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
              <h3 className="font-semibold text-lg">{lake.name}</h3>
              <p className="text-gray-600">{lake.location}</p>
              <p className="text-gray-600">Price: £{lake.price}/day</p>
              <div className="mt-auto pt-4 flex justify-between">
                <button 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => {/* Add edit functionality */}}
                >
                  <Edit size={18} className="mr-1" />
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 flex items-center"
                  onClick={() => onDeleteLake(lake._id)}
                >
                  <Trash2 size={18} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageLakes;

