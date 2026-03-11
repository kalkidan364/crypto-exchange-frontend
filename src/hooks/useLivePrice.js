import { useState, useEffect } from 'react';

export const useLivePrice = (initialPrice = 67842.50) => {
  const [price, setPrice] = useState(initialPrice);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prevPrice => {
        let newPrice = prevPrice + (Math.random() - 0.49) * 30;
        newPrice = Math.max(67000, Math.min(69000, newPrice));
        return newPrice;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return price;
};
