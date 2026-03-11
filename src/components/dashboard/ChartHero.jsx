import React, { useEffect, useRef, useState } from 'react';
import { useLivePrice } from '../../hooks/useLivePrice';
import { formatPrice } from '../../utils/formatters';
import { generatePriceData, drawPriceChart } from '../../utils/chartHelpers';

const ChartHero = () => {
  const canvasRef = useRef(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const price = useLivePrice(67842.50);
  const change = 1.86;

  const timeframes = ['1m', '5m', '15m', '1H', '1D', '1W', '1M', '1Y'];

  useEffect(() => {
    const data = generatePriceData(67842, 120);
    drawPriceChart(canvasRef.current, data, 'rgba(0,229,255,0.8)');
    
    const handleResize = () => {
      const data = generatePriceData(67842, 120);
      drawPriceChart(canvasRef.current, data, 'rgba(0,229,255,0.8)');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTimeframe]);

  return (
    <div className="chart-hero">
      <div className="chart-hero-header">
        <div className="asset-info">
          <div className="asset-icon">₿</div>
          <div>
            <div className="asset-name">Bitcoin</div>
            <div className="asset-ticker">BTC / USDT • Spot</div>
          </div>
        </div>
        <div className="asset-price-block">
          <div className="asset-price">{formatPrice(price)}</div>
          <div className={`asset-change ${change >= 0 ? '' : 'neg'}`}>
            {change >= 0 ? '▲' : '▼'} +$1,241.30 (+{change}%)
          </div>
        </div>
      </div>

      <div className="chart-timeframes">
        {timeframes.map(tf => (
          <button
            key={tf}
            className={`tf-btn ${activeTimeframe === tf ? 'active' : ''}`}
            onClick={() => setActiveTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="chart-area">
        <canvas ref={canvasRef}></canvas>
        <div className="chart-gradient-overlay"></div>
      </div>
    </div>
  );
};

export default ChartHero;
