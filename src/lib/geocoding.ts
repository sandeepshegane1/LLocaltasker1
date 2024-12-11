import axios from 'axios';

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    return response.data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Address not found';
  }
}

export async function forwardGeocode(address: string): Promise<[number, number] | null> {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    if (response.data && response.data.length > 0) {
      return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Error forward geocoding:', error);
    return null;
  }
}
