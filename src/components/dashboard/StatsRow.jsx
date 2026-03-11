import React from 'react';

const StatsRow = () => {
  const stats = [
    { label: 'Market Cap', value: '$1.34T', sub: '▲ +2.1% today', subClass: 'stat-up', valueClass: 'stat-accent', tip: '24h Market Cap' },
    { label: '24h Volume', value: '$48.6B', sub: '▲ High activity', subClass: 'stat-up', tip: '24h Volume' },
    { label: 'ATH Distance', value: '-4.2%', sub: 'ATH: $73,750', valueClass: 'stat-gold', tip: 'All-time high' },
    { label: 'BTC Dominance', value: '54.7%', sub: '▼ -0.3% 24h', subClass: 'stat-down', tip: 'BTC dominance' },
  ];

  return (
    <div className="stats-row">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card tooltip" data-tip={stat.tip}>
          <div className="stat-label">{stat.label}</div>
          <div className={`stat-value ${stat.valueClass || ''}`}>{stat.value}</div>
          <div className={`stat-sub ${stat.subClass || ''}`}>{stat.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
