const OPENCAGE_API_KEY = '2ad587b55c1e49f4bcfbd61d381ab0ed'; // Replace with your actual API key

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&language=en`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const components = result.components;
      
      // Construct the street address
      const houseNumber = components.house_number || '';
      const street = components.road || components.street || '';
      const city = components.city || components.town || components.village || '';
      const state = components.state || '';
      const postcode = components.postcode || '';
      const country = components.country || '';

      const streetAddress = `${houseNumber} ${street}`.trim();
      const fullAddress = [streetAddress, city, state, postcode, country].filter(Boolean).join(', ');
      
      return fullAddress || 'Exact street address not found';
    } else {
      return 'No results found';
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Unable to fetch street address';
  }
}

