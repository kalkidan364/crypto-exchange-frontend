import React from 'react';
import { useNavigate } from 'react-router-dom';
import TickerScroll from '../common/TickerScroll';

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="logo">
        NEX<span>US</span>
      </div>
      
      <TickerScroll />
      
      <div className="topbar-actions">
        <button className="btn-ghost" onClick={() => navigate('/deposit')}>Deposit</button>
        <button className="btn-primary" onClick={() => navigate('/trade')}>Trade Now</button>
        <div className="avatar">JD</div>
      </div>
    </header>
  );
};

export default Topbar;
