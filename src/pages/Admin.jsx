import React, { useEffect, useRef, useState } from 'react';
import '../styles/components/admin.css';

const Admin = () => {
  const revenueChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const gauge1Ref = useRef(null);
  const gauge2Ref = useRef(null);
  const gauge3Ref = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  const [time, setTime] = useState('');
  const [kpis, setKpis] = useState({
    revenue: 0,
    users: 0,
    volume: 0,
    kyc: 0,
    load: 0
  });
  const [systemLoad, setSystemLoad] = useState(34);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    let mx = 0, my = 0, cx = 0, cy = 0;

    const moveMouse = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    };

    const animate = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', moveMouse);
    animate();

    return () => document.removeEventListener('mousemove', moveMouse);
  }, []);

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // KPI counters animation
  useEffect(() => {
    const targets = {
      revenue: 4821350,
      users: 4219847,
      volume: 48.6,
      kyc: 342,
      load: 34
    };

    const duration = 1800;
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setKpis({
        revenue: Math.round(targets.revenue * ease),
        users: Math.round(targets.users * ease),
        volume: (targets.volume * ease).toFixed(1),
        kyc: Math.round(targets.kyc * ease),
        load: Math.round(targets.load * ease)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    setTimeout(() => requestAnimationFrame(animate), 300);
  }, []);

  // Revenue chart
  useEffect(() => {
    const drawRevenueChart = () => {
      const canvas = revenueChartRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const W = canvas.parentElement.clientWidth;
      const H = 160;
      canvas.width = W;
      canvas.height = H;

      const days = 30;
      const rev = [], profit = [], vol = [];
      let r = 80000, pr = 55000, v = 0.8;

      for (let i = 0; i < days; i++) {
        r += (Math.random() - 0.4) * 8000;
        r = Math.max(50000, Math.min(180000, r));
        rev.push(r);

        pr += (Math.random() - 0.42) * 5000;
        pr = Math.max(30000, Math.min(120000, pr));
        profit.push(pr);

        v += (Math.random() - 0.45) * 0.08;
        v = Math.max(0.4, Math.min(1.4, v));
        vol.push(v);
      }

      const allVals = [...rev, ...profit];
      const mn = Math.min(...allVals) * 0.9;
      const mx = Math.max(...allVals) * 1.05;

      const pad = { l: 8, r: 8, t: 10, b: 20 };
      const cw = W - pad.l - pad.r;
      const ch = H - pad.t - pad.b;

      const tx = i => pad.l + (i / (days - 1)) * cw;
      const ty = v => pad.t + ch - ((v - mn) / (mx - mn)) * ch;

      // Grid
      ctx.strokeStyle = 'rgba(255,200,60,.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + ch * (i / 4);
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(W - pad.r, y);
        ctx.stroke();
      }

      // Volume bars
      const bw = cw / days * 0.6;
      vol.forEach((v, i) => {
        const bh = ch * v * 0.3;
        ctx.fillStyle = 'rgba(255,255,255,.04)';
        ctx.fillRect(tx(i) - bw / 2, pad.t + ch - bh, bw, bh);
      });

      // Profit area
      const gp = ctx.createLinearGradient(0, pad.t, 0, H);
      gp.addColorStop(0, 'rgba(59,130,246,.18)');
      gp.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.beginPath();
      profit.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.lineTo(tx(days - 1), H);
      ctx.lineTo(tx(0), H);
      ctx.closePath();
      ctx.fillStyle = gp;
      ctx.fill();

      ctx.beginPath();
      profit.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.strokeStyle = 'rgba(59,130,246,.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Revenue area
      const gr = ctx.createLinearGradient(0, pad.t, 0, H);
      gr.addColorStop(0, 'rgba(255,184,0,.2)');
      gr.addColorStop(1, 'rgba(255,184,0,0)');
      ctx.beginPath();
      rev.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.lineTo(tx(days - 1), H);
      ctx.lineTo(tx(0), H);
      ctx.closePath();
      ctx.fillStyle = gr;
      ctx.fill();

      ctx.beginPath();
      rev.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
      ctx.strokeStyle = 'rgba(255,184,0,.9)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Current value dot
      const lx = tx(days - 1), ly = ty(rev[days - 1]);
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffb800';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx, ly, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,184,0,.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    setTimeout(drawRevenueChart, 200);
    window.addEventListener('resize', drawRevenueChart);
    return () => window.removeEventListener('resize', drawRevenueChart);
  }, []);

  // Donut chart
  useEffect(() => {
    const drawDonut = () => {
      const canvas = donutChartRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const cx = 60, cy = 60, r = 52, inner = 36;

      ctx.clearRect(0, 0, 120, 120);

      const data = [
        { name: 'Bitcoin', pct: 45, color: '#f7931a' },
        { name: 'Ethereum', pct: 26, color: '#627eea' },
        { name: 'Solana', pct: 12, color: '#9945ff' },
        { name: 'BNB', pct: 8, color: '#f3ba2f' },
        { name: 'Others', pct: 9, color: '#3b82f6' }
      ];

      let start = -Math.PI / 2;
      data.forEach(d => {
        const angle = (d.pct / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, start, start + angle);
        ctx.arc(cx, cy, inner, start + angle, start, true);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        start += angle + 0.02;
      });
    };

    setTimeout(drawDonut, 200);
  }, []);

  // Gauges
  useEffect(() => {
    const drawGauge = (canvasRef, val, color) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const W = 64, H = 36;
      ctx.clearRect(0, 0, W, H);

      const cx = 32, cy = 34, r = 26;

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,.07)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Fill
      const endAngle = Math.PI + (val / 100) * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Label
      ctx.fillStyle = color;
      ctx.font = "bold 11px 'Syne', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(val + '%', cx, cy - 6);
    };

    const interval = setInterval(() => {
      drawGauge(gauge1Ref, Math.round(52 + Math.random() * 10), '#22c55e');
      drawGauge(gauge2Ref, Math.round(30 + Math.random() * 20), '#ffb800');
      drawGauge(gauge3Ref, Math.round(94 + Math.random() * 5), '#3b82f6');
    }, 2000);

    setTimeout(() => {
      drawGauge(gauge1Ref, 58, '#22c55e');
      drawGauge(gauge2Ref, 42, '#ffb800');
      drawGauge(gauge3Ref, 96, '#3b82f6');
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Live system load fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => {
        let newLoad = prev + (Math.random() - 0.5) * 3;
        return Math.max(18, Math.min(72, newLoad));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const donutData = [
    { name: 'Bitcoin', pct: 45, color: '#f7931a', val: '$21.9B' },
    { name: 'Ethereum', pct: 26, color: '#627eea', val: '$12.6B' },
    { name: 'Solana', pct: 12, color: '#9945ff', val: '$5.8B' },
    { name: 'BNB', pct: 8, color: '#f3ba2f', val: '$3.9B' },
    { name: 'Others', pct: 9, color: '#3b82f6', val: '$4.4B' }
  ];

  const services = [
    { name: 'Trading Engine', val: '4.2ms', lbl: 'Latency', status: 'ok' },
    { name: 'Order Matching', val: '99.98%', lbl: 'Uptime', status: 'ok' },
    { name: 'Price Feeds', val: '12/12', lbl: 'Nodes', status: 'ok' },
    { name: 'KYC Pipeline', val: '342', lbl: 'Queued', status: 'warn' },
    { name: 'Cold Wallet', val: '95.4%', lbl: 'Stored', status: 'ok' },
    { name: 'API Gateway', val: '8.1k', lbl: 'Req/sec', status: 'ok' },
    { name: 'DB Cluster', val: '78%', lbl: 'Capacity', status: 'warn' },
    { name: 'Fraud Detection', val: 'ACTIVE', lbl: 'Status', status: 'ok' }
  ];

  const users = [
    { init: 'AK', bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', name: 'Alex Kowalski', email: 'alex.k@mail.com', balance: '$48,210', vol: '$2.4M', status: 'active', joined: 'Jan 12' },
    { init: 'SM', bg: 'linear-gradient(135deg,#22c55e,#15803d)', name: 'Sarah Mitchell', email: 's.mitchell@pro.com', balance: '$124,500', vol: '$8.1M', status: 'active', joined: 'Dec 08' },
    { init: 'JL', bg: 'linear-gradient(135deg,#a855f7,#7c3aed)', name: 'James Li', email: 'james.li@fund.io', balance: '$891,200', vol: '$41.2M', status: 'active', joined: 'Nov 22' },
    { init: 'RP', bg: 'linear-gradient(135deg,#f97316,#c2410c)', name: 'Raj Patel', email: 'raj.p@crypto.in', balance: '$12,800', vol: '$340K', status: 'pending', joined: 'Mar 02' },
    { init: 'EM', bg: 'linear-gradient(135deg,#ec4899,#be185d)', name: 'Emma Moore', email: 'emma.m@trd.eu', balance: '$0', vol: '$0', status: 'suspended', joined: 'Feb 28' },
    { init: 'TW', bg: 'linear-gradient(135deg,#06b6d4,#0e7490)', name: 'Tyler Walsh', email: 't.walsh@web3.us', balance: '$55,100', vol: '$3.8M', status: 'active', joined: 'Jan 30' },
    { init: 'NK', bg: 'linear-gradient(135deg,#ffb800,#d97706)', name: 'Nina Kim', email: 'nina.k@defi.kr', balance: '$210,400', vol: '$12.6M', status: 'active', joined: 'Dec 14' }
  ];

  const alerts = [
    { type: 'crit', ico: '🚨', msg: 'Suspicious withdrawal attempt detected — User #88421, $240K to unknown wallet.', time: '2 min ago' },
    { type: 'warn', ico: '⚠️', msg: 'KYC queue exceeded 300 pending verifications. Manual review required.', time: '8 min ago' },
    { type: 'info', ico: 'ℹ️', msg: 'New API key generated for institutional client Blackrock Capital.', time: '14 min ago' },
    { type: 'succ', ico: '✅', msg: 'Cold wallet rebalance completed. 95.4% of assets secured.', time: '21 min ago' },
    { type: 'warn', ico: '⚠️', msg: 'DB Cluster Node 3 at 78% capacity. Auto-scaling initiated.', time: '35 min ago' },
    { type: 'info', ico: 'ℹ️', msg: 'Scheduled maintenance window: Trading Engine patch v2.4.2 — Sunday 02:00 UTC.', time: '1h ago' },
    { type: 'succ', ico: '✅', msg: 'Fraud detection model updated. 99.2% accuracy on test set.', time: '2h ago' }
  ];

  const feedEvents = [
    { ev: 'NEW DEPOSIT', val: '+$48,210', cls: 'lf-up', user: 'alex.k' },
    { ev: 'WITHDRAWAL', val: '-$12,000', cls: 'lf-dn', user: 'james.li' },
    { ev: 'KYC APPROVED', val: 'raj.p@crypto', cls: 'lf-hi', user: '' },
    { ev: 'TRADE EXEC', val: '1.24 BTC', cls: 'lf-up', user: 's.mitchell' },
    { ev: 'ALERT FLAGGED', val: '#88421', cls: 'lf-dn', user: '' },
    { ev: 'NEW USER', val: 'nina.k@defi', cls: 'lf-hi', user: '' },
    { ev: 'LEVERAGE OPEN', val: '50x SOL/USDT', cls: 'lf-up', user: 't.walsh' },
    { ev: 'LIQUIDATION', val: '-$2,100', cls: 'lf-dn', user: '#44821' },
    { ev: 'COLD WALLET', val: '95.4% SECURED', cls: 'lf-hi', user: 'SYS' },
    { ev: 'API CALL', val: '14.2K/sec', cls: 'lf-up', user: 'GATEWAY' }
  ];

  return (
    <div className="admin-page">
      <div ref={cursorRef} className="admin-cursor"></div>
      <div ref={cursorDotRef} className="admin-cursor-dot"></div>

      {/* Sidebar */}
      <div className="admin-sidebar fade-in-left">
        <div className="sb-logo">
          <div className="sb-logo-mark">N</div>
          <div>
            <div className="sb-logo-text">NEXUS</div>
            <div className="sb-logo-sub">// ADMIN CORE</div>
          </div>
        </div>

        <div className="sb-admin-badge">
          <div className="sb-admin-dot"></div>
          <div>
            <div className="sb-admin-name">John Devlin</div>
            <div className="sb-admin-role">SUPER ADMIN</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Overview</div>
          <div className="sb-item active">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            Analytics
            <span className="sb-badge gold">NEW</span>
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Reports
          </div>

          <div className="sb-section">Management</div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Users
            <span className="sb-badge red">14</span>
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Transactions
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            Assets
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            Liquidity
            <span className="sb-badge green">OK</span>
          </div>

          <div className="sb-section">Security</div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Compliance
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Alerts
            <span className="sb-badge red">7</span>
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Vault
          </div>

          <div className="sb-section">System</div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
            API
          </div>
          <div className="sb-item">
            <svg className="sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
            Settings
          </div>
        </nav>

        <div className="sb-bottom">
          <div className="sb-version">// v2.4.1 — PROD BUILD</div>
          <div className="sb-status-row">SYS <span>OPERATIONAL</span></div>
        </div>
      </div>

      {/* Main Area */}
      <div className="admin-main-area">
        {/* Topbar */}
        <div className="admin-topbar fade-in">
          <div className="tb-breadcrumb">
            <span>NEXUS ADMIN</span>
            <span className="sep">/</span>
            <span className="current">Dashboard</span>
          </div>
          <div className="tb-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search users, transactions, assets..." />
          </div>
          <div className="tb-right">
            <div className="tb-time">{time}</div>
            <div className="alert-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div className="alert-pip"></div>
            </div>
            <button className="tb-action">+ New Report</button>
            <div className="tb-avatar">JD</div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {/* KPI Row */}
          <div className="kpi-row">
            <div className="kpi fade-in" style={{ animationDelay: '.05s', '--kpi-color': 'var(--gold)' }}>
              <div className="kpi-top">
                <div className="kpi-label">Total Revenue</div>
                <div className="kpi-icon" style={{ background: 'rgba(255,184,0,.1)', color: 'var(--gold)' }}>💰</div>
              </div>
              <div className="kpi-val" style={{ color: 'var(--gold)' }}>${kpis.revenue.toLocaleString()}</div>
              <div className="kpi-sub up">▲ +18.4% vs last month</div>
              <div className="kpi-bar">
                <div className="kpi-bar-fill" style={{ background: 'var(--gold)', width: '76%' }}></div>
              </div>
            </div>

            <div className="kpi fade-in" style={{ animationDelay: '.1s', '--kpi-color': 'var(--blue)' }}>
              <div className="kpi-top">
                <div className="kpi-label">Active Users</div>
                <div className="kpi-icon" style={{ background: 'var(--blue2)', color: 'var(--blue)' }}>👥</div>
              </div>
              <div className="kpi-val" style={{ color: 'var(--blue)' }}>{kpis.users.toLocaleString()}</div>
              <div className="kpi-sub up">▲ +2,341 today</div>
              <div className="kpi-bar">
                <div className="kpi-bar-fill" style={{ background: 'var(--blue)', width: '68%' }}></div>
              </div>
            </div>

            <div className="kpi fade-in" style={{ animationDelay: '.15s', '--kpi-color': 'var(--green)' }}>
              <div className="kpi-top">
                <div className="kpi-label">24h Volume</div>
                <div className="kpi-icon" style={{ background: 'var(--green2)', color: 'var(--green)' }}>📈</div>
              </div>
              <div className="kpi-val" style={{ color: 'var(--green)' }}>${kpis.volume}B</div>
              <div className="kpi-sub up">▲ +31.2% vs yesterday</div>
              <div className="kpi-bar">
                <div className="kpi-bar-fill" style={{ background: 'var(--green)', width: '88%' }}></div>
              </div>
            </div>

            <div className="kpi fade-in" style={{ animationDelay: '.2s', '--kpi-color': 'var(--red)' }}>
              <div className="kpi-top">
                <div className="kpi-label">Pending KYC</div>
                <div className="kpi-icon" style={{ background: 'var(--red2)', color: 'var(--red)' }}>⚠️</div>
              </div>
              <div className="kpi-val" style={{ color: 'var(--red)' }}>{kpis.kyc}</div>
              <div className="kpi-sub dn">▲ +48 since yesterday</div>
              <div className="kpi-bar">
                <div className="kpi-bar-fill" style={{ background: 'var(--red)', width: '42%' }}></div>
              </div>
            </div>

            <div className="kpi fade-in" style={{ animationDelay: '.25s', '--kpi-color': 'var(--purple)' }}>
              <div className="kpi-top">
                <div className="kpi-label">System Load</div>
                <div className="kpi-icon" style={{ background: 'var(--purple2)', color: 'var(--purple)' }}>⚡</div>
              </div>
              <div className="kpi-val" style={{ color: 'var(--purple)' }}>{Math.round(systemLoad)}%</div>
              <div className="kpi-sub neutral">● 8 servers nominal</div>
              <div className="kpi-bar">
                <div className="kpi-bar-fill" style={{ background: 'var(--purple)', width: `${Math.round(systemLoad)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="middle-row">
            {/* Revenue Chart */}
            <div className="chart-panel fade-in" style={{ animationDelay: '.2s' }}>
              <div className="panel-header">
                <div>
                  <div className="panel-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                      <polyline points="17 6 23 6 23 12"/>
                    </svg>
                    Revenue & Fees
                  </div>
                  <div className="panel-sub">Trading fee income — last 30 days</div>
                </div>
                <div className="panel-actions">
                  <button className="pa-btn on">7D</button>
                  <button className="pa-btn">30D</button>
                  <button className="pa-btn">90D</button>
                </div>
              </div>
              <div className="chart-area">
                <canvas ref={revenueChartRef} width="100%" height="160"></canvas>
              </div>
              <div className="chart-legend">
                <div className="leg-item">
                  <div className="leg-dot" style={{ background: 'var(--gold)' }}></div>
                  Fee Revenue
                </div>
                <div className="leg-item">
                  <div className="leg-dot" style={{ background: 'var(--blue)' }}></div>
                  Net Profit
                </div>
                <div className="leg-item">
                  <div className="leg-dot" style={{ background: 'rgba(255,255,255,.15)' }}></div>
                  Volume
                </div>
              </div>
            </div>

            {/* Donut Panel */}
            <div className="donut-panel fade-in" style={{ animationDelay: '.25s' }}>
              <div className="panel-header">
                <div>
                  <div className="panel-title">Volume by Asset</div>
                  <div className="panel-sub">24h distribution</div>
                </div>
              </div>
              <div className="donut-area">
                <div className="donut-wrap">
                  <canvas ref={donutChartRef} width="120" height="120"></canvas>
                  <div className="donut-center">
                    <div className="donut-total">$48.6B</div>
                    <div className="donut-sub-lbl">TOTAL</div>
                  </div>
                </div>
                <div className="donut-list">
                  {donutData.map((d, i) => (
                    <div key={i} className="donut-item">
                      <div className="d-pip" style={{ background: d.color }}></div>
                      <div className="d-name">{d.name}</div>
                      <div className="d-bar-wrap">
                        <div className="d-bar" style={{ background: d.color, width: `${d.pct}%` }}></div>
                      </div>
                      <div className="d-pct">{d.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '8px 16px 14px', borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center' }}>
                  <canvas ref={gauge1Ref} width="64" height="36"></canvas>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', color: 'var(--text3)', marginTop: '2px' }}>BUY/SELL</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <canvas ref={gauge2Ref} width="64" height="36"></canvas>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', color: 'var(--text3)', marginTop: '2px' }}>LEVERAGE</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <canvas ref={gauge3Ref} width="64" height="36"></canvas>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '8px', color: 'var(--text3)', marginTop: '2px' }}>FILL RATE</div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="status-panel fade-in" style={{ animationDelay: '.3s' }}>
              <div className="panel-header">
                <div className="panel-title">
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', animation: 'pulse 2s infinite' }}></div>
                  System Status
                </div>
                <span className="notif-badge">2</span>
              </div>
              <div className="status-list">
                {services.map((s, i) => (
                  <div key={i} className="status-item">
                    <div className="si-left">
                      <div className={`si-dot ${s.status}`}></div>
                      <div className="si-name">{s.name}</div>
                    </div>
                    <div className="si-right">
                      <div className="si-val" style={{ color: s.status === 'ok' ? 'var(--text)' : s.status === 'warn' ? '#f59e0b' : 'var(--red)' }}>{s.val}</div>
                      <div className="si-lbl">{s.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-row">
            {/* User Table */}
            <div className="user-table-panel fade-in" style={{ animationDelay: '.35s' }}>
              <div className="panel-header">
                <div className="panel-title">Recent Users</div>
                <div className="panel-actions">
                  <button className="pa-btn on">All</button>
                  <button className="pa-btn">VIP</button>
                  <button className="pa-btn">Flagged</button>
                </div>
              </div>
              <div className="table-toolbar">
                <button className="table-filter on">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  All Users
                </button>
                <button className="table-filter">Active</button>
                <button className="table-filter">Pending KYC</button>
                <button className="table-filter">Suspended</button>
                <button className="table-export">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export CSV
                </button>
              </div>
              <div className="ut-head">
                <span></span>
                <span>User</span>
                <span style={{ textAlign: 'right' }}>Balance</span>
                <span style={{ textAlign: 'right' }}>Volume</span>
                <span>Status</span>
                <span>Joined</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
              </div>
              <div>
                {users.map((u, i) => (
                  <div key={i} className="ut-row" style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                    <div className="ut-check"></div>
                    <div className="ut-user">
                      <div className="ut-avatar" style={{ background: u.bg }}>{u.init}</div>
                      <div>
                        <div className="ut-name">{u.name}</div>
                        <div className="ut-email">{u.email}</div>
                      </div>
                    </div>
                    <div className="ut-val" style={{ textAlign: 'right' }}>{u.balance}</div>
                    <div className="ut-vol" style={{ textAlign: 'right' }}>{u.vol}</div>
                    <div>
                      <span className={`ut-status ${u.status}`}>{u.status.toUpperCase()}</span>
                    </div>
                    <div className="ut-date">{u.joined}</div>
                    <div className="ut-action">
                      <button className="ut-act-btn" title="View">👁</button>
                      <button className="ut-act-btn" title="Edit">✏️</button>
                      <button className="ut-act-btn" title="More">⋯</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts Feed */}
            <div className="alerts-panel fade-in" style={{ animationDelay: '.4s' }}>
              <div className="panel-header">
                <div className="panel-title">
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 5px var(--red)', animation: 'pulse 1s infinite' }}></div>
                  Live Alerts
                </div>
                <span className="notif-badge">7</span>
              </div>
              <div className="alerts-body">
                {alerts.map((a, i) => (
                  <div key={i} className="alert-item" style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
                    <div className={`alert-ico ${a.type}`}>{a.ico}</div>
                    <div className="alert-text">
                      <div className="alert-msg">{a.msg}</div>
                      <div className="alert-time">{a.time}</div>
                    </div>
                    <span className={`alert-sev ${a.type}`}>{a.type.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed Strip */}
        <div className="live-feed">
          <div className="lf-label">
            <div className="lf-dot"></div>
            LIVE
          </div>
          <div className="lf-scroll">
            <div className="lf-inner">
              {[...feedEvents, ...feedEvents].map((f, i) => (
                <div key={i} className="lf-item">
                  <span className="lf-ev">{f.ev}</span>
                  <span className={f.cls}>{f.val}</span>
                  {f.user && <span style={{ color: 'var(--text3)' }}>{f.user}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
