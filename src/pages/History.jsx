import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/history.css';

const PAIRS = [
  { sym: 'BTC', bg: 'radial-gradient(circle,#ff9500,#f7931a)', ico: '₿', price: 67842 },
  { sym: 'ETH', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', ico: 'Ξ', price: 3541 },
  { sym: 'SOL', bg: 'radial-gradient(circle,#c074fc,#9945ff)', ico: '◎', price: 173 },
  { sym: 'BNB', bg: 'radial-gradient(circle,#f5cc3a,#f3ba2f)', ico: 'B', price: 412 },
  { sym: 'DOGE', bg: 'radial-gradient(circle,#e8c84a,#c9a227)', ico: 'Ð', price: 0.164 },
  { sym: 'AVAX', bg: 'radial-gradient(circle,#ff6060,#e84142)', ico: 'A', price: 38.4 },
  { sym: 'LINK', bg: 'radial-gradient(circle,#3b82f6,#1d4ed8)', ico: '⬡', price: 14.8 },
  { sym: 'MATIC', bg: 'radial-gradient(circle,#9b59f5,#7b2fe8)', ico: '⬟', price: 0.88 },
];

const ORDER_TYPES = ['Limit', 'Market', 'Stop-Limit'];
const STATUSES = ['Filled', 'Filled', 'Filled', 'Partial', 'Cancelled'];

const rnd = (a, b) => a + Math.random() * (b - a);
const randEl = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmtDate = (d) => d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + d.toTimeString().split(' ')[0];
const fmtP = (v) => v < 1 ? '$' + v.toFixed(4) : v < 100 ? '$' + v.toFixed(2) : '$' + v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const shortHash = () => '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4);

const History = () => {
  const pnlChartRef = useRef(null);
  const wrDonutRef = useRef(null);
  const monthlyChartRef = useRef(null);
  
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [currentSection, setCurrentSection] = useState('trades');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    generateData();
  }, []);

  useEffect(() => {
    if (pnlChartRef.current) drawPnlChart();
    if (wrDonutRef.current) drawWinDonut();
    if (monthlyChartRef.current) drawMonthlyChart();
  }, [trades]);

  const generateData = () => {
    const newTrades = [];
    for (let i = 0; i < 188; i++) {
      const p = randEl(PAIRS);
      const side = Math.random() > 0.45 ? 'buy' : 'sell';
      const price = p.price * (1 + (Math.random() - 0.5) * 0.04);
      const qty = p.price > 1000 ? rnd(0.001, 1.5) : rnd(1, 500);
      const total = price * qty;
      const fee = total * 0.001;
      const pnl = side === 'sell' ? (Math.random() > 0.38 ? 1 : -1) * rnd(10, 4800) * ((i % 12 === 0) ? 3 : 1) : null;
      const daysAgo = rnd(0, 30);
      const dt = new Date(Date.now() - daysAgo * 864e5 - rnd(0, 864e4));
      newTrades.push({ id: '#T' + String(100000 + i), pair: p, side, price, qty, total, fee, pnl, dt, status: 'Filled', otype: randEl(ORDER_TYPES) });
    }
    setTrades(newTrades);

    const newOrders = [];
    for (let i = 0; i < 24; i++) {
      const p = randEl(PAIRS);
      const side = Math.random() > 0.45 ? 'buy' : 'sell';
      const price = p.price * (1 + (Math.random() - 0.5) * 0.04);
      const qty = p.price > 1000 ? rnd(0.001, 1.5) : rnd(1, 500);
      const total = price * qty;
      const status = randEl(STATUSES);
      const fill = status === 'Filled' ? 100 : status === 'Partial' ? rnd(20, 90) : 0;
      const dt = new Date(Date.now() - rnd(0, 30) * 864e5);
      newOrders.push({ id: '#O' + String(20000 + i), pair: p, side, otype: randEl(ORDER_TYPES), price, qty, total, fill, status, dt });
    }
    setOrders(newOrders);

    const newTransfers = [];
    const ttypes = ['deposit', 'withdrawal'];
    const coins = ['USDT', 'BTC', 'ETH', 'BNB'];
    for (let i = 0; i < 12; i++) {
      const type = randEl(ttypes);
      const coin = randEl(coins);
      const amt = rnd(100, 50000);
      const status = Math.random() > 0.2 ? 'confirmed' : 'pending';
      const dt = new Date(Date.now() - rnd(0, 30) * 864e5);
      newTransfers.push({ id: '#W' + String(5000 + i), type, coin, amt, fee: amt * 0.001, hash: shortHash(), network: randEl(['ETH', 'BSC', 'TRX', 'BTC']), status, dt });
    }
    setTransfers(newTransfers);
  };

  const drawPnlChart = () => {
    const canvas = pnlChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth || 700;
    const H = 185;
    canvas.width = W;
    canvas.height = H;

    const n = 30;
    const pad = { l: 42, r: 10, t: 8, b: 28 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;
    const daily = [];
    const cumPnl = [];
    let cum = 0;
    for (let i = 0; i < n; i++) {
      const d = (Math.random() > 0.4 ? 1 : -1) * rnd(50, 1200) * (i > 20 ? 1.8 : 1);
      daily.push(d);
      cum += d;
      cumPnl.push(cum);
    }
    const volData = daily.map(() => rnd(80, 400));
    const mnC = Math.min(...cumPnl);
    const mxC = Math.max(...cumPnl);
    const tx = i => pad.l + (i / (n - 1)) * cw;
    const tyC = v => pad.t + ch - ((v - mnC) / (mxC - mnC + 1)) * ch;
    const volMax = Math.max(...volData);

    ctx.fillStyle = '#0f1420';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(96,165,250,.06)';
    ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
      const y = pad.t + ch * t;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + cw, y);
      ctx.stroke();
    });

    const bw = cw / n * 0.55;
    volData.forEach((v, i) => {
      const bh = (v / volMax) * 24;
      ctx.fillStyle = 'rgba(96,165,250,.08)';
      ctx.fillRect(tx(i) - bw / 2, pad.t + ch - bh, bw, bh);
    });

    const gc = ctx.createLinearGradient(0, pad.t, 0, H);
    gc.addColorStop(0, 'rgba(96,165,250,.2)');
    gc.addColorStop(1, 'rgba(96,165,250,0)');
    ctx.beginPath();
    cumPnl.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), tyC(v)) : ctx.lineTo(tx(i), tyC(v)));
    ctx.lineTo(tx(n - 1), H);
    ctx.lineTo(tx(0), H);
    ctx.closePath();
    ctx.fillStyle = gc;
    ctx.fill();

    ctx.beginPath();
    cumPnl.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), tyC(v)) : ctx.lineTo(tx(i), tyC(v)));
    ctx.strokeStyle = 'rgba(96,165,250,.85)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawWinDonut = () => {
    const canvas = wrDonutRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 44, cy = 44, r = 40, inner = 28;
    ctx.clearRect(0, 0, 88, 88);
    const data = [{ v: 64, c: '#22d3a0' }, { v: 36, c: '#fb7185' }];
    let start = -Math.PI / 2;
    data.forEach(d => {
      const angle = (d.v / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.arc(cx, cy, inner, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = d.c;
      ctx.shadowColor = d.c;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      start += angle + 0.02;
    });
  };

  const drawMonthlyChart = () => {
    const canvas = monthlyChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth || 280;
    const H = 100;
    canvas.width = W;
    canvas.height = H;

    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const vals = [2100, -800, 4200, 3800, 6100, -1200, 3200];
    const mx = Math.max(...vals.map(Math.abs)) * 1.1;
    const bw = (W - 24) / months.length;

    ctx.fillStyle = '#121928';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(96,165,250,.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, H / 2);
    ctx.lineTo(W - 4, H / 2);
    ctx.stroke();

    vals.forEach((v, i) => {
      const up = v >= 0;
      const bh = Math.abs(v) / mx * (H / 2 - 8);
      const x = 14 + i * bw + bw * 0.15;
      const bwActual = bw * 0.7;
      const y = up ? H / 2 - bh : H / 2;
      const g = ctx.createLinearGradient(0, y, 0, y + bh);
      g.addColorStop(0, up ? 'rgba(34,211,160,.7)' : 'rgba(251,113,133,.7)');
      g.addColorStop(1, up ? 'rgba(34,211,160,.2)' : 'rgba(251,113,133,.15)');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, bwActual, bh);
    });
  };

  const getFilteredData = () => {
    const q = searchTerm.toLowerCase();
    if (currentSection === 'trades') {
      return trades.filter(t => {
        if (typeFilter !== 'all' && t.side !== typeFilter) return false;
        if (q && !t.pair.sym.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
        return true;
      });
    } else if (currentSection === 'orders') {
      return orders.filter(o => {
        if (typeFilter !== 'all' && o.side !== typeFilter) return false;
        if (q && !o.pair.sym.toLowerCase().includes(q) && !o.id.toLowerCase().includes(q)) return false;
        return true;
      });
    } else if (currentSection === 'transfers') {
      return transfers.filter(t => {
        if (q && !t.coin.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q) && !t.hash.includes(q)) return false;
        return true;
      });
    }
    return [];
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (filter) => {
    setTypeFilter(filter);
    setCurrentPage(1);
  };

  return (
    <main className="main-content">
      <div className="history-container">
        <div className="page-header">
          <div className="ph-left">
            <div className="ph-title">
              Transaction History
              <span className="live-badge">LIVE</span>
            </div>
            <div className="ph-tag">// All accounts · Real-time · UTC timestamps</div>
          </div>
          <div className="ph-right">
            <div className="date-range">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Feb 10, 2026<span className="dr-sep">→</span>Mar 10, 2026
            </div>
            <button className="ph-filter-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
            </button>
            <button className="ph-filter-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              CSV Report
            </button>
          </div>
        </div>

        <div className="kpi-row">
          <div className="kpi" style={{ '--kc': 'var(--up)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Total P&L</div>
              <div className="kpi-ico" style={{ background: 'var(--up2)' }}>💹</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--up)' }}>+$18,241</div>
            <div className="kpi-sub" style={{ color: 'var(--up)' }}>▲ +21.7% this month</div>
            <div className="kpi-bar">
              <div className="kpi-bar-fill" style={{ background: 'var(--up)', width: '72%' }}></div>
            </div>
          </div>
          <div className="kpi" style={{ '--kc': 'var(--blue)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Total Trades</div>
              <div className="kpi-ico" style={{ background: 'var(--blue3)' }}>📊</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--blue)' }}>2,841</div>
            <div className="kpi-sub" style={{ color: 'var(--text3)' }}>● 188 this month</div>
            <div className="kpi-bar">
              <div className="kpi-bar-fill" style={{ background: 'var(--blue)', width: '58%' }}></div>
            </div>
          </div>
          <div className="kpi" style={{ '--kc': 'var(--teal)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Win Rate</div>
              <div className="kpi-ico" style={{ background: 'rgba(45,212,191,.1)' }}>🎯</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--teal)' }}>64.2%</div>
            <div className="kpi-sub" style={{ color: 'var(--teal)' }}>▲ +3.1% vs last month</div>
            <div className="kpi-bar">
              <div className="kpi-bar-fill" style={{ background: 'var(--teal)', width: '64%' }}></div>
            </div>
          </div>
          <div className="kpi" style={{ '--kc': 'var(--amber)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Total Fees Paid</div>
              <div className="kpi-ico" style={{ background: 'rgba(251,191,36,.1)' }}>💸</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--amber)' }}>$842</div>
            <div className="kpi-sub" style={{ color: 'var(--text3)' }}>● 0.10% avg rate</div>
            <div className="kpi-bar">
              <div className="kpi-bar-fill" style={{ background: 'var(--amber)', width: '34%' }}></div>
            </div>
          </div>
          <div className="kpi" style={{ '--kc': 'var(--purple)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Volume Traded</div>
              <div className="kpi-ico" style={{ background: 'rgba(167,139,250,.1)' }}>🔄</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--purple)' }}>$842K</div>
            <div className="kpi-sub" style={{ color: 'var(--purple)' }}>▲ +44.2% this month</div>
            <div className="kpi-bar">
              <div className="kpi-bar-fill" style={{ background: 'var(--purple)', width: '84%' }}></div>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="left-col">
            <div className="pnl-panel">
              <div className="panel-hdr">
                <div className="panel-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  P&L Over Time
                </div>
                <div className="panel-actions">
                  <button className="pa-btn on">1W</button>
                  <button className="pa-btn">1M</button>
                  <button className="pa-btn">3M</button>
                  <button className="pa-btn">1Y</button>
                  <button className="pa-btn">All</button>
                </div>
              </div>
              <div className="chart-body">
                <canvas ref={pnlChartRef}></canvas>
              </div>
              <div className="chart-legend">
                <div className="leg">
                  <div className="leg-dot" style={{ background: 'var(--up)' }}></div>
                  Realized P&L
                </div>
                <div className="leg">
                  <div className="leg-dot" style={{ background: 'var(--blue)' }}></div>
                  Cumulative
                </div>
                <div className="leg">
                  <div className="leg-dot" style={{ background: 'rgba(255,255,255,.1)' }}></div>
                  Volume
                </div>
              </div>
            </div>

            <div className="history-panel">
              <div className="section-tabs">
                <div className={`stab ${currentSection === 'trades' ? 'on' : ''}`} onClick={() => handleSectionChange('trades')}>
                  Trades <span className="stab-badge">188</span>
                </div>
                <div className={`stab ${currentSection === 'orders' ? 'on' : ''}`} onClick={() => handleSectionChange('orders')}>
                  Orders <span className="stab-badge">24</span>
                </div>
                <div className={`stab ${currentSection === 'transfers' ? 'on' : ''}`} onClick={() => handleSectionChange('transfers')}>
                  Transfers <span className="stab-badge">12</span>
                </div>
                <div className={`stab ${currentSection === 'fees' ? 'on' : ''}`} onClick={() => handleSectionChange('fees')}>
                  Fees
                </div>
              </div>

              <div className="tbl-toolbar">
                <div className="tbl-search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search pair, ID, hash..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className={`tbl-filter ${typeFilter === 'all' ? 'on' : ''}`} onClick={() => handleTypeFilterChange('all')}>All</button>
                <button className={`tbl-filter ${typeFilter === 'buy' ? 'on' : ''}`} onClick={() => handleTypeFilterChange('buy')}>Buy</button>
                <button className={`tbl-filter ${typeFilter === 'sell' ? 'on' : ''}`} onClick={() => handleTypeFilterChange('sell')}>Sell</button>
                <select className="tbl-select">
                  <option>All Pairs</option>
                  <option>BTC/USDT</option>
                  <option>ETH/USDT</option>
                  <option>SOL/USDT</option>
                  <option>BNB/USDT</option>
                </select>
                <div className="tbl-right">
                  <button className="tbl-export">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    CSV
                  </button>
                  <button className="tbl-export">PDF</button>
                </div>
              </div>

              {currentSection === 'trades' && (
                <>
                  <div className="tbl-head trade-cols">
                    <div className="tbl-h">Date/ID</div>
                    <div className="tbl-h">Pair</div>
                    <div className="tbl-h r">Side</div>
                    <div className="tbl-h r">Type</div>
                    <div className="tbl-h r">Price</div>
                    <div className="tbl-h r">Qty</div>
                    <div className="tbl-h r">Total</div>
                    <div className="tbl-h r">P&L</div>
                    <div className="tbl-h r">Fee</div>
                  </div>
                  <div className="tbl-body">
                    {paginatedData.map((t, idx) => (
                      <div key={t.id} className="tbl-row trade-cols" style={{ animationDelay: `${idx * 0.03}s` }}>
                        <div>
                          <div className="cell-date">{fmtDate(t.dt).split(' ').slice(0, 3).join(' ')}</div>
                          <div className="cell-mono" style={{ fontSize: '8px', marginTop: '2px' }}>{t.id}</div>
                        </div>
                        <div className="cell-pair">
                          <div className="cell-orb" style={{ background: t.pair.bg, color: '#fff' }}>{t.pair.ico}</div>
                          <div>
                            <div className="cell-sym">{t.pair.sym}/USDT</div>
                          </div>
                        </div>
                        <div><span className={`badge ${t.side}`}>{t.side.toUpperCase()}</span></div>
                        <div><span className={`badge ${t.otype.toLowerCase().replace('-', '')}`}>{t.otype}</span></div>
                        <div className="cell-val">{fmtP(t.price)}</div>
                        <div className="cell-val">{t.qty.toFixed(t.pair.price > 100 ? 4 : 2)}</div>
                        <div className="cell-val">{fmtP(t.total)}</div>
                        <div className={`cell-pnl ${t.pnl == null ? '' : t.pnl >= 0 ? 'up' : 'dn'}`}>
                          {t.pnl == null ? '—' : (t.pnl >= 0 ? '+' : '') + fmtP(Math.abs(t.pnl))}
                        </div>
                        <div className="cell-mono">{fmtP(t.fee)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentSection === 'orders' && (
                <>
                  <div className="tbl-head order-cols">
                    <div className="tbl-h">Date/ID</div>
                    <div className="tbl-h">Pair</div>
                    <div className="tbl-h r">Side</div>
                    <div className="tbl-h r">Type</div>
                    <div className="tbl-h r">Price</div>
                    <div className="tbl-h r">Qty</div>
                    <div className="tbl-h r">Filled%</div>
                    <div className="tbl-h r">Total</div>
                    <div className="tbl-h r">Status</div>
                  </div>
                  <div className="tbl-body">
                    {paginatedData.map((o, idx) => (
                      <div key={o.id} className="tbl-row order-cols" style={{ animationDelay: `${idx * 0.04}s` }}>
                        <div>
                          <div className="cell-date">{fmtDate(o.dt).split(' ').slice(0, 3).join(' ')}</div>
                          <div className="cell-mono" style={{ fontSize: '8px', marginTop: '2px' }}>{o.id}</div>
                        </div>
                        <div className="cell-pair">
                          <div className="cell-orb" style={{ background: o.pair.bg, color: '#fff' }}>{o.pair.ico}</div>
                          <div className="cell-sym">{o.pair.sym}/USDT</div>
                        </div>
                        <div><span className={`badge ${o.side}`}>{o.side.toUpperCase()}</span></div>
                        <div><span className={`badge ${o.otype.toLowerCase().replace(/[-\s]/g, '')}`}>{o.otype}</span></div>
                        <div className="cell-val">{fmtP(o.price)}</div>
                        <div className="cell-val">{o.qty.toFixed(o.pair.price > 100 ? 4 : 2)}</div>
                        <div>
                          <div className="cell-mono">{o.fill.toFixed(0)}%</div>
                          <div className="fill-bar-wrap">
                            <div className="fill-bar" style={{ width: `${o.fill}%` }}></div>
                          </div>
                        </div>
                        <div className="cell-val">{fmtP(o.total)}</div>
                        <div><span className={`badge ${o.status.toLowerCase()}`}>{o.status.toUpperCase()}</span></div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentSection === 'transfers' && (
                <>
                  <div className="tbl-head transfer-cols">
                    <div className="tbl-h">Date/ID</div>
                    <div className="tbl-h">Type</div>
                    <div className="tbl-h">Coin</div>
                    <div className="tbl-h r">Amount</div>
                    <div className="tbl-h r">Fee</div>
                    <div className="tbl-h">Network</div>
                    <div className="tbl-h">Hash</div>
                    <div className="tbl-h r">Status</div>
                  </div>
                  <div className="tbl-body">
                    {paginatedData.map((t, idx) => (
                      <div key={t.id} className="tbl-row transfer-cols" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div>
                          <div className="cell-date">{fmtDate(t.dt).split(' ').slice(0, 3).join(' ')}</div>
                          <div className="cell-mono" style={{ fontSize: '8px', marginTop: '2px' }}>{t.id}</div>
                        </div>
                        <div><span className={`badge ${t.type}`}>{t.type.toUpperCase()}</span></div>
                        <div className="cell-sym" style={{ fontSize: '13px' }}>{t.coin}</div>
                        <div className="cell-val" style={{ color: t.type === 'deposit' ? 'var(--up)' : 'var(--dn)' }}>
                          {t.type === 'deposit' ? '+' : '-'}${t.amt.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="cell-mono">${t.fee.toFixed(2)}</div>
                        <div><span className="badge limit">{t.network}</span></div>
                        <div className="cell-hash" style={{ maxWidth: '100px' }}>{t.hash}</div>
                        <div><span className={`badge ${t.status}`}>{t.status.toUpperCase()}</span></div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="pagination">
                <div className="pg-info">
                  Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filteredData.length)} of {filteredData.length}
                </div>
                <div className="pg-btns">
                  <button 
                    className="pg-btn" 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  {[...Array(Math.min(totalPages, 6))].map((_, i) => (
                    <button 
                      key={i + 1}
                      className={`pg-btn ${currentPage === i + 1 ? 'on' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className="pg-btn" 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="stats-stack">
              <div className="stat-card">
                <div className="sc-top">
                  <div className="sc-title">
                    <span className="sc-icon">📈</span>
                    Trading Performance
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '8px', color: 'var(--blue)' }}>30D</span>
                </div>
                <div className="sc-body">
                  <div className="sc-row">
                    <span className="sc-lbl">Best Trade</span>
                    <span className="sc-val" style={{ color: 'var(--up)' }}>+$4,821</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Worst Trade</span>
                    <span className="sc-val" style={{ color: 'var(--dn)' }}>-$1,204</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Avg Win</span>
                    <span className="sc-val" style={{ color: 'var(--up)' }}>+$841</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Avg Loss</span>
                    <span className="sc-val" style={{ color: 'var(--dn)' }}>-$312</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Profit Factor</span>
                    <span className="sc-val" style={{ color: 'var(--blue)' }}>2.70</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Sharpe Ratio</span>
                    <span className="sc-val" style={{ color: 'var(--teal)' }}>1.84</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="sc-top">
                  <div className="sc-title">
                    <span className="sc-icon">💰</span>
                    Balance Summary
                  </div>
                </div>
                <div className="sc-body">
                  <div className="sc-row">
                    <span className="sc-lbl">USDT Balance</span>
                    <span className="sc-val" style={{ color: 'var(--text)' }}>$84,291</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">BTC Holdings</span>
                    <span className="sc-val">1.2341 BTC</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Total Deposits</span>
                    <span className="sc-val" style={{ color: 'var(--up)' }}>$120,000</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Total Withdrawals</span>
                    <span className="sc-val" style={{ color: 'var(--dn)' }}>-$22,400</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Net Invested</span>
                    <span className="sc-val" style={{ color: 'var(--blue)' }}>$97,600</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="winrate-card">
              <div className="sc-title">
                <span className="sc-icon">🎯</span>
                Win / Loss Breakdown
              </div>
              <div className="wr-body">
                <div className="wr-donut">
                  <canvas ref={wrDonutRef} width="88" height="88"></canvas>
                  <div className="wr-center">
                    <div className="wr-pct">64%</div>
                    <div className="wr-lbl">WIN RATE</div>
                  </div>
                </div>
                <div className="wr-legend">
                  <div className="wr-row">
                    <div className="wr-pip" style={{ background: 'var(--up)' }}></div>
                    <span className="wr-name">Profitable</span>
                    <span className="wr-cnt" style={{ color: 'var(--up)' }}>121 trades</span>
                  </div>
                  <div className="wr-row">
                    <div className="wr-pip" style={{ background: 'var(--dn)' }}></div>
                    <span className="wr-name">Loss</span>
                    <span className="wr-cnt" style={{ color: 'var(--dn)' }}>67 trades</span>
                  </div>
                  <div className="wr-row">
                    <div className="wr-pip" style={{ background: 'var(--text3)' }}></div>
                    <span className="wr-name">Break-even</span>
                    <span className="wr-cnt">0 trades</span>
                  </div>
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                    <div className="wr-row">
                      <div className="wr-pip" style={{ background: 'var(--blue)' }}></div>
                      <span className="wr-name">Avg Hold Time</span>
                      <span className="wr-cnt" style={{ color: 'var(--blue)' }}>4h 12m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="monthly-card">
              <div className="panel-hdr" style={{ padding: '10px 14px' }}>
                <div className="panel-title" style={{ fontSize: '13px' }}>Monthly P&L</div>
              </div>
              <div className="monthly-body">
                <canvas ref={monthlyChartRef} height="100"></canvas>
              </div>
            </div>

            <div className="activity-card">
              <div className="panel-hdr" style={{ padding: '10px 14px' }}>
                <div className="panel-title" style={{ fontSize: '13px' }}>Recent Activity</div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '8px', color: 'var(--blue)', cursor: 'pointer' }}>View all →</span>
              </div>
              <div className="activity-list">
                {[
                  { ico: '₿', bg: 'radial-gradient(circle,#ff9500,#f7931a)', msg: 'Sold 0.142 BTC at $67,842', time: '2 min ago', amt: '+$9,633', up: true },
                  { ico: '↓', bg: 'rgba(34,211,160,.2)', msg: 'Deposit of $10,000 USDT confirmed', time: '1h ago', amt: '+$10,000', up: true },
                  { ico: 'Ξ', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', msg: 'Bought 2.14 ETH at $3,541', time: '3h ago', amt: '-$7,578', up: false },
                  { ico: '⬆', bg: 'rgba(251,113,133,.2)', msg: 'Withdrawal of $5,000 USDT processed', time: '6h ago', amt: '-$5,000', up: false },
                  { ico: '◎', bg: 'radial-gradient(circle,#c074fc,#9945ff)', msg: 'Sold 14.2 SOL at $172.85', time: '12h ago', amt: '+$2,454', up: true },
                  { ico: '📋', bg: 'rgba(96,165,250,.15)', msg: 'Stop-loss order triggered on BNB', time: '1d ago', amt: '-$412', up: false },
                ].map((a, i) => (
                  <div key={i} className="act-item" style={{ animation: `slideUp .4s ease ${i * 0.05}s backwards` }}>
                    <div className="act-ico" style={{ background: a.bg }}>{a.ico}</div>
                    <div className="act-text">
                      <div className="act-msg">{a.msg}</div>
                      <div className="act-time">{a.time}</div>
                    </div>
                    <div className="act-amt" style={{ color: a.up ? 'var(--up)' : 'var(--dn)' }}>{a.amt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default History;
