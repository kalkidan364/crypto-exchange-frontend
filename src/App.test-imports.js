// Test file to check each import individually
import React from 'react';

// Test layout components
console.log('Testing Topbar...');
import Topbar from './components/layout/Topbar';
console.log('Topbar:', Topbar);

console.log('Testing Sidebar...');
import Sidebar from './components/layout/Sidebar';
console.log('Sidebar:', Sidebar);

console.log('Testing RightPanel...');
import RightPanel from './components/layout/RightPanel';
console.log('RightPanel:', RightPanel);

// Test page components
console.log('Testing Dashboard...');
import Dashboard from './pages/Dashboard';
console.log('Dashboard:', Dashboard);

console.log('Testing Markets...');
import Markets from './pages/Markets';
console.log('Markets:', Markets);

console.log('Testing Trade...');
import Trade from './pages/Trade';
console.log('Trade:', Trade);

console.log('Testing History...');
import History from './pages/History';
console.log('History:', History);

console.log('Testing Assets...');
import Assets from './pages/Assets';
console.log('Assets:', Assets);

console.log('Testing Analytics...');
import Analytics from './pages/Analytics';
console.log('Analytics:', Analytics);

console.log('Testing Reports...');
import Reports from './pages/Reports';
console.log('Reports:', Reports);

console.log('Testing Staking...');
import Staking from './pages/Staking';
console.log('Staking:', Staking);

console.log('Testing NFTs...');
import NFTs from './pages/NFTs';
console.log('NFTs:', NFTs);

console.log('Testing Deposit...');
import Deposit from './pages/Deposit';
console.log('Deposit:', Deposit);

console.log('All imports successful!');
