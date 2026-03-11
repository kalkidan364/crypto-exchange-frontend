// Format price with proper decimals
export const formatPrice = (price) => {
  if (price < 1) {
    return '$' + price.toFixed(4);
  }
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Format amount
export const formatAmount = (amount) => {
  return amount.toFixed(4);
};

// Format percentage
export const formatPercent = (percent) => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

// Format large numbers (volume, market cap)
export const formatLargeNumber = (num) => {
  if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  return '$' + num.toLocaleString();
};

// Random number generator
export const rand = (min, max) => {
  return min + Math.random() * (max - min);
};

// Format time
export const formatTime = (date) => {
  return date.getHours().toString().padStart(2, '0') + ':' +
         date.getMinutes().toString().padStart(2, '0') + ':' +
         date.getSeconds().toString().padStart(2, '0');
};