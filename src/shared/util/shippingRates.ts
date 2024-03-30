import { ShippingMethod } from 'shared/interfaces/shippingMethod.enum';

//PRICE DEPENDING ON SHIPPING METHOD
export const shippingRates: Record<ShippingMethod, number> = {
  [ShippingMethod.STANDARD]: 0.01,
  [ShippingMethod.EXPRESS]: 0.1,
  [ShippingMethod.NEXT_DAY]: 0.05,
  [ShippingMethod.PICKUP]: 0,
  [ShippingMethod.OTHER]: 0.01,
};
