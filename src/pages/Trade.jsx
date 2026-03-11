import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/trade.css';

const PAIRS = [
  { sym: 'BTC', quote: 'USDT', icon: '₿', bg: 'radial-gradient(circle,#ff9500,#f7931a)', price: 67842.50, chg: 1.86, vol: '$28.4B' },
  { sym: 'ETH', quote: 'USDT', icon: 'Ξ', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', price: 3541.20, chg: 2.34, vol: '$14.2B' },
  { sym: 'SOL', quote: 'USDT', icon: '◎', bg: 'radial-gradient(circle,#c074fc,#9945ff)', price: 172.85, chg: -0.82, vol: '$5.1B' },
  { sym: 'BNB', quote: 'USDT', icon: 'B', bg: 'radial-gradient(circle,#f5cc3a,#f3ba2f)', price: 412.30, chg: 0.45, vol: '$2.8B' },
  { sym: 'XRP', quote: 'USDT', icon: '✕', bg: 'radial-gradient(circle,#00c8f0,#00aae4)', price: 0.5821, chg: -1.21, vol: '$1.9B' },
  { sym: 'AVAX', quote: 'USDT', icon: 'A', bg: 'radial-gradient(circle,#ff6060,#e84142)', price: 38.42, chg: 3.12, vol: '$0.9B' },
  { sym: 'DOGE', quote: 'USDT', icon: 'Ð', bg: 'radial-gradient(circle,#e8c84a,#c9a227)', price: 0.1641, chg: 5.44, vol: '$1.2B' },
  { sym: 'MATIC', quote: 'USDT', icon: '⬟', bg: 'radial-gradient(circle,#9b59f5,#7b2fe8)', price: 0.88, chg: 1.55, vol: '$0.6B' },
  { sym: 'LINK', quote: 'USDT', icon: '⬡', bg: 'radial-gradient(circle,#3b82f6,#1d4ed8)', price: 14.82, chg: 2.88, vol: '$0.5B' },
  { sym: 'DOT', quote: 'USDT', icon: '●', bg: 'radial-gradient(circle,#e6007a,#9b0054)', price: 7.14, chg: -2.10, vol: '$0.4B' },
  { sym: 'UNI', quote: 'USDT', icon: '🦄', bg: 'radial-gradient(circle,#ff60b0,#e91e8c)', price: 8.24, chg: 4.21, vol: '$0.4B' },
  { sym: 'NEAR', quote: 'USDT', icon: 'N', bg: 'radial-gradient(circle,#00c08b,#008a62)', price: 5.82, chg: 6.77, vol: '$0.7B' },
];

const Trade = () => {
  const mainChartRef = useRef(null);
  const depthChartRef = useRef(null);
  const [activePair, setActivePair] = useState(PAIRS[0]);
  const [tradeMode, setTradeMode] = useState('buy');
  const [orderType, setOrderType] = useState('Limit');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeTF, setActiveTF] = useState('4H');
  const [price, setPrice] = useState(activePair.price.toFixed(2));
  const [amount, setAmount] = useState('0.00000');
  const [total, setTotal] = useState('0.00');
  const [pct, setPct] = useState(100);
  const [candles, setCandles] = useState([]);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [trades, setTrades] = useState([]);

  const fmtPrice = (p) => {
    return p < 1 ? `$${p.toFixed(4)}` : p < 100 ? `$${p.toFixed(2)}` : `$${p.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    generateCandleData();
    buildOrderBook();
    const interval = setInterval(() => {
      addTrade();
    }, 400);
    return () => clearInterval(interval);
  }, [activePair]);

  useEffect(() => {
    if (mainChartRef.current) drawMainChart();
  }, [candles, activeTF]);

  useEffect(() => {
    if (depthChartRef.current) drawDepthChart();
  }, [asks, bids]);

  useEffect(() => {
    calcSummary();
  }, [price, amount]);

  const generateCandleData = (n = 120) => {
    const newCandles = [];
    let v = activePair.price * 0.88;
    const now = Date.now();
    for (let i = 0; i < n; i++) {
      const open = v;
      const move = (Math.random() - 0.47) * v * 0.018;
      const close = v + move;
      const high = Math.max(open, close) * (1 + Math.random() * 0.008);
      const low = Math.min(open, close) * (1 - Math.random() * 0.008);
      const vol = Math.random() * 800 + 100;
      newCandles.push({ t: now - (n - i) * 4 * 3600000, o: open, h: high, l: low, c: close, v: vol });
      v = close;
    }
    newCandles[newCandles.length - 1].c = activePair.price;
    setCandles(newCandles);
  };

  const drawMainChart = () => {
    const canvas = mainChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = canvas.parentElement.clientHeight;
    canvas.width = W;
    canvas.height = H;

    if (!candles.length) return;

    const pad = { l: 56, r: 12, t: 10, b: 44 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b - 36;
    const prices = candles.flatMap(c => [c.h, c.l]);
    const mn = Math.min(...prices) * 0.9994;
    const mx = Math.max(...prices) * 1.0006;
    const volMax = Math.max(...candles.map(c => c.v));

    const tx = i => pad.l + (i + 0.5) / candles.length * cw;
    const ty = v => pad.t + ch - ((v - mn) / (mx - mn)) * ch;
    const cw2 = Math.max(1, (cw / candles.length) * 0.65);

    ctx.fillStyle = '#101418';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(16,185,129,.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.t + ch * (i / 5);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + cw, y);
      ctx.stroke();
    }

    candles.forEach((c, i) => {
      const up = c.c >= c.o;
      const bh = (c.v / volMax) * 30;
      ctx.fillStyle = up ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)';
      ctx.fillRect(tx(i) - cw2 / 2, pad.t + ch + 4, cw2, bh);
    });

    candles.forEach((c, i) => {
      const up = c.c >= c.o;
      const col = up ? '#10b981' : '#ef4444';
      const x = tx(i);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, ty(c.h));
      ctx.lineTo(x, ty(c.l));
      ctx.stroke();
      const bodyTop = ty(Math.max(c.o, c.c));
      const bodyH = Math.max(1, Math.abs(ty(c.o) - ty(c.c)));
      ctx.fillStyle = up ? 'rgba(16,185,129,.9)' : 'rgba(239,68,68,.85)';
      ctx.fillRect(x - cw2 / 2, bodyTop, cw2, bodyH);
    });
  };

  const buildOrderBook = () => {
    const base = activePair.price;
    const newAsks = [];
    const newBids = [];
    for (let i = 1; i <= 14; i++) {
      newAsks.push({ p: base + i * (1 + Math.random() * 3), a: +(Math.random() * 2 + 0.01).toFixed(4) });
      newBids.push({ p: base - i * (1 + Math.random() * 3), a: +(Math.random() * 2 + 0.01).toFixed(4) });
    }
    setAsks(newAsks);
    setBids(newBids);
  };

  const drawDepthChart = () => {
    const canvas = depthChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = canvas.parentElement.clientHeight;
    canvas.width = W;
    canvas.height = H;

    const base = activePair.price;
    const depthBids = [];
    const depthAsks = [];
    let bcum = 0, acum = 0;
    for (let i = 0; i < 40; i++) {
      bcum += Math.random() * 2 + 0.1;
      depthBids.push({ p: base - (i + 1) * base * 0.001, v: bcum });
      acum += Math.random() * 2 + 0.1;
      depthAsks.push({ p: base + (i + 1) * base * 0.001, v: acum });
    }

    const allPrices = [...depthBids.map(b => b.p), ...depthAsks.map(a => a.p)];
    const mn = Math.min(...allPrices);
    const mx = Math.max(...allPrices);
    const mxVol = Math.max(bcum, acum) * 1.05;

    const tx = p => ((p - mn) / (mx - mn)) * W;
    const ty = v => H - 4 - ((v / mxVol) * (H - 12));

    ctx.fillStyle = '#101418';
    ctx.fillRect(0, 0, W, H);

    const gb = ctx.createLinearGradient(0, 0, 0, H);
    gb.addColorStop(0, 'rgba(16,185,129,.25)');
    gb.addColorStop(1, 'rgba(16,185,129,0)');
    ctx.beginPath();
    ctx.moveTo(tx(depthBids[depthBids.length - 1].p), H);
    [...depthBids].reverse().forEach(b => ctx.lineTo(tx(b.p), ty(b.v)));
    ctx.lineTo(tx(base), H);
    ctx.closePath();
    ctx.fillStyle = gb;
    ctx.fill();

    const ga = ctx.createLinearGradient(0, 0, 0, H);
    ga.addColorStop(0, 'rgba(239,68,68,.25)');
    ga.addColorStop(1, 'rgba(239,68,68,0)');
    ctx.beginPath();
    ctx.moveTo(tx(base), H);
    depthAsks.forEach(a => ctx.lineTo(tx(a.p), ty(a.v)));
    ctx.lineTo(tx(depthAsks[depthAsks.length - 1].p), H);
    ctx.closePath();
    ctx.fillStyle = ga;
    ctx.fill();
  };

  const addTrade = () => {
    const base = activePair.price;
    const up = Math.random() > 0.42;
    const p = (base + (Math.random() - 0.5) * 20).toFixed(base < 1 ? 4 : 2);
    const a = (Math.random() * 1.5 + 0.001).toFixed(4);
    const now = new Date();
    const ts = now.toTimeString().split(' ')[0];
    setTrades(prev => [{ p, a, ts, up }, ...prev.slice(0, 59)]);
  };

  const calcSummary = () => {
    const p = parseFloat(price) || activePair.price;
    const amt = parseFloat(amount) || 0;
    const t = p * amt;
    setTotal(t.toFixed(2));
  };

  const handlePctClick = (percentage) => {
    setPct(percentage);
    const maxAmt = 1.2341;
    setAmount((maxAmt * percentage / 100).toFixed(5));
  };

  const selectPair = (pair) => {
    setActivePair(pair);
    setPrice(pair.price.toFixed(pair.price < 1 ? 4 : 2));
  };

  const filteredPairs = PAIRS.filter(p => 
    !searchTerm || p.sym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-content">
      <div className="trade-container">
        <div className="chart-area">
          <div className="ca-toolbar">
            {['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map(tf => (
              <button 
                key={tf}
                className={`ca-tf ${activeTF === tf ? 'on' : ''}`}
                onClick={() => setActiveTF(tf)}
              >
                {tf}
              </button>
            ))}
            <div className="ca-sep"></div>
            <button className="ca-indicator on">MA</button>
            <button className="ca-indicator">BB</button>
            <button className="ca-indicator">RSI</button>
          </div>
          <div className="chart-wrap">
            <canvas ref={mainChartRef}></canvas>
          </div>
        </div>

        <div className="trade-panel">
          <div className="tp-section">
            <div className="tp-header">
              <div className="tp-pair-info">
                <div className="tp-orb" style={{ background: activePair.bg }}>{activePair.icon}</div>
                <div className="tp-pname">{activePair.sym} / USDT</div>
              </div>
              <div className="bs-tabs">
                <div 
                  className={`bs-tab ${tradeMode === 'buy' ? 'on-buy' : ''}`}
                  onClick={() => setTradeMode('buy')}
                >
                  Buy
                </div>
                <div 
                  className={`bs-tab ${tradeMode === 'sell' ? 'on-sell' : ''}`}
                  onClick={() => setTradeMode('sell')}
                >
                  Sell
                </div>
              </div>
              <div className="order-types">
                {['Limit', 'Market', 'Stop-Limit', 'Stop-Mkt'].map(ot => (
                  <button 
                    key={ot}
                    className={`ot-btn ${orderType === ot ? 'on' : ''}`}
                    onClick={() => setOrderType(ot)}
                  >
                    {ot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="tp-form">
            <div className="tf-row">
              <div className="tf-label">
                <span>Price</span>
                <span>Best: {fmtPrice(activePair.price)}</span>
              </div>
              <div className="tf-field">
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span className="tf-unit">USDT</span>
              </div>
            </div>
            
            <div className="tf-row">
              <div className="tf-label">
                <span>Amount</span>
                <span>Avail: 1.2341 {activePair.sym}</span>
              </div>
              <div className="tf-field">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="tf-unit">{activePair.sym}</span>
                <span className="tf-max" onClick={() => handlePctClick(100)}>MAX</span>
              </div>
            </div>

            <div className="tf-row">
              <div className="tf-label"><span>Total</span></div>
              <div className="tf-field">
                <input type="number" value={total} readOnly />
                <span className="tf-unit">USDT</span>
              </div>
            </div>
          </div>

          <div className="tp-actions">
            <div className="pct-row">
              {[25, 50, 75, 100].map(p => (
                <button 
                  key={p}
                  className={`pct-btn ${pct === p ? 'on' : ''}`}
                  onClick={() => handlePctClick(p)}
                >
                  {p}%
                </button>
              ))}
            </div>

            <div className="trade-summary">
              <div className="ts-row">
                <span>Price</span>
                <span>{fmtPrice(parseFloat(price) || activePair.price)}</span>
              </div>
              <div className="ts-row">
                <span>Amount</span>
                <span>{amount} {activePair.sym}</span>
              </div>
              <div className="ts-row">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <div className="ts-row">
                <span>Fee (0.1%)</span>
                <span>${(parseFloat(total) * 0.001).toFixed(2)}</span>
              </div>
            </div>

            <button className={`exec-btn exec-${tradeMode}`}>
              {tradeMode === 'buy' ? 'BUY' : 'SELL'} {activePair.sym}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Trade;
