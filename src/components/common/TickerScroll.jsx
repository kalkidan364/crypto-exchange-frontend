import React from 'react';
import { COINS } from '../../utils/constants';

const TickerScroll = () => {
  // Double the coins for seamless loop
  const allCoins = [...COINS, ...COINS];

  return (
    <div className="ticker-scroll">
      <div className="ticker-inner">
        {allCoins.map((coin, index) => {
          const isUp = coin.change >= 0;
          return (
            <div key={index} className="tick-item">
              <span className="tick-name">{coin.ticker}</span>
              <span className="tick-price">
                {coin.price < 1 ? `$${coin.price.toFixed(4)}` : `$${coin.price.toLocaleString()}`}
              </span>
              <span className={`tick-change ${isUp ? 'up' : 'down'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TickerScroll;
