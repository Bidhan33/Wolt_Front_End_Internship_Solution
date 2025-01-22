import { VenueData } from './types';

export const fetchVenueData = async (venueSlug: string): Promise<VenueData> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors' as RequestMode,
    };

    const [staticData, dynamicData] = await Promise.all([
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/venues/${venueSlug}/static`,
        requestOptions
      ),
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/venues/${venueSlug}/dynamic`,
        requestOptions
      )
    ]);

    if (!staticData.ok || !dynamicData.ok) {
      throw new Error('Failed to fetch venue data');
    }

    const staticJson = await staticData.json();
    const dynamicJson = await dynamicData.json();

    return {
      coordinates: staticJson.venue_raw.location.coordinates,
      basePrice: dynamicJson.venue_raw.delivery_specs.delivery_pricing.base_price,
      minimumOrder: dynamicJson.venue_raw.delivery_specs.order_minimum_no_surcharge,
      distanceRanges: dynamicJson.venue_raw.delivery_specs.delivery_pricing.distance_ranges
    };
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Error fetching venue data');
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};