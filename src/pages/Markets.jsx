import { useState, useEffect, useRef } from 'react';
import '../styles/components/markets.css';

const COINS = [
  {rank:1,name:'Bitcoin',sym:'BTC',icon:'₿',bg:'radial-gradient(circle,#ff9500,#f7931a)',color:'#f7931a',price:67842.50,c24:1.86,c7:4.21,vol:'$28.4B',mcap:'$1.34T',ath:73750,tags:['layer1']},
  {rank:2,name:'Ethereum',sym:'ETH',icon:'Ξ',bg:'radial-gradient(circle,#8ea3f5,#627eea)',color:'#627eea',price:3541.20,c24:2.34,c7:8.12,vol:'$14.2B',mcap:'$425B',ath:4891,tags:['layer1','defi']},
  {rank:3,name:'Tether',sym:'USDT',icon:'₮',bg:'radial-gradient(circle,#26a17b,#1a7a5e)',color:'#26a17b',price:1.0002,c24:0.01,c7:0.02,vol:'$48.1B',mcap:'$110B',ath:1.05,tags:['stable']},
  {rank:4,name:'BNB',sym:'BNB',icon:'B',bg:'radial-gradient(circle,#f5cc3a,#f3ba2f)',color:'#f3ba2f',price:412.30,c24:0.45,c7:-1.2,vol:'$2.8B',mcap:'$62B',ath:690,tags:['layer1']},
  {rank:5,name:'Solana',sym:'SOL',icon:'◎',bg:'radial-gradient(circle,#c074fc,#9945ff)',color:'#9945ff',price:172.85,c24:-0.82,c7:6.44,vol:'$5.1B',mcap:'$76B',ath:259,tags:['layer1']},
  {rank:6,name:'XRP',sym:'XRP',icon:'✕',bg:'radial-gradient(circle,#00c8f0,#00aae4)',color:'#00aae4',price:0.5821,c24:-1.21,c7:-3.1,vol:'$1.9B',mcap:'$32B',ath:3.40,tags:['layer1']},
  {rank:7,name:'USD Coin',sym:'USDC',icon:'$',bg:'radial-gradient(circle,#3e73c4,#2775ca)',color:'#2775ca',price:1.0000,c24:0.00,c7:0.01,vol:'$7.8B',mcap:'$43B',ath:1.17,tags:['stable']},
  {rank:8,name:'Cardano',sym:'ADA',icon:'₳',bg:'radial-gradient(circle,#0eccb1,#0db899)',color:'#0db899',price:0.4521,c24:-0.33,c7:1.88,vol:'$0.6B',mcap:'$16B',ath:3.09,tags:['layer1']},
  {rank:9,name:'Avalanche',sym:'AVAX',icon:'A',bg:'radial-gradient(circle,#ff6060,#e84142)',color:'#e84142',price:38.42,c24:3.12,c7:11.4,vol:'$0.9B',mcap:'$16B',ath:144,tags:['layer1']},
  {rank:10,name:'Dogecoin',sym:'DOGE',icon:'Ð',bg:'radial-gradient(circle,#e8c84a,#c9a227)',color:'#c9a227',price:0.1641,c24:5.44,c7:14.2,vol:'$1.2B',mcap:'$24B',ath:0.731,tags:['layer1']},
  {rank:11,name:'Shiba Inu',sym:'SHIB',icon:'🐕',bg:'radial-gradient(circle,#e44c3a,#b33425)',color:'#e44c3a',price:0.0000248,c24:7.21,c7:22.8,vol:'$0.8B',mcap:'$14B',ath:0.0000888,tags:['nft']},
  {rank:12,name:'Polkadot',sym:'DOT',icon:'●',bg:'radial-gradient(circle,#e6007a,#b3005f)',color:'#e6007a',price:7.82,c24:-2.1,c7:-4.5,vol:'$0.4B',mcap:'$10B',ath:54.98,tags:['layer1']},
  {rank:13,name:'Uniswap',sym:'UNI',icon:'🦄',bg:'radial-gradient(circle,#ff007a,#cc0062)',color:'#ff007a',price:9.14,c24:1.55,c7:3.2,vol:'$0.3B',mcap:'$5.5B',ath:44.97,tags:['defi']},
  {rank:14,name:'Chainlink',sym:'LINK',icon:'⬡',bg:'radial-gradient(circle,#375bd2,#2a4bbf)',color:'#375bd2',price:14.72,c24:0.88,c7:5.1,vol:'$0.5B',mcap:'$9B',ath:52.88,tags:['defi']},
  {rank:15,name:'Polygon',sym:'MATIC',icon:'⬢',bg:'radial-gradient(circle,#8247e5,#6a35d0)',color:'#8247e5',price:0.9841,c24:-1.44,c7:-7.2,vol:'$0.7B',mcap:'$10B',ath:2.92,tags:['layer1','defi']},
  {rank:16,name:'NEAR',sym:'NEAR',icon:'N',bg:'radial-gradient(circle,#00c08b,#00966e)',color:'#00c08b',price:6.48,c24:2.77,c7:9.3,vol:'$0.3B',mcap:'$7B',ath:20.44,tags:['layer1']},
  {rank:17,name:'Cosmos',sym:'ATOM',icon:'⚛',bg:'radial-gradient(circle,#8b90b2,#6f7390)',color:'#8b90b2',price:10.24,c24:4.21,c7:12.8,vol:'$0.2B',mcap:'$4B',ath:44.45,tags:['layer1']},
  {rank:18,name:'Aave',sym:'AAVE',icon:'Ø',bg:'radial-gradient(circle,#b6509e,#9b4289)',color:'#b6509e',price:112.40,c24:3.88,c7:8.7,vol:'$0.2B',mcap:'$1.7B',ath:661,tags:['defi']},
  {rank:19,name:'Internet Computer',sym:'ICP',icon:'∞',bg:'radial-gradient(circle,#f15a24,#d94e1f)',color:'#f15a24',price:11.82,c24:-3.41,c7:-9.1,vol:'$0.2B',mcap:'$5.5B',ath:700.65,tags:['layer1']},
  {rank:20,name:'ApeCoin',sym:'APE',icon:'🐒',bg:'radial-gradient(circle,#0054fa,#003fcc)',color:'#0054fa',price:1.24,c24:8.92,c7:18.6,vol:'$0.15B',mcap:'$0.9B',ath:39.40,tags:['nft']},
];

const TRENDING = [
  {sym:'APE',icon:'🐒',name:'ApeCoin',bg:'radial-gradient(circle,#0054fa,#003fcc)',c24:8.92},
  {sym:'SHIB',icon:'🐕',name:'Shiba Inu',bg:'radial-gradient(circle,#e44c3a,#b33425)',c24:7.21},
  {sym:'DOGE',icon:'Ð',name:'Dogecoin',bg:'radial-gradient(circle,#e8c84a,#c9a227)',c24:5.44},
  {sym:'ATOM',icon:'⚛',name:'Cosmos',bg:'radial-gradient(circle,#8b90b2,#6f7390)',c24:4.21},
  {sym:'AVAX',icon:'A',name:'Avalanche',bg:'radial-gradient(circle,#ff6060,#e84142)',c24:3.12},
];

const HM = [
  {sym:'BTC',c:1.86},{sym:'ETH',c:2.34},{sym:'SOL',c:-0.82},{sym:'BNB',c:0.45},
  {sym:'XRP',c:-1.21},{sym:'AVAX',c:3.12},{sym:'DOGE',c:5.44},{sym:'ADA',c:-0.33},
  {sym:'SHIB',c:7.21},{sym:'DOT',c:-2.10},{sym:'MATIC',c:-1.44},{sym:'LINK',c:0.88},
  {sym:'APE',c:8.92},{sym:'ATOM',c:4.21},{sym:'ICP',c:-3.41},{sym:'AAVE',c:3.88},
];

const Sparkline = ({ data, color }) => {
  const w = 68, h = 26;
  const mn = Math.min(...data), mx = Math.max(...data);
  const tx = i => (i / (data.length - 1)) * w;
  const ty = v => h - ((v - mn) / (mx - mn + 0.0001)) * h * 0.78 - h * 0.08;
  const pts = data.map((v, i) => `${tx(i)},${ty(v)}`).join(' ');
  const fill = `0,${h} ${data.map((v, i) => `${tx(i)},${ty(v)}`).join(' ')} ${w},${h}`;
  const id = `sg${color.replace(/[^a-z0-9]/gi, '')}${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="68" height="26" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};


const Markets = () => {
  const [filtered, setFiltered] = useState([...COINS]);
  const [tagFilter, setTagFilter] = useState('all');
  const [selectedSym, setSelectedSym] = useState(null);
  const [watchlist, setWatchlist] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [glMode, setGlMode] = useState('g');
  const canvasRef = useRef(null);

  const fp = (p) => {
    if (p < 0.00001) return '$' + p.toFixed(8);
    if (p < 0.001) return '$' + p.toFixed(6);
    if (p < 1) return '$' + p.toFixed(4);
    if (p < 10) return '$' + p.toFixed(3);
    return '$' + p.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const genSpark = (base, trend) => {
    const pts = [];
    let v = base * (1 - Math.abs(trend) / 100 * 0.7);
    for (let i = 0; i < 14; i++) {
      v *= (1 + (Math.random() - 0.48) * 0.02 + (trend > 0 ? 0.003 : -0.003));
      pts.push(v);
    }
    pts.push(base);
    return pts;
  };

  const toggleStar = (sym, e) => {
    e.stopPropagation();
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sym)) {
        newSet.delete(sym);
      } else {
        newSet.add(sym);
      }
      return newSet;
    });
  };

  const drawDetailChart = (coin) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const par = canvas.parentElement;
    const W = par.clientWidth, H = 90;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pts = [];
    let v = coin.price;
    for (let i = 0; i < 80; i++) {
      v *= (1 + (Math.random() - 0.492) * 0.012);
      pts.push(v);
    }
    pts.push(coin.price);

    const mn = Math.min(...pts) * 0.997, mx = Math.max(...pts) * 1.003;
    const tx = i => (i / (pts.length - 1)) * W;
    const ty = val => H - ((val - mn) / (mx - mn)) * H * 0.84 - H * 0.05;

    const up = coin.c24 >= 0;
    const rgb = up ? '0,255,136' : '255,45,85';
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `rgba(${rgb},.16)`);
    g.addColorStop(1, `rgba(${rgb},0)`);

    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(tx(i), ty(p)) : ctx.lineTo(tx(i), ty(p)));
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(tx(i), ty(p)) : ctx.lineTo(tx(i), ty(p)));
    ctx.strokeStyle = up ? '#00ff88' : '#ff2d55';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const lx = tx(pts.length - 1), ly = ty(pts[pts.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = up ? '#00ff88' : '#ff2d55';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 7, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb},.28)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    let list = [...COINS];
    if (tagFilter !== 'all') list = list.filter(c => c.tags && c.tags.includes(tagFilter));
    if (searchTerm) list = list.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sym.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(list);
  }, [tagFilter, searchTerm]);

  useEffect(() => {
    if (selectedSym) {
      const coin = COINS.find(c => c.sym === selectedSym);
      if (coin) {
        setTimeout(() => drawDetailChart(coin), 50);
      }
    }
  }, [selectedSym]);

  const selectedCoin = selectedSym ? COINS.find(c => c.sym === selectedSym) : null;
  const sortedForGL = [...COINS].sort((a, b) => glMode === 'g' ? b.c24 - a.c24 : a.c24 - b.c24);


  return (
    <main className="main">
      <div className="market-hero fi" style={{ animationDelay: '.04s' }}>
        <div className="hero-row">
          <div className="hero-stat">
            <div className="hs-label">Global Mkt Cap</div>
            <div className="hs-val" style={{ color: 'var(--cyan)' }}>$2.41T</div>
            <div className="hs-chg" style={{ color: 'var(--green)' }}>▲ +2.8%</div>
          </div>
          <div className="hs-div"></div>
          <div className="hero-stat">
            <div className="hs-label">24h Volume</div>
            <div className="hs-val">$98.4B</div>
            <div className="hs-chg" style={{ color: 'var(--green)' }}>▲ +12.4%</div>
          </div>
          <div className="hs-div"></div>
          <div className="hero-stat">
            <div className="hs-label">BTC Dom</div>
            <div className="hs-val" style={{ color: 'var(--gold)' }}>54.7%</div>
            <div className="hs-chg" style={{ color: 'var(--red)' }}>▼ −0.3%</div>
          </div>
          <div className="hs-div"></div>
          <div className="hero-stat">
            <div className="hs-label">Fear & Greed</div>
            <div className="hs-val" style={{ color: 'var(--gold)' }}>72</div>
            <div className="hs-chg" style={{ color: 'var(--gold)' }}>● GREED</div>
          </div>
          <div className="hero-search">
            <svg className="search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search coins — Bitcoin, BTC, ETH…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hero-filters">
            <button className={`hf-btn ${tagFilter === 'all' ? 'on' : ''}`} onClick={() => setTagFilter('all')}>All</button>
            <button className={`hf-btn ${tagFilter === 'layer1' ? 'on' : ''}`} onClick={() => setTagFilter('layer1')}>Layer 1</button>
            <button className={`hf-btn ${tagFilter === 'defi' ? 'on' : ''}`} onClick={() => setTagFilter('defi')}>DeFi</button>
            <button className={`hf-btn ${tagFilter === 'nft' ? 'on' : ''}`} onClick={() => setTagFilter('nft')}>NFT</button>
            <button className={`hf-btn ${tagFilter === 'stable' ? 'on' : ''}`} onClick={() => setTagFilter('stable')}>Stable</button>
          </div>
        </div>
      </div>

      <div className="market-grid">
        <div className="table-panel fi" style={{ animationDelay: '.1s' }}>
          <div className="cat-tabs">
            <div className="cat-tab on">📊 Spot <span className="cat-cnt">{filtered.length}</span></div>
          </div>
          <div className="t-head">
            <span></span>
            <span>Asset</span>
            <span>Price ↕</span>
            <span>24h ↕</span>
            <span>7d ↕</span>
            <span>Volume ↕</span>
            <span>Mkt Cap ↕</span>
            <span>7D Chart</span>
          </div>
          <div>
            {filtered.map((c, i) => {
              const sp = genSpark(c.price, c.c7);
              const sc = c.c24 >= 0 ? '#00ff88' : '#ff2d55';
              return (
                <div
                  key={c.sym}
                  className={`t-row ${selectedSym === c.sym ? 'sel' : ''}`}
                  style={{ animationDelay: `${0.03 + i * 0.022}s` }}
                  onClick={() => setSelectedSym(c.sym)}
                >
                  <div className={`t-star ${watchlist.has(c.sym) ? 'on' : ''}`} onClick={(e) => toggleStar(c.sym, e)}>★</div>
                  <div className="t-coin">
                    <div className="t-orb" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
                    <div>
                      <div className="t-name">{c.name}</div>
                      <div className="t-sym">{c.sym}</div>
                    </div>
                  </div>
                  <div className="t-price">{fp(c.price)}</div>
                  <div className="t-chg">
                    <span className={`pill ${c.c24 >= 0 ? 'up' : 'dn'}`}>
                      {c.c24 >= 0 ? '▲' : '▼'}{Math.abs(c.c24).toFixed(2)}%
                    </span>
                  </div>
                  <div className="t-w7" style={{ color: c.c7 >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {c.c7 >= 0 ? '+' : ''}{c.c7.toFixed(2)}%
                  </div>
                  <div className="t-vol">{c.vol}</div>
                  <div className="t-mcap">{c.mcap}</div>
                  <div className="t-spark">
                    <Sparkline data={sp} color={sc} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="paginator">
            <div className="pg-info">Showing 1–{filtered.length} of 500</div>
            <div className="pg-btns">
              <button className="pg-btn">‹</button>
              <button className="pg-btn on">1</button>
              <button className="pg-btn">2</button>
              <button className="pg-btn">3</button>
              <button className="pg-btn">…</button>
              <button className="pg-btn">25</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        </div>

        <div className="right-col">
          <div className="detail-card fi" style={{ animationDelay: '.16s' }}>
            {!selectedCoin ? (
              <div className="dc-empty">
                <div className="dc-empty-ico">📡</div>
                <div className="dc-empty-txt">SELECT A COIN TO VIEW DETAILS</div>
              </div>
            ) : (
              <>
                <div className="dc-hd">
                  <div className="dc-orb" style={{ background: selectedCoin.bg, boxShadow: `0 0 16px ${selectedCoin.color}55` }}>
                    {selectedCoin.icon}
                  </div>
                  <div>
                    <div className="dc-name">{selectedCoin.name}</div>
                    <div className="dc-sym">{selectedCoin.sym} / USDT</div>
                  </div>
                  <div>
                    <div className="dc-price" style={{ color: selectedCoin.c24 >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {fp(selectedCoin.price)}
                    </div>
                    <div className="dc-chg" style={{ color: selectedCoin.c24 >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {selectedCoin.c24 >= 0 ? '▲' : '▼'} {Math.abs(selectedCoin.c24).toFixed(2)}% (24h)
                    </div>
                  </div>
                </div>
                <div className="dc-chart">
                  <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
                </div>
                <div className="dc-stats">
                  <div className="dc-stat">
                    <div className="dc-stat-lbl">24h High</div>
                    <div className="dc-stat-val" style={{ color: 'var(--green)' }}>{fp(selectedCoin.price * 1.024)}</div>
                  </div>
                  <div className="dc-stat">
                    <div className="dc-stat-lbl">24h Low</div>
                    <div className="dc-stat-val" style={{ color: 'var(--red)' }}>{fp(selectedCoin.price * 0.978)}</div>
                  </div>
                  <div className="dc-stat">
                    <div className="dc-stat-lbl">Mkt Cap</div>
                    <div className="dc-stat-val">{selectedCoin.mcap}</div>
                  </div>
                  <div className="dc-stat">
                    <div className="dc-stat-lbl">Volume</div>
                    <div className="dc-stat-val">{selectedCoin.vol}</div>
                  </div>
                  <div className="dc-stat">
                    <div className="dc-stat-lbl">ATH</div>
                    <div className="dc-stat-val" style={{ color: 'var(--gold)' }}>{fp(selectedCoin.ath)}</div>
                  </div>
                  <div className="dc-stat">
                    <div className="dc-stat-lbl">7d Change</div>
                    <div className="dc-stat-val" style={{ color: selectedCoin.c7 >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {selectedCoin.c7 >= 0 ? '+' : ''}{selectedCoin.c7.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="dc-acts">
                  <button className="dc-buy">BUY {selectedCoin.sym}</button>
                  <button className="dc-sell">SELL {selectedCoin.sym}</button>
                </div>
              </>
            )}
          </div>

          <div className="small-panel fi" style={{ animationDelay: '.2s' }}>
            <div className="sp-hd">
              <div className="sp-title">
                <div className="live-dot"></div>
                Trending
              </div>
              <div className="sp-right">LAST 24H</div>
            </div>
            <div>
              {TRENDING.map((c, i) => (
                <div key={c.sym} className="tr-item" onClick={() => setSelectedSym(c.sym)}>
                  <div className="tr-rank">#{i + 1}</div>
                  <div className="tr-orb" style={{ background: c.bg }}>{c.icon}</div>
                  <div className="tr-name">
                    {c.name}
                    <br />
                    <span className="tr-sym">{c.sym}</span>
                  </div>
                  <span className="tr-chg up">▲ {c.c24.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="small-panel fi" style={{ animationDelay: '.24s' }}>
            <div className="sp-hd" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="sp-title">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Heatmap
              </div>
              <div className="sp-right">24H PERF</div>
            </div>
            <div className="hm-grid">
              {HM.map(h => {
                const v = h.c;
                const int = Math.min(Math.abs(v) / 9, 1);
                const bg = v >= 0
                  ? `rgba(0,${Math.round(110 + int * 145)},${Math.round(70 * int)},${0.14 + int * 0.42})`
                  : `rgba(${Math.round(110 + int * 145)},${Math.round(18 * int)},${Math.round(28 + int * 28)},${0.14 + int * 0.42})`;
                return (
                  <div key={h.sym} className="hm-cell" style={{ background: bg }} onClick={() => setSelectedSym(h.sym)}>
                    <div className="hm-sym">{h.sym}</div>
                    <div className="hm-chg">{v >= 0 ? '+' : ''}{v.toFixed(2)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="small-panel fi" style={{ animationDelay: '.28s' }}>
            <div className="gl-tabs">
              <div className={`gl-tab ${glMode === 'g' ? 'ong' : ''}`} onClick={() => setGlMode('g')}>
                🚀 GAINERS
              </div>
              <div className={`gl-tab ${glMode === 'l' ? 'onl' : ''}`} onClick={() => setGlMode('l')}>
                📉 LOSERS
              </div>
            </div>
            <div>
              {sortedForGL.slice(0, 5).map(c => (
                <div key={c.sym} className="gl-item" onClick={() => setSelectedSym(c.sym)}>
                  <div className="gl-orb" style={{ background: c.bg }}>{c.icon}</div>
                  <div>
                    <div className="gl-name">{c.name}</div>
                    <div className="gl-price">{fp(c.price)}</div>
                  </div>
                  <span className={`gl-chg ${glMode === 'g' ? 'up' : 'dn'}`}>
                    {glMode === 'g' ? '▲' : '▼'}{Math.abs(c.c24).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Markets;
