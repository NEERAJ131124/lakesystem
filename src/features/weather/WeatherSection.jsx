import React, { useState, useEffect } from 'react';
import useWeather from './useWeather';
import WeatherCard from './WeatherCard';
import { CloudSun, Droplets, Wind, Thermometer, Cloud, CloudRain, CloudLightning, Sun, CloudSnow, CloudFog, Search, Gauge, Sunrise, Sunset, MapPin } from 'lucide-react';

const WeatherSection = () => {
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { weather, loading, error, updateLocation } = useWeather({ lat: 54.1289, lon: -2.7881 }); // Carnforth, UK coordinates

  const getWeatherIcon = (weatherCode) => {
    switch (true) {
      case weatherCode >= 200 && weatherCode < 300:
        return <CloudLightning className="w-8 h-8 text-carp-600" />;
      case weatherCode >= 300 && weatherCode < 600:
        return <CloudRain className="w-8 h-8 text-carp-600" />;
      case weatherCode >= 600 && weatherCode < 700:
        return <CloudSnow className="w-8 h-8 text-carp-600" />;
      case weatherCode >= 700 && weatherCode < 800:
        return <CloudFog className="w-8 h-8 text-carp-600" />;
      case weatherCode === 800:
        return <Sun className="w-8 h-8 text-carp-600" />;
      case weatherCode > 800:
        return <Cloud className="w-8 h-8 text-carp-600" />;
      default:
        return <CloudSun className="w-8 h-8 text-carp-600" />;
    }
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (locationInput.length > 2) {
      const mockSuggestions = [
        `${locationInput}`,
        `${locationInput} Town`,
        `${locationInput} Village`
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [locationInput]);

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=6527397b68ff05453c9c924dfb99e195`);
      const data = await response.json();
      if (data.length > 0) {
        updateLocation({ lat: data[0].lat, lon: data[0].lon });
        setLocationInput('');
        setSuggestions([]);
      } else {
        throw new Error('Location not found');
      }
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setLocationInput(suggestion);
    setSuggestions([]);
    try {
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${suggestion}&limit=1&appid=6527397b68ff05453c9c924dfb99e195`);
      const data = await response.json();
      if (data.length > 0) {
        updateLocation({ lat: data[0].lat, lon: data[0].lon });
        setLocationInput('');
      }
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  return (
    <section className="bg-carp-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-3xl font-bold text-carp-800">Current Fishing Weather</h2>
          {weather && (
            <div className="flex items-center mt-4 sm:mt-0">
              <MapPin className="w-5 h-5 text-carp-600 mr-2" />
              <span className="text-lg font-medium text-carp-700">
                {weather.name}, {weather.sys.country}
              </span>
            </div>
          )}
        </div>

        <div className="relative mb-8">
          <form onSubmit={handleLocationSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Search for a location..."
                className="w-full px-4 py-2 rounded-md border-2 border-carp-300 focus:outline-none focus:border-carp-500 pr-10"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-carp-500 hover:text-carp-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-carp-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && <div className="text-center py-4">Loading weather data...</div>}
        {error && <div className="text-center py-4 text-carp-600">Enter your location to see weather information</div>}
        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <WeatherCard
              icon={<Thermometer className="w-8 h-8 text-carp-600" />}
              title="Temperature"
              value={`${Math.round(weather.main.temp)}°C`}
            />
            <WeatherCard
              icon={<Thermometer className="w-8 h-8 text-carp-600" />}
              title="Feels Like"
              value={`${Math.round(weather.main.feels_like)}°C`}
            />
            <WeatherCard
              icon={<Droplets className="w-8 h-8 text-carp-600" />}
              title="Humidity"
              value={`${weather.main.humidity}%`}
            />
            <WeatherCard
              icon={<Wind className="w-8 h-8 text-carp-600" />}
              title="Wind Speed"
              value={`${Math.round(weather.wind.speed * 3.6)} km/h`}
            />
            <WeatherCard
              icon={<Gauge className="w-8 h-8 text-carp-600" />}
              title="Air Pressure"
              value={`${weather.main.pressure} hPa`}
            />
            <WeatherCard
              icon={<Sunrise className="w-8 h-8 text-carp-600" />}
              title="Sunrise"
              value={formatTime(weather.sys.sunrise)}
            />
            <WeatherCard
              icon={<Sunset className="w-8 h-8 text-carp-600" />}
              title="Sunset"
              value={formatTime(weather.sys.sunset)}
            />
            <WeatherCard
              icon={getWeatherIcon(weather.weather[0].id)}
              title="Conditions"
              value={capitalizeWords(weather.weather[0].description)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default WeatherSection;

