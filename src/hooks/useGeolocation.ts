import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

export const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setError(null);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setError(error);
      setCurrentLocation(null);
    };

    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Get initial position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { currentLocation, error };
};
