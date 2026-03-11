import React, { useEffect, useRef, useState } from 'react';
import '../styles/components/reports.css';

const Reports = () => {
  const pnlChartRef = useRef(null);
  const monthlyChartRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastData, setToastData] = useState({ icon: '', text: '', sub: '' });

  useEffect(() => {
    // Initialize KPI bar animations
    setTimeout(() => {
      document.querySelectorAll('.kfi').forEach(el => {
        el.style.width = el.dataset.w + '%';
      });
    }, 400);

    // Draw charts
    setTimeout(() => {
      drawPnlChart();
      drawMonthlyChart();
    }, 250);

    // Build dynamic content
    buildAssetBreakdown();
    buildActivityFeed();
    buildCalendar();

    // Handle window resize
    const handleResize = () => {
      drawPnlChart();
      drawMonthlyChart();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (icon, text, sub) => {
    setToastData({ icon, text, sub });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const genReport = (name, file, size) => {
    showToast('⬇', `GENERATING: ${name.toUpperCase()}`, `${file} · ${size}`);
  };

  const setPeriod = (period) => {
    setSelectedPeriod(period);
    drawPnlChart();
    drawMonthlyChart();
  };

  const drawPnlChart = () => {
    const canvas = pnlChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const W = parent.clientWidth || 600;
    const H = 193;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    
    ctx.fillStyle = '#091520';
    ctx.fillRect(0, 0, W, H);
    
    const pad = { l: 50, r: 12, t: 8, b: 22 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;
    const n = 70;
    
    const daily = [], cumul = [], vol = [];
    let cum = 0;
    
    for (let i = 0; i < n; i++) {
      const d = (Math.random() > 0.4 ? 1 : -1) * ((Math.random() * 800 + 50) * (i > 50 ? 1.4 : 1));
      daily.push(d);
      cum += d;
      cumul.push(cum);
      vol.push(Math.random() * 500 + 80);
    }
    
    const mn = Math.min(...cumul, 0) * 1.05;
    const mx = Math.max(...cumul) * 1.06;
    const vMax = Math.max(...vol);
    
    const tx = i => pad.l + (i / (n - 1)) * cw;
    const ty = v => pad.t + ch - ((v - mn) / (mx - mn + 0.01)) * ch;
    
    // Grid
    ctx.strokeStyle = 'rgba(0,245,255,.042)';
    ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
      const y = pad.t + ch * t;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + cw, y);
      ctx.stroke();
      
      const v = mx - (mx - mn) * t;
      ctx.fillStyle = 'rgba(90,128,144,.38)';
      ctx.font = "8px 'Share Tech Mono'";
      ctx.textAlign = 'right';
      ctx.fillText((v >= 0 ? '+' : '') + Math.round(v / 1000) + 'K', pad.l - 3, y + 3);
    });
    
    // Zero line
    if (mn < 0) {
      const zy = ty(0);
      ctx.strokeStyle = 'rgba(255,255,255,.08)';
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(pad.l, zy);
      ctx.lineTo(pad.l + cw, zy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Volume bars
    const bw = Math.max(1, (cw / n) * 0.55);
    vol.forEach((v, i) => {
      const bh = (v / vMax) * 20;
      ctx.fillStyle = 'rgba(0,245,255,.07)';
      ctx.fillRect(tx(i) - bw / 2, pad.t + ch - bh, bw, bh);
    });
    
    // Daily P&L bars
    daily.forEach((d, i) => {
      const up = d >= 0;
      const bh = Math.max(1, Math.abs(ty(d) - ty(0)));
      const y = up ? ty(d) : ty(0);
      ctx.fillStyle = up ? 'rgba(0,255,136,.25)' : 'rgba(255,51,85,.2)';
      ctx.fillRect(tx(i) - bw * 0.4, y, bw * 0.8, bh);
    });
    
    // Cumulative line + fill
    const g = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    g.addColorStop(0, 'rgba(0,245,255,.18)');
    g.addColorStop(1, 'rgba(0,245,255,.0)');
    
    ctx.beginPath();
    cumul.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
    ctx.lineTo(tx(n - 1), pad.t + ch);
    ctx.lineTo(tx(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    
    ctx.beginPath();
    cumul.forEach((v, i) => i === 0 ? ctx.moveTo(tx(i), ty(v)) : ctx.lineTo(tx(i), ty(v)));
    ctx.strokeStyle = 'rgba(0,245,255,.85)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // End dot
    const lx = tx(n - 1), ly = ty(cumul[n - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00f5ff';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(lx, ly, 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,245,255,.28)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // X dates
    ctx.fillStyle = 'rgba(90,128,144,.32)';
    ctx.font = "8px 'Share Tech Mono'";
    ctx.textAlign = 'center';
    [0, 14, 28, 42, 56, 69].forEach(i => {
      if (i < n) {
        const d = new Date(Date.now() - i * 86400000);
        ctx.fillText((d.getMonth() + 1) + '/' + d.getDate(), tx(n - 1 - i), H - 4);
      }
    });
  };

  const drawMonthlyChart = () => {
    const canvas = monthlyChartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const W = parent.clientWidth || 400;
    const H = 142;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    
    ctx.fillStyle = '#091520';
    ctx.fillRect(0, 0, W, H);
    
    const pad = { l: 44, r: 12, t: 6, b: 22 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;
    
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const vals = [-1200, 3400, 2800, 4200, -800, 5100, 3200, -500, 6800, 4100, -1800, 3900];
    const mx = Math.max(...vals.map(Math.abs)) * 1.1;
    const bw = (cw / months.length) * 0.72;
    
    // Zero line
    ctx.strokeStyle = 'rgba(0,245,255,.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, H / 2);
    ctx.lineTo(pad.l + cw, H / 2);
    ctx.stroke();
    
    // Bars
    vals.forEach((v, i) => {
      const up = v >= 0;
      const bh = Math.abs(v) / mx * (ch / 2 - 8);
      const x = pad.l + (i + 0.5) * (cw / months.length) - bw / 2;
      const y = up ? H / 2 - bh : H / 2;
      
      const g = ctx.createLinearGradient(0, y, 0, y + bh);
      g.addColorStop(0, up ? 'rgba(0,255,136,.7)' : 'rgba(255,51,85,.65)');
      g.addColorStop(1, up ? 'rgba(0,255,136,.18)' : 'rgba(255,51,85,.12)');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, bw, bh);
      
      // Top value
      ctx.fillStyle = up ? 'rgba(0,255,136,.65)' : 'rgba(255,51,85,.65)';
      ctx.font = "7px 'Share Tech Mono'";
      ctx.textAlign = 'center';
      const lbl = (v >= 0 ? '+' : '-') + '$' + (Math.abs(v) / 1000).toFixed(1) + 'K';
      ctx.fillText(lbl, x + bw / 2, up ? y - 3 : y + bh + 10);
      
      // Month label
      ctx.fillStyle = 'rgba(90,128,144,.4)';
      ctx.fillText(months[i], x + bw / 2, H - 4);
    });
    
    // Y labels
    ctx.fillStyle = 'rgba(90,128,144,.38)';
    ctx.textAlign = 'right';
    [1, 0.5, 0, -0.5, -1].forEach(t => {
      const v = mx * t;
      const y = H / 2 - t * (ch / 2 - 8);
      ctx.fillText((v >= 0 ? '+' : '') + Math.round(v / 1000) + 'K', pad.l - 4, y + 3);
    });
  };

  const buildAssetBreakdown = () => {
    const assets = [
      { sym: 'BTC', name: 'Bitcoin', ico: '₿', bg: 'radial-gradient(circle,#ff9500,#f7931a)', col: '#f7931a', pnl: 8241, pct: 45 },
      { sym: 'ETH', name: 'Ethereum', ico: 'Ξ', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', col: '#627eea', pnl: 4820, pct: 26 },
      { sym: 'SOL', name: 'Solana', ico: '◎', bg: 'radial-gradient(circle,#c074fc,#9945ff)', col: '#9945ff', pnl: -1204, pct: -7 },
      { sym: 'AVAX', name: 'Avalanche', ico: 'A', bg: 'radial-gradient(circle,#ff6060,#e84142)', col: '#e84142', pnl: 2840, pct: 16 },
      { sym: 'LINK', name: 'Chainlink', ico: '⬡', bg: 'radial-gradient(circle,#3b82f6,#1d4ed8)', col: '#3b82f6', pnl: 1840, pct: 10 },
      { sym: 'BNB', name: 'BNB', ico: 'B', bg: 'radial-gradient(circle,#f5cc3a,#f3ba2f)', col: '#f3ba2f', pnl: 704, pct: 4 },
    ];
    
    const maxPnl = Math.max(...assets.map(a => Math.abs(a.pnl)));
    const container = document.getElementById('assetBreakdown');
    if (!container) return;
    
    container.innerHTML = assets.map((a, i) => `
      <div class="ab-row" style="animation:fu .4s ease ${i * 0.05}s backwards">
        <div class="ab-orb" style="background:${a.bg};color:${a.col}">${a.ico}</div>
        <div>
          <div class="ab-name">${a.name}</div>
          <div class="ab-sym">${a.sym}</div>
        </div>
        <div style="flex:1;padding:0 10px">
          <div class="ab-bar-w" style="width:100%">
            <div class="ab-bar-f" style="width:${Math.abs(a.pnl) / maxPnl * 100}%;background:${a.pnl >= 0 ? 'var(--up)' : 'var(--dn)'}"></div>
          </div>
        </div>
        <div>
          <div class="ab-pnl" style="color:${a.pnl >= 0 ? 'var(--up)' : 'var(--dn)'}">${a.pnl >= 0 ? '+' : ''}$${Math.abs(a.pnl).toLocaleString()}</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:${a.pnl >= 0 ? 'var(--up)' : 'var(--dn)'};text-align:right">${a.pct >= 0 ? '+' : ''}${a.pct}%</div>
        </div>
      </div>
    `).join('');
  };

  const buildActivityFeed = () => {
    const acts = [
      { ico: '⬇', bg: 'rgba(0,255,136,.1)', msg: 'Performance Report Downloaded', time: '5 min ago', val: 'PDF 3.2 MB', vc: true },
      { ico: '🏛', bg: 'rgba(255,204,0,.1)', msg: 'Tax Report 2026 Generated', time: '2h ago', val: 'PDF + CSV', vc: true },
      { ico: '📊', bg: 'rgba(0,245,255,.1)', msg: 'Monthly Report Scheduled', time: '1d ago', val: 'Apr 1, 2026', vc: true },
      { ico: '📋', bg: 'rgba(191,95,255,.1)', msg: 'Transactions CSV Exported', time: '3d ago', val: '2,841 rows', vc: true },
      { ico: '🔍', bg: 'rgba(79,163,255,.1)', msg: 'Portfolio Audit Completed', time: '5d ago', val: 'No issues', vc: true },
      { ico: '⚠', bg: 'rgba(255,51,85,.1)', msg: 'Missing cost basis: 3 trades', time: '1w ago', val: 'Review', vc: false },
    ];
    
    const container = document.getElementById('activityFeed');
    if (!container) return;
    
    container.innerHTML = acts.map((a, i) => `
      <div class="act-item" style="animation:fu .35s ease ${i * 0.05}s backwards">
        <div class="act-ico" style="background:${a.bg}">${a.ico}</div>
        <div class="act-txt">
          <div class="act-msg">${a.msg}</div>
          <div class="act-time">${a.time}</div>
        </div>
        <div class="act-amt" style="color:${a.vc ? 'var(--up)' : 'var(--dn)'}">${a.val}</div>
      </div>
    `).join('');
  };

  const buildCalendar = () => {
    const days = 90, cols = 13;
    const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let html = `<div class="cal-month">Last 90 days</div>`;
    
    html += `<div style="display:grid;grid-template-columns:12px ${Array(cols).fill('1fr').join(' ')};gap:2px;margin-bottom:4px">`;
    html += `<div></div>`;
    for (let w = cols - 1; w >= 0; w--) {
      const d = new Date(Date.now() - (w * 7) * 86400000);
      html += `<div class="cal-dow">${d.getDate()}</div>`;
    }
    html += '</div>';
    
    html += `<div style="display:grid;grid-template-columns:12px ${Array(cols).fill('1fr').join(' ')};gap:2px">`;
    dows.forEach((dow, di) => {
      html += `<div class="cal-dow">${dow}</div>`;
      for (let w = cols - 1; w >= 0; w--) {
        const daysAgo = w * 7 + di;
        if (daysAgo > days) {
          html += `<div></div>`;
          continue;
        }
        const pnl = (Math.random() > 0.4 ? 1 : -1) * Math.random() * 1200;
        const intensity = Math.min(Math.abs(pnl) / 1200, 0.9);
        const up = pnl >= 0;
        const bg = pnl === 0 ? 'rgba(0,245,255,.03)' : up ? `rgba(0,255,136,${0.1 + intensity * 0.45})` : `rgba(255,51,85,${0.1 + intensity * 0.4})`;
        const border = up ? `rgba(0,255,136,${0.12 + intensity * 0.15})` : `rgba(255,51,85,${0.12 + intensity * 0.15})`;
        const dateStr = new Date(Date.now() - daysAgo * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' });
        html += `<div class="cal-cell" style="background:${bg};border:1px solid ${border};aspect-ratio:1;border-radius:2px;min-width:14px;min-height:14px" title="${dateStr}: ${up ? '+' : ''}$${Math.round(Math.abs(pnl))}"></div>`;
      }
    });
    html += '</div>';
    
    // Legend
    html += `<div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:6px;font-family:'Share Tech Mono',monospace;font-size:7px;color:var(--text3)">Less`;
    ['rgba(0,245,255,.05)', 'rgba(0,255,136,.15)', 'rgba(0,255,136,.38)', 'rgba(0,255,136,.65)'].forEach(c => {
      html += `<div style="width:10px;height:10px;background:${c};border-radius:2px"></div>`;
    });
    html += `More</div>`;
    
    const container = document.getElementById('calBody');
    if (container) container.innerHTML = html;
  };

  return (
    <>
      {/* Toast Notification */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <div className="toast-icon">{toastData.icon}</div>
        <div>
          <div className="toast-text">{toastData.text}</div>
          <div className="toast-sub">{toastData.sub}</div>
        </div>
      </div>

      <main className="main">
        {/* PAGE HEADER */}
        <div className="page-head fu" style={{ animationDelay: '0s' }}>
          <div>
            <div className="pht">// Performance Reports</div>
            <div className="phsub">// TRADING ANALYTICS · P&L STATEMENTS · TAX DOCUMENTS · EXPORT READY</div>
          </div>
          <div className="ph-right">
            <div className="date-range">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="dr-text">Jan 1, 2026<span className="dr-sep">→</span>Mar 10, 2026</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['YTD', '1M', '3M', '1Y', 'ALL'].map(p => (
                <button key={p} className={`pb ${selectedPeriod === p ? 'on' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI GRID */}
        <div className="kpi-grid fu" style={{ animationDelay: '.05s' }}>
          <div className="kpi" style={{ '--kc': 'var(--up)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Net P&L (YTD)</div>
              <div className="kpi-ico" style={{ background: 'var(--gr2)' }}>💹</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--up)' }}>+$18,241</div>
            <div className="kpi-sub" style={{ color: 'var(--up)' }}>▲ +21.7% ROI</div>
            <div className="kpi-bar"><div className="kfi" style={{ background: 'var(--up)' }} data-w="72"></div></div>
          </div>
          
          <div className="kpi" style={{ '--kc': 'var(--cyan)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Total Trades</div>
              <div className="kpi-ico" style={{ background: 'var(--cy2)' }}>📊</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--cyan)' }}>2,841</div>
            <div className="kpi-sub" style={{ color: 'var(--text3)' }}>● 64.2% win rate</div>
            <div className="kpi-bar"><div className="kfi" style={{ background: 'var(--cyan)' }} data-w="64"></div></div>
          </div>
          
          <div className="kpi" style={{ '--kc': 'var(--gold)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Volume Traded</div>
              <div className="kpi-ico" style={{ background: 'var(--go2)' }}>🔄</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--gold)' }}>$842K</div>
            <div className="kpi-sub" style={{ color: 'var(--gold)' }}>▲ +44.2% vs last period</div>
            <div className="kpi-bar"><div className="kfi" style={{ background: 'var(--gold)' }} data-w="84"></div></div>
          </div>
          
          <div className="kpi" style={{ '--kc': 'var(--red)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Fees Paid</div>
              <div className="kpi-ico" style={{ background: 'var(--re2)' }}>💸</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--red)' }}>$842</div>
            <div className="kpi-sub" style={{ color: 'var(--text3)' }}>● 0.10% avg rate</div>
            <div className="kpi-bar"><div className="kfi" style={{ background: 'var(--red)' }} data-w="30"></div></div>
          </div>
          
          <div className="kpi" style={{ '--kc': 'var(--orange)' }}>
            <div className="kpi-top">
              <div className="kpi-lbl">Tax Liability Est.</div>
              <div className="kpi-ico" style={{ background: 'var(--or2)' }}>🏛</div>
            </div>
            <div className="kpi-val" style={{ color: 'var(--orange)' }}>$4,560</div>
            <div className="kpi-sub" style={{ color: 'var(--orange)' }}>● Short-term capital gains</div>
            <div className="kpi-bar"><div className="kfi" style={{ background: 'var(--orange)' }} data-w="25"></div></div>
          </div>
        </div>

        {/* REPORT CARDS */}
        <div className="report-cards fu" style={{ animationDelay: '.1s' }}>
          <div className="rcard" style={{ '--rc': 'var(--cyan)' }}>
            <div className="rc-ico" style={{ background: 'var(--cy2)' }}>📈</div>
            <div className="rc-title">Performance Report</div>
            <div className="rc-desc">Full P&L breakdown, win/loss ratios, Sharpe ratio, max drawdown, best/worst trades and monthly performance charts.</div>
            <div className="rc-meta">// PDF · 3.2 MB · Last generated: Mar 10, 2026</div>
            <button className="rc-btn" onClick={() => genReport('Performance Report', 'performance-report-2026.pdf', '3.2 MB')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </div>
          
          <div className="rcard" style={{ '--rc': 'var(--gold)' }}>
            <div className="rc-ico" style={{ background: 'var(--go2)' }}>🏛</div>
            <div className="rc-title">Tax Report (2026)</div>
            <div className="rc-desc">Capital gains, short/long term classification, cost basis tracking, Form 8949 compatible CSV for tax filing.</div>
            <div className="rc-meta">// PDF + CSV · 1.8 MB · Tax year 2026</div>
            <button className="rc-btn" style={{ borderColor: 'rgba(255,204,0,.28)', color: 'var(--gold)' }} onClick={() => genReport('Tax Report 2026', 'tax-report-2026.pdf', '1.8 MB')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </div>
          
          <div className="rcard" style={{ '--rc': 'var(--purple)' }}>
            <div className="rc-ico" style={{ background: 'var(--pu2)' }}>📋</div>
            <div className="rc-title">Transaction History</div>
            <div className="rc-desc">Complete export of all trades, deposits, withdrawals and fees. Available in CSV, Excel and JSON formats.</div>
            <div className="rc-meta">// CSV · 842 KB · 2,841 transactions</div>
            <button className="rc-btn" style={{ borderColor: 'rgba(191,95,255,.28)', color: 'var(--purple)' }} onClick={() => genReport('Transaction History', 'transactions-2026.csv', '842 KB')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CSV
            </button>
          </div>
          
          <div className="rcard" style={{ '--rc': 'var(--green)' }}>
            <div className="rc-ico" style={{ background: 'var(--gr2)' }}>🔍</div>
            <div className="rc-title">Portfolio Audit</div>
            <div className="rc-desc">Full holdings audit trail, cost basis per asset, unrealized P&L breakdown and position history since account open.</div>
            <div className="rc-meta">// PDF · 2.1 MB · Updated daily</div>
            <button className="rc-btn" style={{ borderColor: 'rgba(0,255,136,.28)', color: 'var(--up)' }} onClick={() => genReport('Portfolio Audit', 'portfolio-audit-2026.pdf', '2.1 MB')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        {/* MAIN ROW: P&L Chart + Performance Metrics */}
        <div className="main-row fu" style={{ animationDelay: '.15s' }}>
          <div className="panel">
            <div className="phdr">
              <div>
                <div className="ptitle"><div className="pdot"></div>P&L Over Time · Cumulative Return</div>
                <div className="psub">// {selectedPeriod} · Net profit after fees</div>
              </div>
              <div className="pact">
                <button className="pb on">Daily</button>
                <button className="pb">Cumulative</button>
                <button className="pb">Both</button>
              </div>
            </div>
            <div className="pnl-area">
              <canvas ref={pnlChartRef} id="pnlChart"></canvas>
            </div>
            <div style={{ display: 'flex', gap: '16px', padding: '0 14px 10px', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Share Tech Mono',monospace", fontSize: '8px', color: 'var(--text3)' }}>
                <div style={{ width: '16px', height: '3px', background: 'var(--up)', borderRadius: '2px' }}></div>Daily P&L
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Share Tech Mono',monospace", fontSize: '8px', color: 'var(--text3)' }}>
                <div style={{ width: '16px', height: '3px', background: 'var(--cyan)', borderRadius: '2px' }}></div>Cumulative
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Share Tech Mono',monospace", fontSize: '8px', color: 'var(--text3)' }}>
                <div style={{ width: '16px', height: '3px', background: 'rgba(255,255,255,.15)', borderRadius: '2px' }}></div>Volume
              </div>
            </div>
          </div>
          
          <div className="panel">
            <div className="phdr">
              <div className="ptitle"><div className="pdot"></div>Risk & Performance</div>
            </div>
            <div className="perf-body">
              <div className="pm-row"><span className="pm-lbl">Best Single Trade</span><span className="pm-val" style={{ color: 'var(--up)' }}>+$4,821</span></div>
              <div className="pm-row"><span className="pm-lbl">Worst Single Trade</span><span className="pm-val" style={{ color: 'var(--dn)' }}>-$1,204</span></div>
              <div className="pm-row"><span className="pm-lbl">Avg Win</span><span className="pm-val" style={{ color: 'var(--up)' }}>+$841</span></div>
              <div className="pm-row"><span className="pm-lbl">Avg Loss</span><span className="pm-val" style={{ color: 'var(--dn)' }}>-$312</span></div>
              <div className="pm-row"><span className="pm-lbl">Profit Factor</span><span className="pm-val" style={{ color: 'var(--cyan)' }}>2.70</span></div>
              <div className="pm-row"><span className="pm-lbl">Sharpe Ratio</span><span className="pm-val" style={{ color: 'var(--cyan)' }}>1.84</span></div>
              <div className="pm-row"><span className="pm-lbl">Max Drawdown</span><span className="pm-val" style={{ color: 'var(--dn)' }}>-8.4%</span></div>
              <div className="pm-row"><span className="pm-lbl">Calmar Ratio</span><span className="pm-val" style={{ color: 'var(--gold)' }}>2.58</span></div>
              <div className="pm-row"><span className="pm-lbl">Sortino Ratio</span><span className="pm-val" style={{ color: 'var(--purple)' }}>2.14</span></div>
              <div className="pm-row"><span className="pm-lbl">Avg Hold Time</span><span className="pm-val" style={{ color: 'var(--text)' }}>4h 12m</span></div>
              <div className="pm-row"><span className="pm-lbl">Consecutive Wins</span><span className="pm-val" style={{ color: 'var(--up)' }}>9</span></div>
              <div className="pm-row"><span className="pm-lbl">Consecutive Losses</span><span className="pm-val" style={{ color: 'var(--dn)' }}>4</span></div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Monthly + Asset Breakdown + Activity */}
        <div className="bottom-row fu" style={{ animationDelay: '.2s' }}>
          <div className="panel">
            <div className="phdr">
              <div>
                <div className="ptitle"><div className="pdot"></div>Monthly P&L Breakdown</div>
                <div className="psub">// 12-month performance · Net after fees</div>
              </div>
              <div className="pact">
                <button className="pb on">2026</button>
                <button className="pb">2025</button>
              </div>
            </div>
            <div className="monthly-area">
              <canvas ref={monthlyChartRef} id="monthlyChart"></canvas>
            </div>
          </div>
          
          <div className="panel">
            <div className="phdr">
              <div className="ptitle"><div className="pdot"></div>P&L by Asset</div>
            </div>
            <div style={{ padding: '10px 12px', position: 'relative', zIndex: 2 }} id="assetBreakdown"></div>
          </div>
          
          <div className="panel">
            <div className="phdr">
              <div className="ptitle"><div className="pdot"></div>Report Activity</div>
            </div>
            <div id="activityFeed"></div>
          </div>
        </div>

        {/* TAX SECTION */}
        <div className="tax-row fu" style={{ animationDelay: '.25s' }}>
          <div className="tax-card">
            <div className="tax-hdr">
              <div className="ptitle" style={{ fontSize: '9px' }}>
                <div className="pdot" style={{ background: 'var(--gold)', boxShadow: '0 0 5px var(--gold)' }}></div>
                Capital Gains Summary
              </div>
              <div className="psub" style={{ color: 'var(--text3)' }}>// Tax year 2026</div>
            </div>
            <div className="tax-body">
              <div className="tx-row"><span className="tx-lbl">Short-Term Gains</span><span className="tx-val" style={{ color: 'var(--up)' }}>+$14,821</span></div>
              <div className="tx-row"><span className="tx-lbl">Short-Term Losses</span><span className="tx-val" style={{ color: 'var(--dn)' }}>-$3,580</span></div>
              <div className="tx-row"><span className="tx-lbl">Net Short-Term</span><span className="tx-val" style={{ color: 'var(--up)' }}>+$11,241</span></div>
              <div style={{ height: '1px', background: 'rgba(0,245,255,.07)', margin: '3px 0' }}></div>
              <div className="tx-row"><span className="tx-lbl">Long-Term Gains</span><span className="tx-val" style={{ color: 'var(--up)' }}>+$9,420</span></div>
              <div className="tx-row"><span className="tx-lbl">Long-Term Losses</span><span className="tx-val" style={{ color: 'var(--dn)' }}>-$2,420</span></div>
              <div className="tx-row"><span className="tx-lbl">Net Long-Term</span><span className="tx-val" style={{ color: 'var(--up)' }}>+$7,000</span></div>
              <div style={{ height: '1px', background: 'rgba(0,245,255,.07)', margin: '3px 0' }}></div>
              <div className="tx-row" style={{ borderColor: 'rgba(255,204,0,.15)' }}><span className="tx-lbl">Est. Tax Liability</span><span className="tx-val" style={{ color: 'var(--gold)' }}>$4,560</span></div>
              <button className="rc-btn" style={{ marginTop: '8px', borderColor: 'rgba(255,204,0,.25)', color: 'var(--gold)', fontSize: '8px' }} onClick={() => genReport('Tax Report', 'tax-report-2026.pdf', '1.8 MB')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="9" height="9">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Form 8949 CSV
              </button>
            </div>
          </div>
          
          <div className="tax-card">
            <div className="tax-hdr">
              <div className="ptitle" style={{ fontSize: '9px' }}>
                <div className="pdot" style={{ background: 'var(--red)', boxShadow: '0 0 5px var(--red)' }}></div>
                Fee Analysis
              </div>
              <div className="psub" style={{ color: 'var(--text3)' }}>// YTD fee breakdown</div>
            </div>
            <div className="tax-body">
              <div className="tx-row"><span className="tx-lbl">Maker Fees (0.08%)</span><span className="tx-val" style={{ color: 'var(--text)' }}>$421</span></div>
              <div className="tx-row"><span className="tx-lbl">Taker Fees (0.12%)</span><span className="tx-val" style={{ color: 'var(--text)' }}>$284</span></div>
              <div className="tx-row"><span className="tx-lbl">Withdrawal Fees</span><span className="tx-val" style={{ color: 'var(--text)' }}>$96</span></div>
              <div className="tx-row"><span className="tx-lbl">Funding Fees</span><span className="tx-val" style={{ color: 'var(--text)' }}>$41</span></div>
              <div style={{ height: '1px', background: 'rgba(0,245,255,.07)', margin: '3px 0' }}></div>
              <div className="tx-row"><span className="tx-lbl">Total Fees Paid</span><span className="tx-val" style={{ color: 'var(--dn)' }}>$842</span></div>
              <div className="tx-row"><span className="tx-lbl">Fee as % of Volume</span><span className="tx-val" style={{ color: 'var(--text2)' }}>0.10%</span></div>
              <div className="tx-row"><span className="tx-lbl">Fee Tier</span><span className="tx-val" style={{ color: 'var(--cyan)' }}>VIP 2</span></div>
              <div className="tx-row"><span className="tx-lbl">Fee Rebates Earned</span><span className="tx-val" style={{ color: 'var(--up)' }}>+$84</span></div>
              <div style={{ height: '1px', background: 'rgba(0,245,255,.07)', margin: '3px 0' }}></div>
              <div className="tx-row" style={{ borderColor: 'rgba(255,51,85,.15)' }}><span className="tx-lbl">Net Fee Cost</span><span className="tx-val" style={{ color: 'var(--red)' }}>$758</span></div>
            </div>
          </div>
          
          <div className="tax-card">
            <div className="tax-hdr">
              <div className="ptitle" style={{ fontSize: '9px' }}>
                <div className="pdot" style={{ background: 'var(--purple)', boxShadow: '0 0 5px var(--purple)' }}></div>
                Daily P&L Heatmap
              </div>
              <div className="psub" style={{ color: 'var(--text3)' }}>// Last 90 days · Green = profit</div>
            </div>
            <div className="cal-body" id="calBody"></div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reports;
