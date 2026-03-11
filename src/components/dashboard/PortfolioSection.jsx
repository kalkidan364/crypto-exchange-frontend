import React, { useEffect, useRef } from 'react';
import { PORTFOLIO } from '../../utils/constants';

const PortfolioSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawDonut();
  }, []);

  const drawDonut = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cx = 50, cy = 50, r = 38, inner = 26;
    let start = -Math.PI / 2;

    PORTFOLIO.forEach(p => {
      const angle = (p.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.arc(cx, cy, inner, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      start += angle + 0.02;
    });
  };

  return (
    <div className="portfolio-section">
      <div className="section-header">
        <div className="section-title">Portfolio Allocation</div>
        <a href="#" className="section-action">MANAGE →</a>
      </div>
      <div className="portfolio-grid">
        <div className="donut-wrap">
          <canvas ref={canvasRef} width="100" height="100"></canvas>
          <div className="donut-label">
            <div className="donut-label-val">$84K</div>
            <div className="donut-label-sub">TOTAL</div>
          </div>
        </div>
        <div className="portfolio-list">
          {PORTFOLIO.map((item, index) => (
            <div key={index} className="portfolio-item">
              <div className="portfolio-dot" style={{ background: item.color }}></div>
              <div className="portfolio-name">{item.name}</div>
              <div className="portfolio-pct">{item.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;
