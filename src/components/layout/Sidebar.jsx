import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

const Sidebar = () => {
  const location = useLocation();

  const getNavPath = (itemId) => {
    const pathMap = {
      'dashboard': '/dashboard',
      'markets': '/markets',
      'trade': '/trade',
      'history': '/history',
      'assets': '/assets',
      'analytics': '/analytics',
      'reports': '/reports',
      'staking': '/staking',
      'nfts': '/nfts'
    };
    return pathMap[itemId] || '/dashboard';
  };

  const isActive = (itemId) => {
    const path = getNavPath(itemId);
    return location.pathname === path;
  };

  return (
    <nav className="sidebar">
      {/* Markets Section */}
      <div className="nav-section">
        <div className="nav-label">Markets</div>
        {NAV_ITEMS.markets.map(item => (
          <Link 
            key={item.id} 
            to={getNavPath(item.id)}
            className={`nav-item ${isActive(item.id) ? 'active' : ''}`}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
            {item.badge && (
              <span className={`nav-badge ${item.badgeColor || ''}`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Portfolio Section */}
      <div className="nav-section">
        <div className="nav-label">Portfolio</div>
        {NAV_ITEMS.portfolio.map(item => (
          <Link 
            key={item.id} 
            to={getNavPath(item.id)}
            className={`nav-item ${isActive(item.id) ? 'active' : ''}`}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </Link>
        ))}
      </div>

      {/* DeFi Section */}
      <div className="nav-section">
        <div className="nav-label">DeFi</div>
        {NAV_ITEMS.defi.map(item => (
          <Link 
            key={item.id} 
            to={getNavPath(item.id)}
            className={`nav-item ${isActive(item.id) ? 'active' : ''}`}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Portfolio Mini */}
      <div className="sidebar-bottom">
        <div className="portfolio-mini">
          <div className="portfolio-mini-label">Total Balance</div>
          <div className="portfolio-mini-value">$84,291</div>
          <div className="portfolio-mini-change">▲ +$2,341 today</div>
        </div>
      </div>
    </nav>
  );
};

// Simple icon component
const NavIcon = ({ type }) => {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    chart: <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    box: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    circle: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {icons[type]}
    </svg>
  );
};

export default Sidebar;
