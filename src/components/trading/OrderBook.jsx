import React, { useState, useEffect } from 'react';
import { useLivePrice } from '../../hooks/useLivePrice';
import { formatPrice, formatAmount, rand } from '../../utils/formatters';

const OrderBook = () => {
  const basePrice = useLivePrice(67842.50);
  const [orders, setOrders] = useState({ asks: [], bids: [] });

  useEffect(() => {
    generateOrders();
    const interval = setInterval(generateOrders, 3000);
    return () => clearInterval(interval);
  }, [basePrice]);

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

    setOrders({ asks, bids });
  };

  const maxAsk = Math.max(...orders.asks.map(a => a.amount));
  const maxBid = Math.max(...orders.bids.map(b => b.amount));

  return (
    <div>
      <div className="panel-title">
        Order Book — BTC/USDT
        <div className="live-dot"></div>
      </div>
      <div className="order-book">
        <div className="ob-head">
          <span>Price</span>
          <span>Amount</span>
          <span>Total</span>
        </div>
        
        {/* Asks (Sell orders) */}
        <div>
          {[...orders.asks].reverse().map((ask, i) => (
            <div key={`ask-${i}`} className="ob-row ob-ask">
              <div className="ob-bar" style={{ width: `${(ask.amount / maxAsk * 80).toFixed(0)}%` }}></div>
              <span>{formatPrice(ask.price)}</span>
              <span style={{ textAlign: 'center' }}>{formatAmount(ask.amount)}</span>
              <span>{formatPrice(ask.price * ask.amount)}</span>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="ob-spread">
          <div className="ob-spread-price">{formatPrice(basePrice)}</div>
          <div className="ob-spread-pct">spread 0.02%</div>
        </div>

        {/* Bids (Buy orders) */}
        <div>
          {orders.bids.map((bid, i) => (
            <div key={`bid-${i}`} className="ob-row ob-bid">
              <div className="ob-bar" style={{ width: `${(bid.amount / maxBid * 80).toFixed(0)}%` }}></div>
              <span>{formatPrice(bid.price)}</span>
              <span style={{ textAlign: 'center' }}>{formatAmount(bid.amount)}</span>
              <span>{formatPrice(bid.price * bid.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
