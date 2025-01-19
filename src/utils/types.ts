export interface PriceBreakdown {
    cartValue: number;
    deliveryFee: number;
    deliveryDistance: number;
    smallOrderSurcharge: number;
    totalPrice: number;
  }
  
  export interface DeliveryRange {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: null;
  }
  
  export interface VenueData {
    coordinates: [number, number];
    basePrice: number;
    minimumOrder: number;
    distanceRanges: DeliveryRange[];
  }