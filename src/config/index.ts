export const config = {
  mapsApiKey: typeof window !== 'undefined' ? (window as any).ENV_MAPS_JAVASCRIPT_API_KEY || '' : '',
  placesApiKey: typeof window !== 'undefined' ? (window as any).ENV_PLACES_API_KEY || '' : '',
  directionsApiKey: typeof window !== 'undefined' ? (window as any).ENV_DIRECTION_API_KEY || '' : '',
};
