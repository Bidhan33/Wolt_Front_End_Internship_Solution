import React, { useState } from 'react';
import { fetchVenueData, calculateDistance } from '../utils/deliveryService';
import { PriceBreakdown } from '../utils/types';
import PriceDisplay from './PriceDisplay';

const DeliveryCalculator = () => {
  const [venueSlug, setVenueSlug] = useState('home-assignment-venue-helsinki');
  const [cartValue, setCartValue] = useState('10');
  const [latitude, setLatitude] = useState('60.17094');
  const [longitude, setLongitude] = useState('24.93087');
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    cartValue: 1000,
    deliveryFee: 190,
    deliveryDistance: 177,
    smallOrderSurcharge: 0,
    totalPrice: 1190
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const calculateDeliveryPrice = async () => {
    setLoading(true);
    setError('');
    
    try {
      const venueData = await fetchVenueData(venueSlug);
      const [venueLong, venueLat] = venueData.coordinates;
      
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        venueLat,
        venueLong
      );

      const range = venueData.distanceRanges.find(
        r => distance >= r.min && (r.max === 0 || distance < r.max)
      );

      if (!range || range.max === 0) {
        throw new Error('Delivery not available for this distance');
      }

      const cartValueCents = Math.round(parseFloat(cartValue) * 100);
      const smallOrderSurcharge = Math.max(0, venueData.minimumOrder - cartValueCents);
      const deliveryFee = venueData.basePrice + range.a + Math.round((range.b * distance) / 10);

      setPriceBreakdown({
        cartValue: cartValueCents,
        deliveryFee,
        deliveryDistance: distance,
        smallOrderSurcharge,
        totalPrice: cartValueCents + deliveryFee + smallOrderSurcharge
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Delivery Order Price Calculator</h1>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Details</h2>
          
          <div className="space-y-2">
            <label className="block">Venue slug</label>
            <input
              type="text"
              value={venueSlug}
              onChange={(e) => setVenueSlug(e.target.value)}
              className="w-full border rounded p-2"
              data-test-id="venueSlug"
            />
          </div>

          <div className="space-y-2">
            <label className="block">Cart value (EUR)</label>
            <input
              type="number"
              value={cartValue}
              onChange={(e) => setCartValue(e.target.value)}
              className="w-full border rounded p-2"
              step="0.01"
              data-test-id="cartValue"
            />
          </div>

          <div className="space-y-2">
            <label className="block">User latitude</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full border rounded p-2"
              step="0.00001"
              data-test-id="userLatitude"
            />
          </div>

          <div className="space-y-2">
            <label className="block">User longitude</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full border rounded p-2"
              step="0.00001"
              data-test-id="userLongitude"
            />
          </div>

          <button
            onClick={getLocation}
            className="bg-gray-200 px-4 py-2 rounded"
            data-test-id="getLocation"
          >
            Get location
          </button>

          <button
            onClick={calculateDeliveryPrice}
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Calculate delivery price
          </button>
        </div>

        {error && (
          <div className="text-red-600 p-4 bg-red-50 rounded">
            {error}
          </div>
        )}

        {!error && <PriceDisplay priceBreakdown={priceBreakdown} />}
      </div>
    </div>
  );
};

export default DeliveryCalculator;