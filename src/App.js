import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Trade from './pages/Trade';
import History from './pages/History';
import Assets from './pages/Assets';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Staking from './pages/Staking';
import NFTs from './pages/NFTs';
import Deposit from './pages/Deposit';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page at root without layout */}
        <Route path="/" element={<Landing />} />
        
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin page without layout */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Main app routes with layout */}
        <Route path="/dashboard" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Dashboard />
            <RightPanel />
          </div>
        } />
        
        <Route path="/markets" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Markets />
            <RightPanel />
          </div>
        } />
        
        <Route path="/trade" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Trade />
            <RightPanel />
          </div>
        } />
        
        <Route path="/history" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <History />
            <RightPanel />
          </div>
        } />
        
        <Route path="/assets" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Assets />
            <RightPanel />
          </div>
        } />
        
        <Route path="/analytics" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Analytics />
            <RightPanel />
          </div>
        } />
        
        <Route path="/reports" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Reports />
            <RightPanel />
          </div>
        } />
        
        <Route path="/staking" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Staking />
            <RightPanel />
          </div>
        } />
        
        <Route path="/nfts" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <NFTs />
            <RightPanel />
          </div>
        } />
        
        <Route path="/deposit" element={
          <div className="layout">
            <Topbar />
            <Sidebar />
            <Deposit />
            <RightPanel />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
