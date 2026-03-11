// Market data
export const COINS = [
  { rank: 1, name: 'Bitcoin', ticker: 'BTC', icon: '₿', color: '#f7931a', bg: '#1a0f00', price: 67842.50, change: 1.86, vol: '$28.4B' },
  { rank: 2, name: 'Ethereum', ticker: 'ETH', icon: 'Ξ', color: '#627eea', bg: '#0a0b18', price: 3541.20, change: 2.34, vol: '$14.2B' },
  { rank: 3, name: 'Solana', ticker: 'SOL', icon: '◎', color: '#9945ff', bg: '#12002f', price: 172.85, change: -0.82, vol: '$5.1B' },
  { rank: 4, name: 'BNB', ticker: 'BNB', icon: 'B', color: '#f3ba2f', bg: '#1a1200', price: 412.30, change: 0.45, vol: '$2.8B' },
  { rank: 5, name: 'XRP', ticker: 'XRP', icon: '✕', color: '#00aae4', bg: '#001018', price: 0.5821, change: -1.21, vol: '$1.9B' },
  { rank: 6, name: 'AVAX', ticker: 'AVAX', icon: 'A', color: '#e84142', bg: '#1a0000', price: 38.42, change: 3.12, vol: '$0.9B' },
];

// Portfolio allocation
export const PORTFOLIO = [
  { name: 'Bitcoin', pct: 52, color: '#f7931a' },
  { name: 'Ethereum', pct: 24, color: '#627eea' },
  { name: 'Solana', pct: 14, color: '#9945ff' },
  { name: 'Others', pct: 10, color: '#00e5ff' },
];

// Navigation items
export const NAV_ITEMS = {
  markets: [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid', active: true },
    { id: 'markets', label: 'Markets', icon: 'chart' },
    { id: 'trade', label: 'Trade', icon: 'dollar', badge: 'NEW', badgeColor: 'green' },
    { id: 'history', label: 'History', icon: 'clock' },
  ],
  portfolio: [
    { id: 'assets', label: 'Assets', icon: 'box' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    { id: 'reports', label: 'Reports', icon: 'file', badge: '3' },
  ],
  defi: [
    { id: 'staking', label: 'Staking', icon: 'layers' },
    { id: 'nfts', label: 'NFTs', icon: 'circle' },
  ],
};
