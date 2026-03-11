import React from 'react';
import { COINS } from '../../utils/constants';
import Sparkline from '../common/Sparkline';
import { formatPrice } from '../../utils/formatters';
import { generateSparklineData } from '../../utils/chartHelpers';

const MarketTable = () => {
  return (
    <div>
      <div className="section-header">
        <div className="section-title">Top Assets</div>
        <a href="#" className="section-action">VIEW ALL →</a>
      </div>
      <div className="market-table">
        <div className="table-head">
          <span>#</span>
          <span>Asset</span>
          <span style={{ textAlign: 'right' }}>Price</span>
          <span style={{ textAlign: 'right' }}>24h Change</span>
          <span style={{ textAlign: 'right' }}>Volume</span>
          <span style={{ textAlign: 'right' }}>7D Chart</span>
        </div>
        <div>
          {COINS.map(coin => {
            const isUp = coin.change >= 0;
            const sparklineData = generateSparklineData(coin.price, 12, isUp);
            
            return (
              <div key={coin.rank} className="table-row">
                <span className="row-rank">{coin.rank}</span>
                <span className="row-asset">
                  <div className="coin-icon" style={{ background: coin.bg, color: coin.color }}>
                    {coin.icon}
                  </div>
                  <div>
                    <div className="coin-name">{coin.name}</div>
                    <div className="coin-ticker">{coin.ticker}</div>
                  </div>
                </span>
                <span className="row-price">{formatPrice(coin.price)}</span>
                <span className={`row-change ${isUp ? 'stat-up' : 'stat-down'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
                </span>
                <span className="row-volume">{coin.vol}</span>
                <span className="row-sparkline">
                  <Sparkline 
                    data={sparklineData} 
                    color={isUp ? '#00e87a' : '#ff3b6b'} 
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketTable;
