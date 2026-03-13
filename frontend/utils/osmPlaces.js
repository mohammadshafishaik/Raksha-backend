// frontend/utils/osmPlaces.js

// Nominatim API base URL for searching OpenStreetMap data
const NOMINATIM_API_BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Fetches nearby places of a specific type (e.g., 'police', 'hospital') using Nominatim.
 * @param {number} latitude - Current latitude.
 * @param {number} longitude - Current longitude.
 * @param {string} query - Keyword to search for (e.g., 'police', 'hospital').
 * @param {number} radius - Search radius in meters (approximate, based on bounding box).
 * @returns {Promise<Array>} - Array of place objects.
 */
export const fetchNearbyPlaces = async (latitude, longitude, query, radius = 5000) => {
  try {
    const latDelta = radius / 111111;
    const lonDelta = radius / (111111 * Math.cos(latitude * Math.PI / 180));

    const minLat = latitude - latDelta;
    const maxLat = latitude + latDelta;
    const minLon = longitude - lonDelta;
    const maxLon = longitude + lonDelta;

    const url = `${NOMINATIM_API_BASE_URL}?q=${query}&format=json&limit=10&addressdetails=1&extratags=1&bounded=1&viewbox=${minLon},${minLat},${maxLon},${maxLat}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RakshaSafetyApp/1.0 (raksha-safety-app@example.com)'
      }
    });
    const data = await response.json();

    return data.map(item => ({
      place_id: item.place_id,
      name: item.display_name.split(',')[0] || item.name,
      vicinity: item.address ? Object.values(item.address).join(', ') : item.display_name,
      geometry: {
        location: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      },
      type: item.type
    }));
  } catch (error) {
    console.error(`Error fetching nearby ${query}s from Nominatim:`, error);
    return [];
  }
};
