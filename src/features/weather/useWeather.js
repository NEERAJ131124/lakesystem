import { useState, useEffect } from 'react';

const API_KEY = '6527397b68ff05453c9c924dfb99e195';

const useWeather = (initialLocation = null) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        if (!API_KEY) {
          throw new Error('API key is missing');
        }
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid API key');
          }
          throw new Error('Weather data not available');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeather(location.lat, location.lon);
    } else {
      setLoading(false);
    }
  }, [location]);

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  return { weather, loading, error, updateLocation };
};

export default useWeather;

