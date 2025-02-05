import React from 'react';

const WeatherCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    {icon}
    <div>
      <h3 className="text-lg font-semibold text-carp-700">{title}</h3>
      <p className="text-2xl font-bold text-carp-900">{value}</p>
    </div>
  </div>
);

export default WeatherCard;

