import React, { useState } from 'react';
import { MainPriceChart, RSIChart } from '../components/analytics/AnalyticsCharts';
import '../styles/components/analytics.css';

const PAIRS = [
  { sym: 'BTC', name: 'Bitcoin', icon: '₿', bg: 'radial-gradient(circle,#ff9500,#f7931a)', price: 67842, chg: 1.86, rsi: 62.4, macd: 284, bb: 0.74, fg: 72, stoch: 81.2, adx: 38.4, sig: 'STRONG BUY', conf: 84, target: 72400, stop: 65200 },
  { sym: 'ETH', name: 'Ethereum', icon: 'Ξ', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', price: 3541, chg: 2.34, rsi: 68.1, macd: 142, bb: 0.81, fg: 72, stoch: 74.8, adx: 32.1, sig: 'BUY', conf: 76, target: 3820, stop: 3340 },
  { sym: 'SOL', name: 'Solana', icon: '◎', bg: 'radial-gradient(circle,#c074fc,#9945ff)', price: 172.85, chg: -0.82, rsi: 44.2, macd: -28, bb: 0.38, fg: 72, stoch: 42.1, adx: 18.4, sig: 'NEUTRAL', conf: 58, target: 190, stop: 160 },
];

const CHAINS = {
  BTC: [
    { ico: '🔗', n: 'Active Addresses', v: '948K', c: '+4.2%', up: true },
    { ico: '📦', n: 'Transactions/Day', v: '412K', c: '+1.8%', up: true },
    { ico: '💎', n: 'Exchange Outflow', v: '$2.1B', c: '+8.4%', up: true },
    { ico: '⛏', n: 'Hash Rate', v: '612 EH/s', c: '+0.9%', up: true },
  ],
  ETH: [
    { ico: '🔥', n: 'Gas Used', v: '18.4 Gwei', c: '-2.1%', up: false },
    { ico: '🔗', n: 'Active Addresses', v: '614K', c: '+3.8%', up: true },
    { ico: '🔒', n: 'ETH Staked', v: '32.8M', c: '+0.5%', up: true },
    { ico: '💸', n: 'DeFi TVL', v: '$62.4B', c: '+4.2%', up: true },
  ],
};

const INSIGHTS = [
  { ico: '🎯', t: 'BREAKOUT SIGNAL', c: '84%', txt: 'BTC testing $68,400 resistance with volume +34% above 20-day avg.' },
  { ico: '📊', t: 'RSI DIVERGENCE', c: '71%', txt: 'Bearish divergence forming on 4H chart — watch for reversal.' },
  { ico: '🌊', t: 'ELLIOTT WAVE', c: '67%', txt: 'Wave 3 of impulse pattern in progress. Target: $71,200–$74,800.' },
  { ico: '⚡', t: 'MOMENTUM SHIFT', c: '79%', txt: 'MACD histogram expanding bullishly for 6 candles.' },
];

const Analytics = () => {
  const [activePair, setActivePair] = useState(PAIRS[0]);
  const [timeframe, setTimeframe] = useState('1H');
  const [pairMenuOpen, setPairMenuOpen] = useState(false);
  const [activeChain, setActiveChain] = useState('BTC');

  const formatPrice = (v) => {
    if (v >= 10000) return '$' + v.toLocaleString('en', { maximumFractionDigits: 0 });
    if (v >= 100) return '$' + v.toFixed(2);
    return '$' + v.toFixed(2);
  };

  const signals = [
    { name: 'EMA 20/50', sig: activePair.macd > 0 ? 'buy' : 'sell' },
    { name: 'Bollinger Bands', sig: activePair.bb > 0.8 ? 'buy' : activePair.bb < 0.2 ? 'sell' : 'neutral' },
    { name: 'RSI (14)', sig: activePair.rsi > 70 ? 'overbought' : activePair.rsi < 30 ? 'oversold' : 'neutral' },
    { name: 'MACD', sig: activePair.macd > 0 ? 'buy' : 'sell' },
    { name: 'Stoch RSI', sig: activePair.stoch > 80 ? 'overbought' : activePair.stoch < 20 ? 'oversold' : 'neutral' },
    { name: 'ADX', sig: activePair.adx > 25 ? (activePair.chg > 0 ? 'buy' : 'sell') : 'neutral' },
  ];

  const buyCount = signals.filter(s => s.sig === 'buy').length;
  const buyPct = Math.round((buyCount / signals.length) * 100);

  return (
    <main className="analytics-main">
      {/* Page Header */}
      <div className="analytics-page-head">
        <div>
          <div className="analytics-pht">// Analysis Terminal</div>
          <div className="analytics-phsub">// TECHNICAL · ON-CHAIN · AI SIGNALS · REAL-TIME DATA</div>
        </div>
        <div className="analytics-ph-controls">
          <div className={`analytics-pair-pick ${pairMenuOpen ? 'open' : ''}`} onClick={() => setPairMenuOpen(!pairMenuOpen)}>
            <div className="analytics-pp-orb" style={{ background: activePair.bg }}>{activePair.icon}</div>
            <div>
              <div className="analytics-pp-name">{activePair.sym} / USDT</div>
              <div className="analytics-pp-price" style={{ color: activePair.chg >= 0 ? '#00ff88' : '#ff3355' }}>
                {formatPrice(activePair.price)} {activePair.chg >= 0 ? '▲' : '▼'} {Math.abs(activePair.chg).toFixed(2)}%
              </div>
            </div>
            <div className="analytics-pp-caret">▼</div>
            <div className="analytics-pair-menu">
              {PAIRS.map(p => (
                <div key={p.sym} className="analytics-pm-item" onClick={(e) => { e.stopPropagation(); setActivePair(p); setPairMenuOpen(false); }}>
                  <div className="analytics-pm-orb" style={{ background: p.bg }}>{p.icon}</div>
                  <span style={{ flex: 1 }}>{p.sym}/USDT</span>
                  <span style={{ color: p.chg >= 0 ? '#00ff88' : '#ff3355' }}>
                    {p.chg >= 0 ? '+' : ''}{p.chg.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="analytics-tf-pills">
            {['1H', '4H', '1D', '1W'].map(tf => (
              <button key={tf} className={`analytics-pb ${timeframe === tf ? 'on' : ''}`} onClick={() => setTimeframe(tf)}>
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <div className="analytics-ai-banner">
        <div className="analytics-ai-orb">🤖</div>
        <div className="analytics-ai-body">
          <div className="analytics-ai-label">// AI Signal Engine v3.1 · NEXUS Intelligence · DeepSignal Model</div>
          <div className="analytics-ai-text">
            {activePair.chg >= 0 ? 'Bullish' : 'Bearish'} momentum on {activePair.sym}/USDT. 
            RSI {activePair.rsi.toFixed(1)} {activePair.rsi > 70 ? '(overbought)' : activePair.rsi < 30 ? '(oversold)' : '(neutral)'}. 
            Target: <span style={{ color: '#00ff88' }}>{formatPrice(activePair.target)}</span> · 
            Stop: <span style={{ color: '#ff3355' }}>{formatPrice(activePair.stop)}</span>
          </div>
          <div className="analytics-ai-meta">
            Model: DeepSignal-v3 · Confidence: {activePair.conf}% · Pair: {activePair.sym}/USDT
          </div>
        </div>
        <div className="analytics-ai-stats">
          <div className="analytics-ais">
            <div className="analytics-ais-v" style={{ color: '#00ff88' }}>{formatPrice(activePair.target)}</div>
            <div className="analytics-ais-l">Target</div>
          </div>
          <div className="analytics-ais">
            <div className="analytics-ais-v" style={{ color: '#ff3355' }}>{formatPrice(activePair.stop)}</div>
            <div className="analytics-ais-l">Stop</div>
          </div>
          <div className="analytics-ais">
            <div className="analytics-ais-v" style={{ color: '#ffcc00' }}>
              {((activePair.target - activePair.price) / (activePair.price - activePair.stop)).toFixed(1)}x
            </div>
            <div className="analytics-ais-l">R/R</div>
          </div>
          <div className="analytics-ais">
            <div className="analytics-ais-v" style={{ color: '#bf5fff' }}>{activePair.conf}%</div>
            <div className="analytics-ais-l">Conf</div>
          </div>
        </div>
        <div className={`analytics-sig-pill ${activePair.sig.includes('BUY') ? 'buy' : 'neutral'}`}>
          <div className="analytics-sig-dot"></div>
          {activePair.sig}
        </div>
      </div>

      {/* Row A: Main Chart + RSI + Signal Summary */}
      <div className="analytics-row-a">
        <div className="analytics-panel">
          <div className="analytics-phdr">
            <div>
              <div className="analytics-ptitle">
                <div className="analytics-pdot"></div>
                Price · Bollinger Bands · EMA
              </div>
              <div className="analytics-psub">// {activePair.sym}/USDT · {timeframe} · BB(20,2) + EMA20 + EMA50</div>
            </div>
          </div>
          <div className="analytics-chart-area" style={{ height: '215px' }}>
            <MainPriceChart pair={activePair} />
          </div>
        </div>

        <div className="analytics-panel">
          <div className="analytics-phdr">
            <div>
              <div className="analytics-ptitle">
                <div className="analytics-pdot"></div>
                RSI (14) · Stochastic RSI
              </div>
              <div className="analytics-psub">// Relative Strength Index · Divergence Detected</div>
            </div>
          </div>
          <div className="analytics-chart-area" style={{ height: '215px' }}>
            <RSIChart pair={activePair} />
          </div>
        </div>

        <div className="analytics-panel">
          <div className="analytics-phdr">
            <div className="analytics-ptitle">
              <div className="analytics-pdot"></div>
              Signal Summary
            </div>
          </div>
          <div className="analytics-sig-summary">
            {signals.map(s => (
              <div key={s.name} className="analytics-ss-item">
                <span className="analytics-ss-name">{s.name}</span>
                <span className={`analytics-ss-badge ${s.sig}`}>{s.sig.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="analytics-vote-wrap">
            <div className="analytics-vote-lbl">
              <span style={{ color: '#00ff88' }}>BUY {buyPct}%</span>
              <span style={{ color: '#ff3355' }}>SELL {100 - buyPct}%</span>
            </div>
            <div className="analytics-vote-bar">
              <div className="analytics-v-buy" style={{ width: `${buyPct}%` }}></div>
              <div className="analytics-v-sell" style={{ width: `${100 - buyPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicator Strip */}
      <div className="analytics-ind-strip">
        {[
          { label: 'RSI 14', ico: '📊', val: activePair.rsi.toFixed(1), sub: 'Neutral zone', color: '#00f5ff', w: 62 },
          { label: 'MACD', ico: '⚡', val: `+${activePair.macd}`, sub: '▲ Bullish cross', color: '#00ff88', w: 70 },
          { label: 'BB %B', ico: '📈', val: activePair.bb.toFixed(2), sub: 'Near upper band', color: '#ffcc00', w: 74 },
          { label: 'Stoch RSI', ico: '🔵', val: activePair.stoch.toFixed(1), sub: 'OVERBOUGHT', color: '#4fa3ff', w: 81 },
          { label: 'ADX', ico: '🧭', val: activePair.adx.toFixed(1), sub: 'Strong trend', color: '#bf5fff', w: 54 },
          { label: 'OBV Trend', ico: '📦', val: '↑+12%', sub: 'Vol confirms', color: '#00ff88', w: 76 },
          { label: 'ATR 14', ico: '🌊', val: '$1,842', sub: 'High volatility', color: '#b8d4e8', w: 68 },
          { label: 'Fear/Greed', ico: '😱', val: activePair.fg, sub: '● Greed', color: '#ffcc00', w: 72 },
        ].map(ind => (
          <div key={ind.label} className="analytics-icard" style={{ '--ic': ind.color }}>
            <div className="analytics-ic-top">
              <div className="analytics-ic-lbl">{ind.label}</div>
              <div className="analytics-ic-ico">{ind.ico}</div>
            </div>
            <div className="analytics-ic-val" style={{ color: ind.color }}>{ind.val}</div>
            <div className="analytics-ic-sub">{ind.sub}</div>
            <div className="analytics-ic-bar">
              <div className="analytics-ic-fill" style={{ background: ind.color, width: `${ind.w}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Row C: On-chain + AI Insights */}
      <div className="analytics-row-c">
        <div className="analytics-panel">
          <div className="analytics-phdr">
            <div>
              <div className="analytics-ptitle">
                <div className="analytics-pdot"></div>
                On-Chain Metrics
              </div>
              <div className="analytics-psub">// {activeChain} Network Intelligence · Live</div>
            </div>
            <div className="analytics-pact">
              {['BTC', 'ETH'].map(chain => (
                <button key={chain} className={`analytics-pb ${activeChain === chain ? 'on' : ''}`} onClick={() => setActiveChain(chain)}>
                  {chain}
                </button>
              ))}
            </div>
          </div>
          <div className="analytics-onchain-list">
            {CHAINS[activeChain].map((d, i) => (
              <div key={i} className="analytics-oc-item">
                <div className="analytics-oc-ico">{d.ico}</div>
                <div className="analytics-oc-name">{d.n}</div>
                <div style={{ textAlign: 'right' }}>
                  <div className="analytics-oc-val" style={{ color: d.up ? '#00ff88' : '#ff3355' }}>{d.v}</div>
                  <div className="analytics-oc-chg" style={{ color: d.up ? '#00ff88' : '#ff3355' }}>{d.c}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-panel">
          <div className="analytics-phdr">
            <div>
              <div className="analytics-ptitle" style={{ color: '#bf5fff' }}>
                <div className="analytics-pdot" style={{ background: '#bf5fff' }}></div>
                AI Insights
              </div>
              <div className="analytics-psub" style={{ color: 'rgba(191,95,255,.4)' }}>// NEXUS Intelligence Engine</div>
            </div>
          </div>
          <div className="analytics-ai-insights">
            {INSIGHTS.map((ins, i) => (
              <div key={i} className="analytics-ai-ins">
                <div className="analytics-ai-ins-hdr">
                  <span className="analytics-ai-ins-ico">{ins.ico}</span>
                  <span className="analytics-ai-ins-title">{ins.t}</span>
                  <span className="analytics-ai-ins-conf">CONF {ins.c}</span>
                </div>
                <div className="analytics-ai-ins-text">{ins.txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="analytics-sbar">
        <div className="analytics-sbar-lbl">
          <div className="analytics-sdot"></div>
          ANALYSIS
        </div>
        <div className="analytics-sbar-scroll">
          <div className="analytics-sbar-inner">
            {[
              { e: 'AI ENGINE', v: 'ACTIVE', c: 'sp' },
              { e: 'SIGNALS', v: '12 Live', c: 'sc' },
              { e: `${activePair.sym} RSI`, v: activePair.rsi.toFixed(1), c: 'sv' },
              { e: 'MACD', v: 'Bullish Cross', c: 'su' },
              { e: 'BB %B', v: activePair.bb.toFixed(2), c: 'sc' },
            ].map((i, idx) => (
              <div key={idx} className="analytics-sbi">
                <span>{i.e}</span>
                <span className={`analytics-${i.c}`}>{i.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
