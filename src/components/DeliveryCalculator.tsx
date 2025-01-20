import React, { useState } from 'react';
import { fetchVenueData, calculateDistance } from '../utils/deliveryService';
import { PriceBreakdown } from '../utils/types';
import PriceDisplay from './PriceDisplay';
import flatLay from '../images/high-angle-forklift-blue-background.jpg' // Import the image

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
    totalPrice: 1190,
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
        (r) => distance >= r.min && (r.max === 0 || distance < r.max)
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
        totalPrice: cartValueCents + deliveryFee + smallOrderSurcharge,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat p-8"
      style={{ backgroundImage: `url(${flatLay})` }} // Use the imported image
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Calculator Section */}
        <div className="bg-white/90 p-8 rounded-lg shadow-lg backdrop-blur-sm border-2 border-transparent hover:border-blue-400 transition-all duration-300">
          <h1 className="text-3xl font-bold mb-8 text-blue-800">Delivery Calculator</h1>

          <div className="space-y-6">
            {[
              { label: 'Venue slug', value: venueSlug, onChange: setVenueSlug, type: 'text', testId: 'venueSlug' },
              { label: 'Cart value (EUR)', value: cartValue, onChange: setCartValue, type: 'number', step: '0.01', testId: 'cartValue' },
              { label: 'User latitude', value: latitude, onChange: setLatitude, type: 'number', step: '0.00001', testId: 'userLatitude' },
              { label: 'User longitude', value: longitude, onChange: setLongitude, type: 'number', step: '0.00001', testId: 'userLongitude' },
            ].map(({ label, value, onChange, type, step, testId }) => (
              <div key={label} className="space-y-2">
                <label className="block text-gray-700 font-medium">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                  step={step}
                  data-test-id={testId}
                />
              </div>
            ))}

            <div className="space-y-4">
              <button
                onClick={getLocation}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                data-test-id="getLocation"
              >
                Get Current Location
              </button>

              <button
                onClick={calculateDeliveryPrice}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Calculate Delivery Price'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Price Display Section */}
        <div className="h-fit sticky top-8">
          {!error && <PriceDisplay priceBreakdown={priceBreakdown} />}
        </div>
      </div>
      
    </div>
  );
};

export default DeliveryCalculator;
