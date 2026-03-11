import React from 'react';

const Sparkline = ({ data, color, width = 70, height = 28 }) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min + 1;

  const toX = (i) => (i / (data.length - 1)) * width;
  const toY = (v) => height - ((v - min) / range) * height * 0.8 - height * 0.1;

  const points = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
