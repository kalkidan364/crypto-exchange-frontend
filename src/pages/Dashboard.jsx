import React from 'react';
import ChartHero from '../components/dashboard/ChartHero';
import StatsRow from '../components/dashboard/StatsRow';
import PortfolioSection from '../components/dashboard/PortfolioSection';
import MarketTable from '../components/dashboard/MarketTable';

const Dashboard = () => {
  return (
    <main className="main-content">
      <ChartHero />
      <StatsRow />
      <PortfolioSection />
      <MarketTable />
    </main>
  );
};

export default Dashboard;
