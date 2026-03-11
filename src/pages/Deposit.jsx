import React, { useState } from 'react';
import { formatPrice } from '../utils/formatters';
import '../styles/components/deposit.css';

const Deposit = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [selectedNetwork, setSelectedNetwork] = useState('Bitcoin');
  const [amount, setAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('crypto');

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', networks: ['Bitcoin', 'Lightning Network'], minDeposit: 0.0001 },
    { symbol: 'ETH', name: 'Ethereum', networks: ['Ethereum', 'Arbitrum', 'Optimism'], minDeposit: 0.001 },
    { symbol: 'USDT', name: 'Tether', networks: ['Ethereum (ERC20)', 'Tron (TRC20)', 'BSC (BEP20)'], minDeposit: 10 },
    { symbol: 'BNB', name: 'Binance Coin', networks: ['BSC'], minDeposit: 0.01 },
    { symbol: 'SOL', name: 'Solana', networks: ['Solana'], minDeposit: 0.01 },
    { symbol: 'USDC', name: 'USD Coin', networks: ['Ethereum (ERC20)', 'Solana', 'Polygon'], minDeposit: 10 }
  ];

  const selectedCryptoData = cryptoOptions.find(c => c.symbol === selectedCrypto);
  const depositAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  return (
    <main className="main-content">
      <div className="deposit-header">
        <div>
          <h1 className="page-title">Deposit Funds</h1>
          <p className="page-subtitle">Add funds to your account</p>
        </div>
      </div>

      <div className="deposit-container">
        <div className="deposit-main">
          <div className="deposit-method-tabs">
            <button 
              className={`method-tab ${depositMethod === 'crypto' ? 'active' : ''}`}
              onClick={() => setDepositMethod('crypto')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
              Crypto Deposit
            </button>
            <button 
              className={`method-tab ${depositMethod === 'fiat' ? 'active' : ''}`}
              onClick={() => setDepositMethod('fiat')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              Bank Transfer
            </button>
          </div>

          {depositMethod === 'crypto' ? (
            <>
              <div className="deposit-section">
                <label className="deposit-label">Select Cryptocurrency</label>
                <div className="crypto-grid">
                  {cryptoOptions.map(crypto => (
                    <button
                      key={crypto.symbol}
                      className={`crypto-option ${selectedCrypto === crypto.symbol ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCrypto(crypto.symbol);
                        setSelectedNetwork(crypto.networks[0]);
                      }}
                    >
                      <div className="crypto-icon">{crypto.symbol}</div>
                      <div className="crypto-info">
                        <div className="crypto-name">{crypto.name}</div>
                        <div className="crypto-symbol">{crypto.symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="deposit-section">
                <label className="deposit-label">Select Network</label>
                <select 
                  className="network-select"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                >
                  {selectedCryptoData?.networks.map(network => (
                    <option key={network} value={network}>{network}</option>
                  ))}
                </select>
                <div className="network-warning">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  Ensure you select the correct network. Sending to wrong network may result in loss of funds.
                </div>
              </div>

              <div className="deposit-section">
                <label className="deposit-label">Deposit Address</label>
                <div className="address-box">
                  <div className="address-qr">
                    <div className="qr-placeholder">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <rect width="120" height="120" fill="#1a1d2e"/>
                        <rect x="10" y="10" width="30" height="30" fill="white"/>
                        <rect x="80" y="10" width="30" height="30" fill="white"/>
                        <rect x="10" y="80" width="30" height="30" fill="white"/>
                        <rect x="50" y="50" width="20" height="20" fill="white"/>
                      </svg>
                    </div>
                  </div>
                  <div className="address-details">
                    <div className="address-text">{depositAddress}</div>
                    <button className="btn-copy" onClick={() => navigator.clipboard.writeText(depositAddress)}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Copy Address
                    </button>
                  </div>
                </div>
              </div>

              <div className="deposit-info-cards">
                <div className="info-card">
                  <div className="info-label">Minimum Deposit</div>
                  <div className="info-value">{selectedCryptoData?.minDeposit} {selectedCrypto}</div>
                </div>
                <div className="info-card">
                  <div className="info-label">Confirmations Required</div>
                  <div className="info-value">12 blocks</div>
                </div>
                <div className="info-card">
                  <div className="info-label">Estimated Arrival</div>
                  <div className="info-value">10-30 min</div>
                </div>
              </div>
            </>
          ) : (
            <div className="fiat-deposit">
              <div className="deposit-section">
                <label className="deposit-label">Amount (USD)</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    className="amount-input"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="amount-presets">
                  {[100, 500, 1000, 5000].map(preset => (
                    <button
                      key={preset}
                      className="preset-btn"
                      onClick={() => setAmount(preset.toString())}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="deposit-section">
                <label className="deposit-label">Bank Details</label>
                <div className="bank-details">
                  <div className="bank-detail-row">
                    <span className="detail-label">Bank Name:</span>
                    <span className="detail-value">Nexus Financial Bank</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">Account Name:</span>
                    <span className="detail-value">Nexus Exchange Ltd</span>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">Account Number:</span>
                    <span className="detail-value">1234567890</span>
                    <button className="btn-copy-small" onClick={() => navigator.clipboard.writeText('1234567890')}>
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">Routing Number:</span>
                    <span className="detail-value">021000021</span>
                    <button className="btn-copy-small" onClick={() => navigator.clipboard.writeText('021000021')}>
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="bank-detail-row">
                    <span className="detail-label">SWIFT Code:</span>
                    <span className="detail-value">NEXUUS33</span>
                    <button className="btn-copy-small" onClick={() => navigator.clipboard.writeText('NEXUUS33')}>
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="fiat-notice">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div>
                  <div className="notice-title">Important Information</div>
                  <div className="notice-text">Bank transfers typically take 1-3 business days. Please include your User ID in the transfer reference.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="deposit-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Recent Deposits</h3>
            <div className="recent-deposits">
              <div className="recent-deposit-item">
                <div className="deposit-crypto">
                  <div className="deposit-crypto-icon">BTC</div>
                  <div>
                    <div className="deposit-crypto-name">Bitcoin</div>
                    <div className="deposit-time">2 hours ago</div>
                  </div>
                </div>
                <div className="deposit-amount-status">
                  <div className="deposit-amount">0.0234 BTC</div>
                  <div className="deposit-status completed">Completed</div>
                </div>
              </div>
              <div className="recent-deposit-item">
                <div className="deposit-crypto">
                  <div className="deposit-crypto-icon">ETH</div>
                  <div>
                    <div className="deposit-crypto-name">Ethereum</div>
                    <div className="deposit-time">1 day ago</div>
                  </div>
                </div>
                <div className="deposit-amount-status">
                  <div className="deposit-amount">1.5 ETH</div>
                  <div className="deposit-status completed">Completed</div>
                </div>
              </div>
              <div className="recent-deposit-item">
                <div className="deposit-crypto">
                  <div className="deposit-crypto-icon">USDT</div>
                  <div>
                    <div className="deposit-crypto-name">Tether</div>
                    <div className="deposit-time">3 days ago</div>
                  </div>
                </div>
                <div className="deposit-amount-status">
                  <div className="deposit-amount">500 USDT</div>
                  <div className="deposit-status completed">Completed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Important Notes</h3>
            <ul className="notes-list">
              <li>Send only {selectedCrypto} to this address</li>
              <li>Minimum deposit: {selectedCryptoData?.minDeposit} {selectedCrypto}</li>
              <li>12 network confirmations required</li>
              <li>Deposits arrive within 10-30 minutes</li>
              <li>Contact support if funds don't arrive</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Deposit;
