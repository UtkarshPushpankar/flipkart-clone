export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const calculateDiscount = (price: number, mrp: number): number =>
  Math.round(((mrp - price) / mrp) * 100);
