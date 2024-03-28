import { CategoryProducts } from 'shared/interfaces/categoryProducts.enum';

export const taxRates: Record<CategoryProducts, number> = {
  [CategoryProducts.ELECTRONICS]: 0.18,
  [CategoryProducts.CLOTHING]: 0.09,
  [CategoryProducts.FURNITURE]: 0.15,
  [CategoryProducts.FOOD]: 0.19,
  [CategoryProducts.BOOKS]: 0.05,
  [CategoryProducts.TOYS]: 0.2,
  [CategoryProducts.OTHERS]: 0.08,
  [CategoryProducts.UNCATEGORIZED]: 0.11,
};
