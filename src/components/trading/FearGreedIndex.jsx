import React from 'react';

const FearGreedIndex = () => {
  const value = 72;
  const label = 'GREED';
  const needlePosition = 72; // percentage

  return (
    <div className="fear-greed">
      <div className="panel-title">
        Fear &amp; Greed Index
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: 'var(--muted)' }}>
          UPDATED 1H AGO
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div className="fg-value">{value}</div>
        <div className="fg-label">{label}</div>
      </div>
      <div className="fg-meter">
        <div className="fg-needle" style={{ left: `${needlePosition}%` }}></div>
      </div>
      <div className="fg-labels">
        <span>FEAR</span>
        <span>NEUTRAL</span>
        <span>GREED</span>
      </div>
    </div>
  );
};

export default FearGreedIndex;
