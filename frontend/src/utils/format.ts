export const formatINR = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString();
};

export const formatMetric = (value: number, metric: string): string => {
  return value.toFixed(4);
};

export const truncate = (str: string, len: number): string => {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
};
