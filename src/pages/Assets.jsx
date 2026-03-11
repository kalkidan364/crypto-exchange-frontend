import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/assets.css';

const DONUT_COLORS = ['#00f5ff', '#00ff88', '#bf5fff', '#f59e0b', '#26a17b', '#3b82f6', '#e84142', '#9b59f5'];

const ASSETS = [
  { rank: 1, sym: 'BTC', name: 'Bitcoin', icon: '₿', bg: 'radial-gradient(circle,#ff9500,#f7931a)', color: '#f7931a', cat: 'spot', qty: 1.2341, price: 67842.50, chg: 1.86, chg7: 8.2, staking: false, apy: 0 },
  { rank: 2, sym: 'ETH', name: 'Ethereum', icon: 'Ξ', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', color: '#627eea', cat: 'spot', qty: 8.420, price: 3541.20, chg: 2.34, chg7: 12.1, staking: true, apy: 4.2 },
  { rank: 3, sym: 'SOL', name: 'Solana', icon: '◎', bg: 'radial-gradient(circle,#c074fc,#9945ff)', color: '#9945ff', cat: 'earn', qty: 42.00, price: 172.85, chg: -0.82, chg7: -3.4, staking: false, apy: 6.8 },
  { rank: 4, sym: 'BNB', name: 'BNB', icon: 'B', bg: 'radial-gradient(circle,#f5cc3a,#f3ba2f)', color: '#f3ba2f', cat: 'spot', qty: 14.50, price: 412.30, chg: 0.45, chg7: 2.8, staking: false, apy: 0 },
  { rank: 5, sym: 'USDT', name: 'Tether', icon: '₮', bg: 'radial-gradient(circle,#26a17b,#16634b)', color: '#26a17b', cat: 'earn', qty: 84291, price: 1.0001, chg: 0.01, chg7: 0.02, staking: false, apy: 8.5 },
  { rank: 6, sym: 'LINK', name: 'Chainlink', icon: '⬡', bg: 'radial-gradient(circle,#3b82f6,#1d4ed8)', color: '#3b82f6', cat: 'spot', qty: 120.0, price: 14.82, chg: 2.88, chg7: 9.4, staking: false, apy: 0 },
  { rank: 7, sym: 'AVAX', name: 'Avalanche', icon: 'A', bg: 'radial-gradient(circle,#ff6060,#e84142)', color: '#e84142', cat: 'staking', qty: 80.0, price: 38.42, chg: 3.12, chg7: 15.4, staking: true, apy: 11.2 },
  { rank: 8, sym: 'MATIC', name: 'Polygon', icon: '⬟', bg: 'radial-gradient(circle,#9b59f5,#7b2fe8)', color: '#9b59f5', cat: 'spot', qty: 5000, price: 0.88, chg: 1.55, chg7: 7.3, staking: false, apy: 0 },
];

const Assets = () => {
  const donutRef = useRef(null);
  const perfChartRef = useRef(null);
  
  const [assets, setAssets] = useState(ASSETS);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('value');
  const [searchTerm, setSearchTerm] = useState('');

  const assetValue = (a) => a.qty * a.price;
  const totalValue = () => assets.reduce((s, a) => s + assetValue(a), 0);

  const fmtP = (v) => {
    return v < 1 ? '$' + v.toFixed(4) : v < 100 ? '$' + v.toFixed(2) : '$' + v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    drawDonut();
    drawPerfChart();
    
    const interval = setInterval(() => {
      setAssets(prev => prev.map(a => ({
        ...a,
        price: a.price * (1 + (Math.random() - 0.499) * 0.0015)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    drawDonut();
  }, [assets]);

  const drawDonut = () => {
    const canvas = donutRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tv = totalValue();
    const cx = 80, cy = 80, r = 72, inner = 48;
    ctx.clearRect(0, 0, 160, 160);
    let start = -Math.PI / 2;
    assets.forEach((a, i) => {
      const pct = assetValue(a) / tv;
      const angle = pct * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.arc(cx, cy, inner, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = DONUT_COLORS[i];
      ctx.shadowColor = DONUT_COLORS[i];
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      start += angle + 0.015;
    });
  };

  const drawPerfChart = () => {
    const canvas = perfChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 320, H = 120;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const pts = 30;
    const data = [];
    let v = 100000;
    for (let i = 0; i < pts; i++) {
      v += (Math.random() - 0.45) * 3000;
      data.push(v);
    }
    const mn = Math.min(...data) * 0.998;
    const mx = Math.max(...data) * 1.002;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(0,245,255,.25)');
    grad.addColorStop(1, 'rgba(0,245,255,0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    data.forEach((d, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((d, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const genSpark = () => {
    const pts = 12;
    const data = [];
    let v = 50;
    for (let i = 0; i < pts; i++) {
      v += (Math.random() - 0.5) * 15;
      data.push(Math.max(10, Math.min(90, v)));
    }
    return data;
  };

  const sparkSVG = (data, up) => {
    const W = 60, H = 24;
    const mn = Math.min(...data);
    const mx = Math.max(...data);
    const path = data.map((d, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    const col = up ? '#00ff88' : '#ef4444';
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="${path}" fill="none" stroke="${col}" stroke-width="1.5"/></svg>`;
  };

  const buildExposure = () => {
    const cats = { spot: 0, earn: 0, staking: 0 };
    assets.forEach(a => {
      cats[a.cat] = (cats[a.cat] || 0) + assetValue(a);
    });
    const tv = totalValue();
    return Object.entries(cats).map(([cat, val]) => ({
      cat: cat.charAt(0).toUpperCase() + cat.slice(1),
      val,
      pct: (val / tv) * 100
    }));
  };

  const buildHeatmap = () => {
    return assets.map(a => ({
      sym: a.sym,
      chg: a.chg,
      val: assetValue(a)
    })).sort((a, b) => b.val - a.val);
  };

  const filteredAssets = assets.filter(a => {
    if (currentFilter !== 'all' && a.cat !== currentFilter) return false;
    if (searchTerm && !a.sym.toLowerCase().includes(searchTerm.toLowerCase()) && !a.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (currentSort === 'value') return assetValue(b) - assetValue(a);
    if (currentSort === 'name') return a.sym.localeCompare(b.sym);
    if (currentSort === 'change') return b.chg - a.chg;
    return 0;
  });

  const totalPL = assets.reduce((s, a) => s + (assetValue(a) * a.chg / 100), 0);
  const inStaking = assets.filter(a => a.staking).reduce((s, a) => s + assetValue(a), 0);
  const usdtAsset = assets.find(a => a.sym === 'USDT');
  const availUSDT = usdtAsset ? assetValue(usdtAsset) : 0;

  return (
    <main className="main-content">
      <div className="assets-page">
        <div className="ap-header">
          <div className="ap-title">Portfolio Assets</div>
          <div className="ap-total">
            <div className="ap-total-label">Total Portfolio Value</div>
            <div className="ap-total-val">{fmtP(totalValue())}</div>
            <div className={`ap-total-chg ${totalPL >= 0 ? 'up' : 'dn'}`}>
              {totalPL >= 0 ? '▲' : '▼'} {fmtP(Math.abs(totalPL))} ({(totalPL / totalValue() * 100).toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="ap-kpis">
          <div className="kpi-card">
            <div className="kpi-label">Total Assets</div>
            <div className="kpi-val">{assets.length}</div>
            <div className="kpi-sub">Across all categories</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Unrealized P&L</div>
            <div className={`kpi-val ${totalPL >= 0 ? 'up' : 'dn'}`}>{fmtP(totalPL)}</div>
            <div className="kpi-sub">24H change</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">In Staking</div>
            <div className="kpi-val">{fmtP(inStaking)}</div>
            <div className="kpi-sub">{assets.filter(a => a.staking).length} assets staked</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Available USDT</div>
            <div className="kpi-val">{fmtP(availUSDT)}</div>
            <div className="kpi-sub">Ready to trade</div>
          </div>
        </div>

        <div className="ap-main">
          <div className="ap-left">
            <div className="ap-section">
              <div className="ap-sec-title">Portfolio Allocation</div>
              <div className="donut-wrap">
                <canvas ref={donutRef} width="160" height="160"></canvas>
                <div className="donut-legend">
                  {assets.map((a, i) => (
                    <div key={a.sym} className="dl-item">
                      <div className="dl-dot" style={{ background: DONUT_COLORS[i] }}></div>
                      <div className="dl-sym">{a.sym}</div>
                      <div className="dl-pct">{((assetValue(a) / totalValue()) * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ap-section">
              <div className="ap-sec-title">Portfolio Performance (30D)</div>
              <div className="perf-chart-wrap">
                <canvas ref={perfChartRef}></canvas>
              </div>
            </div>

            <div className="ap-section">
              <div className="ap-sec-title">Exposure by Category</div>
              <div className="exposure-list">
                {buildExposure().map(e => (
                  <div key={e.cat} className="exp-item">
                    <div className="exp-cat">{e.cat}</div>
                    <div className="exp-bar">
                      <div className="exp-fill" style={{ width: `${e.pct}%` }}></div>
                    </div>
                    <div className="exp-val">{fmtP(e.val)}</div>
                    <div className="exp-pct">{e.pct.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ap-section">
              <div className="ap-sec-title">24H Change Heatmap</div>
              <div className="heatmap">
                {buildHeatmap().map(h => (
                  <div 
                    key={h.sym} 
                    className={`hm-cell ${h.chg >= 0 ? 'up' : 'dn'}`}
                    style={{ 
                      opacity: 0.5 + Math.min(Math.abs(h.chg) / 10, 0.5),
                      flex: h.val / totalValue()
                    }}
                  >
                    <div className="hm-sym">{h.sym}</div>
                    <div className="hm-chg">{h.chg >= 0 ? '+' : ''}{h.chg.toFixed(2)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ap-right">
            <div className="ap-section">
              <div className="ap-sec-title">Assets</div>
              <div className="assets-controls">
                <div className="ac-filters">
                  {['all', 'spot', 'earn', 'staking'].map(f => (
                    <button 
                      key={f}
                      className={`ac-filter ${currentFilter === f ? 'on' : ''}`}
                      onClick={() => setCurrentFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="ac-search">
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="ac-sort">
                  <select value={currentSort} onChange={(e) => setCurrentSort(e.target.value)}>
                    <option value="value">Sort by Value</option>
                    <option value="name">Sort by Name</option>
                    <option value="change">Sort by Change</option>
                  </select>
                </div>
              </div>

              <div className="assets-table">
                <div className="at-header">
                  <div className="ath-col">Asset</div>
                  <div className="ath-col">Price</div>
                  <div className="ath-col">24H</div>
                  <div className="ath-col">7D</div>
                  <div className="ath-col">Holdings</div>
                  <div className="ath-col">Value</div>
                  <div className="ath-col">Actions</div>
                </div>
                <div className="at-body">
                  {sortedAssets.map(a => {
                    const spark = genSpark();
                    return (
                      <div key={a.sym} className="at-row">
                        <div className="at-cell at-asset">
                          <div className="at-orb" style={{ background: a.bg }}>{a.icon}</div>
                          <div className="at-info">
                            <div className="at-sym">{a.sym}</div>
                            <div className="at-name">{a.name}</div>
                          </div>
                        </div>
                        <div className="at-cell at-price">
                          <div className="at-spark" dangerouslySetInnerHTML={{ __html: sparkSVG(spark, a.chg >= 0) }}></div>
                          <div className="at-pval">{fmtP(a.price)}</div>
                        </div>
                        <div className={`at-cell at-chg ${a.chg >= 0 ? 'up' : 'dn'}`}>
                          {a.chg >= 0 ? '▲' : '▼'} {Math.abs(a.chg).toFixed(2)}%
                        </div>
                        <div className={`at-cell at-chg ${a.chg7 >= 0 ? 'up' : 'dn'}`}>
                          {a.chg7 >= 0 ? '▲' : '▼'} {Math.abs(a.chg7).toFixed(2)}%
                        </div>
                        <div className="at-cell at-hold">
                          <div className="at-qty">{a.qty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {a.sym}</div>
                          {a.staking && <div className="at-badge">Staking {a.apy}% APY</div>}
                        </div>
                        <div className="at-cell at-val">{fmtP(assetValue(a))}</div>
                        <div className="at-cell at-actions">
                          <button className="at-btn deposit">Deposit</button>
                          <button className="at-btn withdraw">Withdraw</button>
                          <button className="at-btn trade">Trade</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-status">
          <div className="aps-feed">
            <div className="aps-item">● BTC +1.86% | ETH +2.34% | SOL -0.82%</div>
          </div>
          <div className="aps-time">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </main>
  );
};

export default Assets;
