import React from 'react';
import { PriceBreakdown } from '../utils/types';

interface PriceDisplayProps {
  priceBreakdown: PriceBreakdown;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceBreakdown }) => {
  const rows = [
    { label: 'Cart Value', value: `${(priceBreakdown.cartValue / 100).toFixed(2)} €`, testId: 'cartValue' },
    { label: 'Delivery fee', value: `${(priceBreakdown.deliveryFee / 100).toFixed(2)} €`, testId: 'deliveryFee' },
    { label: 'Delivery distance', value: `${priceBreakdown.deliveryDistance} m`, testId: 'deliveryDistance' },
    { label: 'Small order surcharge', value: `${(priceBreakdown.smallOrderSurcharge / 100).toFixed(2)} €`, testId: 'surcharge' },
  ];

  return (
    <div className="bg-white/90 p-8 rounded-lg shadow-lg backdrop-blur-sm border-2 border-transparent hover:border-blue-400 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Price breakdown</h2>
      
      <div className="space-y-4">
        {rows.map(({ label, value, testId }) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-800" data-test-id={testId}>
              {value}
            </span>
          </div>
        ))}
        
        <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
          <span className="text-lg font-bold text-gray-800">Total price</span>
          <span className="text-lg font-bold text-blue-600" data-test-id="totalPrice">
            {(priceBreakdown.totalPrice / 100).toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;