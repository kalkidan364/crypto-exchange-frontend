import React, { useState, useEffect } from 'react';
import { useLivePrice } from '../../hooks/useLivePrice';
import { formatPrice } from '../../utils/formatters';

const TradePanel = () => {
  const livePrice = useLivePrice(67842.50);
  const [tradeMode, setTradeMode] = useState('buy');
  const [price, setPrice] = useState('67,842.50');
  const [amount, setAmount] = useState('0.00000');
  const [total, setTotal] = useState('0.00');
  const [fee, setFee] = useState('0.00');

  useEffect(() => {
    setPrice(formatPrice(livePrice).replace('$', ''));
  }, [livePrice]);

  useEffect(() => {
    calculateTotal();
  }, [price, amount]);

  const calculateTotal = () => {
    const p = parseFloat(price.replace(/,/g, '')) || 0;
    const a = parseFloat(amount) || 0;
    const t = p * a;
    setTotal(t.toFixed(2));
    setFee((t * 0.001).toFixed(2));
  };

  const setPct = (pct) => {
    const maxAmount = 1.2341;
    const amt = (pct / 100 * maxAmount).toFixed(5);
    setAmount(amt);
  };

  return (
    <div className="trade-panel">
      <div className="trade-tabs">
        <div
          className={`trade-tab buy ${tradeMode === 'buy' ? 'active-buy' : ''}`}
          onClick={() => setTradeMode('buy')}
        >
          BUY
        </div>
        <div
          className={`trade-tab sell ${tradeMode === 'sell' ? 'active-sell' : ''}`}
          onClick={() => setTradeMode('sell')}
        >
          SELL
        </div>
      </div>

      <div className="trade-body">
        <div className="trade-input-group">
          <div className="trade-input-label">Price (USDT)</div>
          <div className="trade-input-wrap">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <span className="trade-input-unit">USDT</span>
          </div>
        </div>

        <div className="trade-input-group">
          <div className="trade-input-label">Amount (BTC)</div>
          <div className="trade-input-wrap">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="trade-input-unit">BTC</span>
          </div>
        </div>

        <div className="trade-slider-row">
          <button className="pct-btn" onClick={() => setPct(25)}>25%</button>
          <button className="pct-btn" onClick={() => setPct(50)}>50%</button>
          <button className="pct-btn" onClick={() => setPct(75)}>75%</button>
          <button className="pct-btn" onClick={() => setPct(100)}>MAX</button>
        </div>

        <div className="trade-info">
          <div className="trade-info-row">
            <span>Available</span>
            <span>1.2341 BTC</span>
          </div>
          <div className="trade-info-row">
            <span>Total</span>
            <span>{total} USDT</span>
          </div>
          <div className="trade-info-row">
            <span>Fee (0.1%)</span>
            <span>{fee} USDT</span>
          </div>
        </div>

        <button className={tradeMode === 'buy' ? 'trade-btn-buy' : 'trade-btn-sell'}>
          {tradeMode === 'buy' ? 'BUY BTC' : 'SELL BTC'}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
