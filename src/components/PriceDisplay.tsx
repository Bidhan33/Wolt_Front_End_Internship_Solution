import React from 'react';
import { PriceBreakdown } from '../utils/types';

interface PriceDisplayProps {
  priceBreakdown: PriceBreakdown;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceBreakdown }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Price breakdown</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Cart Value</span>
          <span data-raw-value={priceBreakdown.cartValue}>
            {(priceBreakdown.cartValue / 100).toFixed(2)} €
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span data-raw-value={priceBreakdown.deliveryFee}>
            {(priceBreakdown.deliveryFee / 100).toFixed(2)} €
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Delivery distance</span>
          <span data-raw-value={priceBreakdown.deliveryDistance}>
            {priceBreakdown.deliveryDistance} m
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Small order surcharge</span>
          <span data-raw-value={priceBreakdown.smallOrderSurcharge}>
            {(priceBreakdown.smallOrderSurcharge / 100).toFixed(2)} €
          </span>
        </div>
        
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total price</span>
          <span data-raw-value={priceBreakdown.totalPrice}>
            {(priceBreakdown.totalPrice / 100).toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;