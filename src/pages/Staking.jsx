import React, { useState } from 'react';
import { formatPrice, formatAmount } from '../utils/formatters';

const Staking = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedStake, setSelectedStake] = useState(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  // Mock staking opportunities
  const stakingPools = [
    { 
      id: 1, 
      asset: 'ETH', 
      name: 'Ethereum 2.0', 
      apy: 4.5, 
      duration: 'Flexible',
      minStake: 0.01,
      totalStaked: 125000,
      participants: 8234,
      risk: 'Low'
    },
    { 
      id: 2, 
      asset: 'SOL', 
      name: 'Solana Staking', 
      apy: 7.2, 
      duration: '30 days',
      minStake: 1,
      totalStaked: 450000,
      participants: 12456,
      risk: 'Low'
    },
    { 
      id: 3, 
      asset: 'ADA', 
      name: 'Cardano Pool', 
      apy: 5.8, 
      duration: 'Flexible',
      minStake: 10,
      totalStaked: 890000,
      participants: 15678,
      risk: 'Low'
    },
    { 
      id: 4, 
      asset: 'DOT', 
      name: 'Polkadot Staking', 
      apy: 12.5, 
      duration: '90 days',
      minStake: 5,
      totalStaked: 320000,
      participants: 5432,
      risk: 'Medium'
    },
    { 
      id: 5, 
      asset: 'AVAX', 
      name: 'Avalanche Validator', 
      apy: 9.3, 
      duration: '60 days',
      minStake: 25,
      totalStaked: 180000,
      participants: 3421,
      risk: 'Medium'
    },
    { 
      id: 6, 
      asset: 'MATIC', 
      name: 'Polygon Staking', 
      apy: 6.7, 
      duration: 'Flexible',
      minStake: 100,
      totalStaked: 560000,
      participants: 9876,
      risk: 'Low'
    },
  ];

  // Mock active stakes
  const activeStakes = [
    { 
      id: 'STK-001', 
      asset: 'ETH', 
      amount: 5.5, 
      apy: 4.5, 
      startDate: '2024-02-15',
      endDate: 'Flexible',
      earned: 0.0234,
      status: 'Active'
    },
    { 
      id: 'STK-002', 
      asset: 'SOL', 
      amount: 150, 
      apy: 7.2, 
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      earned: 0.8945,
      status: 'Active'
    },
    { 
      id: 'STK-003', 
      asset: 'DOT', 
      amount: 200, 
      apy: 12.5, 
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      earned: 6.234,
      status: 'Active'
    },
  ];

  const totalStaked = activeStakes.reduce((sum, stake) => {
    const prices = { ETH: 3541.20, SOL: 172.85, DOT: 7.45 };
    return sum + (stake.amount * (prices[stake.asset] || 0));
  }, 0);

  const totalEarned = activeStakes.reduce((sum, stake) => {
    const prices = { ETH: 3541.20, SOL: 172.85, DOT: 7.45 };
    return sum + (stake.earned * (prices[stake.asset] || 0));
  }, 0);

  const handleStake = (pool) => {
    setSelectedStake(pool);
    setShowStakeModal(true);
  };

  const handleConfirmStake = () => {
    console.log('Staking:', stakeAmount, selectedStake.asset);
    setShowStakeModal(false);
    setStakeAmount('');
  };

  return (
    <main className="main-content">
      <div className="staking-header">
        <div>
          <h1 className="page-title">Staking</h1>
          <p className="page-subtitle">Earn rewards by staking your crypto assets</p>
        </div>
        <div className="staking-summary">
          <div className="summary-card">
            <div className="summary-label">Total Staked</div>
            <div className="summary-value">{formatPrice(totalStaked)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Earned</div>
            <div className="summary-value earned">{formatPrice(totalEarned)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Active Stakes</div>
            <div className="summary-value">{activeStakes.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="staking-tabs">
        <button
          className={`staking-tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Pools
        </button>
        <button
          className={`staking-tab ${activeTab === 'mystakes' ? 'active' : ''}`}
          onClick={() => setActiveTab('mystakes')}
        >
          My Stakes
        </button>
      </div>

      {/* Available Pools */}
      {activeTab === 'available' && (
        <div className="staking-pools-grid">
          {stakingPools.map(pool => (
            <div key={pool.id} className="staking-pool-card">
              <div className="pool-header">
                <div className="pool-asset">
                  <div className="asset-icon">{pool.asset}</div>
                  <div>
                    <div className="pool-name">{pool.name}</div>
                    <div className="pool-asset-label">{pool.asset}</div>
                  </div>
                </div>
                <div className={`risk-badge ${pool.risk.toLowerCase()}`}>
                  {pool.risk} Risk
                </div>
              </div>

              <div className="pool-apy">
                <div className="apy-label">APY</div>
                <div className="apy-value">{pool.apy}%</div>
              </div>

              <div className="pool-details">
                <div className="detail-row">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{pool.duration}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Min. Stake</span>
                  <span className="detail-value">{pool.minStake} {pool.asset}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Staked</span>
                  <span className="detail-value">{formatPrice(pool.totalStaked)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Participants</span>
                  <span className="detail-value">{pool.participants.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className="stake-btn"
                onClick={() => handleStake(pool)}
              >
                Stake Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Stakes */}
      {activeTab === 'mystakes' && (
        <div className="my-stakes-container">
          <div className="stakes-table-container">
            <table className="stakes-table">
              <thead>
                <tr>
                  <th>Stake ID</th>
                  <th>Asset</th>
                  <th>Amount Staked</th>
                  <th>APY</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Earned</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeStakes.map(stake => (
                  <tr key={stake.id}>
                    <td className="stake-id">{stake.id}</td>
                    <td className="stake-asset">{stake.asset}</td>
                    <td className="stake-amount">
                      {formatAmount(stake.amount)} {stake.asset}
                    </td>
                    <td className="stake-apy">{stake.apy}%</td>
                    <td className="stake-date">{stake.startDate}</td>
                    <td className="stake-date">{stake.endDate}</td>
                    <td className="stake-earned positive">
                      +{formatAmount(stake.earned)} {stake.asset}
                    </td>
                    <td>
                      <span className={`status-badge ${stake.status.toLowerCase()}`}>
                        {stake.status}
                      </span>
                    </td>
                    <td>
                      <div className="stake-actions">
                        <button className="action-btn claim">Claim</button>
                        {stake.endDate === 'Flexible' && (
                          <button className="action-btn unstake">Unstake</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stake Modal */}
      {showStakeModal && selectedStake && (
        <div className="modal-overlay" onClick={() => setShowStakeModal(false)}>
          <div className="modal-content stake-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Stake {selectedStake.asset}</h2>
              <button className="modal-close" onClick={() => setShowStakeModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="stake-form">
                <div className="stake-info-card">
                  <div className="info-row">
                    <span>Pool</span>
                    <span className="info-value">{selectedStake.name}</span>
                  </div>
                  <div className="info-row">
                    <span>APY</span>
                    <span className="info-value highlight">{selectedStake.apy}%</span>
                  </div>
                  <div className="info-row">
                    <span>Duration</span>
                    <span className="info-value">{selectedStake.duration}</span>
                  </div>
                  <div className="info-row">
                    <span>Min. Stake</span>
                    <span className="info-value">{selectedStake.minStake} {selectedStake.asset}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Amount to Stake</label>
                  <div className="amount-input-group">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="amount-input"
                    />
                    <span className="input-suffix">{selectedStake.asset}</span>
                  </div>
                  <div className="balance-info">
                    Available: 10.5 {selectedStake.asset}
                  </div>
                </div>

                <div className="estimated-rewards">
                  <h4>Estimated Rewards</h4>
                  <div className="rewards-grid">
                    <div className="reward-item">
                      <span className="reward-period">Daily</span>
                      <span className="reward-amount">
                        {stakeAmount ? ((parseFloat(stakeAmount) * selectedStake.apy / 100) / 365).toFixed(6) : '0.000000'} {selectedStake.asset}
                      </span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-period">Monthly</span>
                      <span className="reward-amount">
                        {stakeAmount ? ((parseFloat(stakeAmount) * selectedStake.apy / 100) / 12).toFixed(6) : '0.000000'} {selectedStake.asset}
                      </span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-period">Yearly</span>
                      <span className="reward-amount">
                        {stakeAmount ? (parseFloat(stakeAmount) * selectedStake.apy / 100).toFixed(6) : '0.000000'} {selectedStake.asset}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  className="confirm-stake-btn"
                  onClick={handleConfirmStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) < selectedStake.minStake}
                >
                  Confirm Stake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Staking;
