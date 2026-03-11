import { useState, useEffect } from 'react';
import { COINS } from '../utils/constants';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState(COINS);

  useEffect(() => {
    // Simulate live market data updates
    const interval = setInterval(() => {
      setMarketData(prevData =>
        prevData.map(coin => ({
          ...coin,
          price: coin.price * (1 + (Math.random() - 0.5) * 0.001),
          change: coin.change + (Math.random() - 0.5) * 0.1
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return marketData;
};
