import React, { useState } from 'react';
import { formatPrice } from '../utils/formatters';
import '../styles/components/nfts.css';

const NFTs = () => {
  const [activeTab, setActiveTab] = useState('mynfts');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock NFT data
  const myNFTs = [
    { 
      id: 1, 
      name: 'Bored Ape #7234', 
      collection: 'Bored Ape Yacht Club',
      image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=BAYC+7234',
      price: 45.5,
      lastSale: 42.3,
      category: 'Art',
      rarity: 'Legendary'
    },
    { 
      id: 2, 
      name: 'CryptoPunk #3100', 
      collection: 'CryptoPunks',
      image: 'https://via.placeholder.com/300x300/f093fb/ffffff?text=Punk+3100',
      price: 78.2,
      lastSale: 75.0,
      category: 'Art',
      rarity: 'Epic'
    },
    { 
      id: 3, 
      name: 'Azuki #9045', 
      collection: 'Azuki',
      image: 'https://via.placeholder.com/300x300/4facfe/ffffff?text=Azuki+9045',
      price: 12.8,
      lastSale: 11.5,
      category: 'Art',
      rarity: 'Rare'
    },
    { 
      id: 4, 
      name: 'Doodle #2341', 
      collection: 'Doodles',
      image: 'https://via.placeholder.com/300x300/00f2fe/ffffff?text=Doodle+2341',
      price: 8.4,
      lastSale: 8.0,
      category: 'Art',
      rarity: 'Common'
    },
    { 
      id: 5, 
      name: 'Clone X #5678', 
      collection: 'Clone X',
      image: 'https://via.placeholder.com/300x300/43e97b/ffffff?text=CloneX+5678',
      price: 15.2,
      lastSale: 14.8,
      category: 'Gaming',
      rarity: 'Rare'
    },
    { 
      id: 6, 
      name: 'Moonbird #1234', 
      collection: 'Moonbirds',
      image: 'https://via.placeholder.com/300x300/fa709a/ffffff?text=Moonbird+1234',
      price: 22.5,
      lastSale: 21.0,
      category: 'Art',
      rarity: 'Epic'
    }
  ];

  const trendingNFTs = [
    { 
      id: 101, 
      name: 'Pudgy Penguin #4567', 
      collection: 'Pudgy Penguins',
      image: 'https://via.placeholder.com/300x300/fee140/000000?text=Pudgy+4567',
      price: 18.9,
      volume24h: 245.8,
      change24h: 12.5,
      category: 'Art'
    },
    { 
      id: 102, 
      name: 'Mutant Ape #8901', 
      collection: 'Mutant Ape Yacht Club',
      image: 'https://via.placeholder.com/300x300/30cfd0/ffffff?text=MAYC+8901',
      price: 32.4,
      volume24h: 512.3,
      change24h: -5.2,
      category: 'Art'
    },
    { 
      id: 103, 
      name: 'Otherdeed #2345', 
      collection: 'Otherdeed',
      image: 'https://via.placeholder.com/300x300/a8edea/000000?text=Otherdeed+2345',
      price: 2.8,
      volume24h: 89.4,
      change24h: 8.3,
      category: 'Virtual Land'
    }
  ];

  const filteredNFTs = (activeTab === 'mynfts' ? myNFTs : trendingNFTs).filter(nft => {
    const matchesCategory = filterCategory === 'all' || nft.category === filterCategory;
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="main-content">
      <div className="nfts-header">
        <div>
          <h1 className="page-title">NFT Marketplace</h1>
          <p className="page-subtitle">Discover, collect, and trade digital assets</p>
        </div>
        <div className="nfts-stats-mini">
          <div className="stat-mini">
            <span className="stat-mini-label">Total Volume</span>
            <span className="stat-mini-value">1,234.5 ETH</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-label">Floor Price</span>
            <span className="stat-mini-value">8.2 ETH</span>
          </div>
        </div>
      </div>

      <div className="nfts-controls">
        <div className="nfts-tabs">
          <button 
            className={`nfts-tab ${activeTab === 'mynfts' ? 'active' : ''}`}
            onClick={() => setActiveTab('mynfts')}
          >
            My NFTs ({myNFTs.length})
          </button>
          <button 
            className={`nfts-tab ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
        </div>

        <div className="nfts-filters">
          <div className="search-box">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="category-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Art">Art</option>
            <option value="Gaming">Gaming</option>
            <option value="Virtual Land">Virtual Land</option>
          </select>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filteredNFTs.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <div className="no-results-text">No NFTs found</div>
          <div className="no-results-subtext">Try adjusting your filters or search query</div>
        </div>
      ) : (
        <div className={`nfts-${viewMode}`}>
          {filteredNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} viewMode={viewMode} activeTab={activeTab} />
          ))}
        </div>
      )}
    </main>
  );
};

const NFTCard = ({ nft, viewMode, activeTab }) => {
  if (viewMode === 'list') {
    return (
      <div className="nft-list-item">
        <img src={nft.image} alt={nft.name} className="nft-list-image" />
        <div className="nft-list-info">
          <div className="nft-list-name">{nft.name}</div>
          <div className="nft-list-collection">{nft.collection}</div>
        </div>
        {activeTab === 'mynfts' && nft.rarity && (
          <div className={`nft-rarity rarity-${nft.rarity.toLowerCase()}`}>
            {nft.rarity}
          </div>
        )}
        <div className="nft-list-price">
          <div className="nft-price-label">Price</div>
          <div className="nft-price-value">{formatPrice(nft.price)} ETH</div>
        </div>
        {activeTab === 'trending' && (
          <>
            <div className="nft-list-volume">
              <div className="nft-volume-label">24h Volume</div>
              <div className="nft-volume-value">{formatPrice(nft.volume24h)} ETH</div>
            </div>
            <div className={`nft-list-change ${nft.change24h >= 0 ? 'positive' : 'negative'}`}>
              {nft.change24h >= 0 ? '+' : ''}{nft.change24h.toFixed(2)}%
            </div>
          </>
        )}
        {activeTab === 'mynfts' && (
          <div className="nft-list-actions">
            <button className="btn-action btn-sell">Sell</button>
            <button className="btn-action btn-transfer">Transfer</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="nft-card">
      <div className="nft-image-wrapper">
        <img src={nft.image} alt={nft.name} className="nft-image" />
        {activeTab === 'mynfts' && nft.rarity && (
          <div className={`nft-rarity-badge rarity-${nft.rarity.toLowerCase()}`}>
            {nft.rarity}
          </div>
        )}
        {activeTab === 'trending' && (
          <div className={`nft-change-badge ${nft.change24h >= 0 ? 'positive' : 'negative'}`}>
            {nft.change24h >= 0 ? '+' : ''}{nft.change24h.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="nft-card-content">
        <div className="nft-card-header">
          <div className="nft-name">{nft.name}</div>
          <div className="nft-collection">{nft.collection}</div>
        </div>
        <div className="nft-card-footer">
          <div className="nft-price-section">
            <span className="nft-price-label">
              {activeTab === 'mynfts' ? 'Current Price' : 'Floor Price'}
            </span>
            <span className="nft-price">{formatPrice(nft.price)} ETH</span>
          </div>
          {activeTab === 'trending' && (
            <div className="nft-volume-section">
              <span className="nft-volume-label">24h Vol</span>
              <span className="nft-volume">{formatPrice(nft.volume24h)} ETH</span>
            </div>
          )}
          {activeTab === 'mynfts' && nft.lastSale && (
            <div className="nft-last-sale">
              Last: {formatPrice(nft.lastSale)} ETH
            </div>
          )}
        </div>
        {activeTab === 'mynfts' && (
          <div className="nft-card-actions">
            <button className="btn-action btn-sell">Sell</button>
            <button className="btn-action btn-transfer">Transfer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTs;
