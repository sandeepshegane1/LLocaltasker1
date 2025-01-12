const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&language=en&no_annotations=0`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const components = result.components;
      
      // Log the full response to see all available fields
      console.log('OpenCage Response:', result);
      
      // Try to get street name from multiple possible fields
      const street = components.road || 
                    components.street || 
                    components.footway ||
                    components.path ||
                    components.pedestrian ||
                    components.street_name ||
                    components.residential ||
                    components.way ||
                    (result.formatted.includes('unnamed road') ? '' : result.formatted.split(',')[0]);

      const houseNumber = components.house_number || '';
      const suburb = components.suburb || 
                    components.neighbourhood || 
                    components.city_district || 
                    components.district ||
                    '';
                    
      const city = components.city || 
                  components.town || 
                  components.village || 
                  components.municipality ||
                  '';
                  
      const state = components.state || '';
      const postcode = components.postcode || '';
      const country = components.country || '';

      // Combine all parts, filtering out empty ones and 'unnamed road'
      const parts = [
        street && street !== 'unnamed road' ? `${houseNumber} ${street}`.trim() : '',
        suburb,
        city,
        state,
        postcode,
        country
      ].filter(Boolean);

      const address = parts.join(', ');
      console.log('Formatted Address:', address);
      return address;
    }
    
    return 'Location not found';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'Unable to get location';
  }
}
