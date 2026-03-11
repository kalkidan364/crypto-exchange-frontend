import { useState, useEffect } from 'react';
import { rand } from '../utils/formatters';

export const useOrderBook = (basePrice = 67842.50) => {
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });

  useEffect(() => {
    const generateOrders = () => {
      const asks = [];
      const bids = [];

      for (let i = 1; i <= 8; i++) {
        asks.push({
          price: basePrice + i * rand(1, 4),
          amount: rand(0.01, 2.5)
        });
        bids.push({
          price: basePrice - i * rand(1, 4),
          amount: rand(0.01, 2.5)
        });
      }

      setOrderBook({ asks, bids });
    };

    generateOrders();
    const interval = setInterval(generateOrders, 3000);

    return () => clearInterval(interval);
  }, [basePrice]);

  return orderBook;
};
