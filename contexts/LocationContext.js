import { createContext, useEffect, useState } from 'react';

import axios from 'axios';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function locationSearch(cityName) {
      try {
        const response = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${cityName.trim()}&count=1&language=sv&format=json`
        );

        setLocation({
          name: response.data.results[0].name,
          lat: response.data.results[0].latitude,
          lon: response.data.results[0].longitude,
        });
      } catch (error) {
        console.error(error);
      }
    }
    locationSearch('Göteborg');
  }, []);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
