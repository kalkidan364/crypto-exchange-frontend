import React from 'react';
import FearGreedIndex from '../trading/FearGreedIndex';
import OrderBook from '../trading/OrderBook';

const RightPanel = () => {
  return (
    <aside className="right-panel">
      <FearGreedIndex />
      <OrderBook />
    </aside>
  );
};

export default RightPanel;
