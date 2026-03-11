import React, { useState, useEffect } from 'react';
import { formatPrice, formatAmount, formatTime, rand } from '../../utils/formatters';

const RecentTrades = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    generateTrades();
    const interval = setInterval(generateTrades, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateTrades = () => {
    const basePrice = 67842.50;
    const newTrades = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const isUp = Math.random() > 0.4;
      const price = basePrice + (Math.random() - 0.5) * 80;
      const amount = rand(0.001, 1.2);
      const time = new Date(now - i * rand(1000, 8000));

      newTrades.push({
        price,
        amount,
        time: formatTime(time),
        isUp
      });
    }

    setTrades(newTrades);
  };

  return (
    <div className="recent-trades">
      <div className="panel-title" style={{ padding: '10px 12px 0', marginBottom: 0 }}>
        Recent Trades
        <div className="live-dot"></div>
      </div>
      <div className="rt-head">
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>
      <div>
        {trades.map((trade, index) => (
          <div key={index} className="rt-row">
            <span style={{ color: trade.isUp ? 'var(--green)' : 'var(--red)' }}>
              {formatPrice(trade.price)}
            </span>
            <span style={{ textAlign: 'center' }}>{formatAmount(trade.amount)}</span>
            <span style={{ color: 'var(--muted)' }}>{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;
