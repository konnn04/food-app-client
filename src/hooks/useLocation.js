import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(null); // { lat, lon, address? }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy vị trí hiện tại từ GPS
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude).catch(() => null);
        const newLocation = { lat: latitude, lon: longitude, address };
        setLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
        setLoading(false);
      },
      (error) => {
        setError('Không thể lấy vị trí hiện tại');
        setLoading(false);
      }
    );
  };

  // Lưu vị trí từ địa chỉ tìm kiếm
  const setLocationFromAddress = async (lat, lon, addressText) => {
    let address = addressText;
    if (!address) {
      address = await reverseGeocode(lat, lon).catch(() => null);
    }
    const newLocation = { lat, lon, address };
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };

  // Lấy vị trí từ localStorage
  const getStoredLocation = () => {
    const stored = localStorage.getItem('userLocation');
    if (stored) {
      setLocation(JSON.parse(stored));
    }
  };

  // Reverse geocode using Nominatim
  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'vi' } });
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    return data.display_name || null;
  };

  useEffect(() => {
    getStoredLocation();
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    setLocationFromAddress,
    getStoredLocation
  };
};
