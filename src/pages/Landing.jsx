import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const bgCanvasRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cursor2Ref = useRef(null);
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Custom cursor
  useEffect(() => {
    const cur = cursorRef.current;
    const cur2 = cursor2Ref.current;
    let mx = 0, my = 0, cx = 0, cy = 0;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur2) {
        cur2.style.left = mx + 'px';
        cur2.style.top = my + 'px';
      }
    };

    const loop = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      if (cur) {
        cur.style.left = cx + 'px';
        cur.style.top = cy + 'px';
      }
      requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', handleMouseMove);
    loop();

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background particle canvas
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.3 + 0.05,
        c: Math.random() > 0.6 ? '0,245,255' : Math.random() > 0.5 ? '0,255,136' : '191,95,255'
      });
    }

    let pmx = canvas.width / 2;
    let pmy = canvas.height / 2;

    const handleMouseMove = (e) => {
      pmx = e.clientX;
      pmy = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        const dx = pmx - p.x;
        const dy = pmy - p.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 200) {
          p.vx += dx * 0.00008;
          p.vy += dy * 0.00008;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,245,255,${0.025 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Hero canvas - animated hex grid
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let hexT = 0;

    const drawHex = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      
      const W = canvas.width;
      const H = canvas.height;
      
      ctx.clearRect(0, 0, W, H);
      hexT += 0.004;
      
      const size = 56;
      const cols = Math.ceil(W / (size * 1.73)) + 2;
      const rows = Math.ceil(H / (size * 1.5)) + 2;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * size * 1.73 + (r % 2) * size * 0.87 - size;
          const oy = r * size * 1.5 - size;
          const dist = Math.hypot(ox - W / 2, oy - H / 2) / (W * 0.65);
          const wave = Math.sin(dist * 4 - hexT * 3) * 0.5 + 0.5;
          const al = wave * 0.04 + 0.01;
          
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const x = ox + Math.cos(a) * size * 0.46;
            const y = oy + Math.sin(a) * size * 0.46;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(0,245,255,${al})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      
      requestAnimationFrame(drawHex);
    };

    drawHex();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Ticker data
  const tickerData = [
    { s: 'BTC', p: 67842, c: 1.86 },
    { s: 'ETH', p: 3541, c: 2.34 },
    { s: 'SOL', p: 172.85, c: -0.82 },
    { s: 'BNB', p: 412.3, c: 0.45 },
    { s: 'XRP', p: 0.582, c: -1.21 },
    { s: 'AVAX', p: 38.42, c: 3.12 },
    { s: 'DOGE', p: 0.164, c: 5.44 },
    { s: 'ADA', p: 0.452, c: -0.33 },
    { s: 'DOT', p: 8.21, c: -2.1 },
    { s: 'LINK', p: 14.72, c: 0.88 },
    { s: 'MATIC', p: 0.921, c: 1.55 },
    { s: 'ATOM', p: 9.41, c: 4.21 }
  ];

  // Coins data
  const coins = [
    { name: 'Bitcoin', sym: 'BTC', icon: '₿', bg: 'radial-gradient(circle at 35% 35%,#ff9500,#f7931a,#c45000)', price: 67842.50, chg: 1.86, vol: 'Vol $28.4B' },
    { name: 'Ethereum', sym: 'ETH', icon: 'Ξ', bg: 'radial-gradient(circle at 35% 35%,#8ea3f5,#627eea,#3a5bc7)', price: 3541.20, chg: 2.34, vol: 'Vol $14.2B' },
    { name: 'Solana', sym: 'SOL', icon: '◎', bg: 'radial-gradient(circle at 35% 35%,#c074fc,#9945ff,#6a00e0)', price: 172.85, chg: -0.82, vol: 'Vol $5.1B' },
    { name: 'BNB', sym: 'BNB', icon: 'B', bg: 'radial-gradient(circle at 35% 35%,#f5cc3a,#f3ba2f,#b88a10)', price: 412.30, chg: 0.45, vol: 'Vol $2.8B' },
    { name: 'XRP', sym: 'XRP', icon: '✕', bg: 'radial-gradient(circle at 35% 35%,#00c8f0,#00aae4,#006fa0)', price: 0.5821, chg: -1.21, vol: 'Vol $1.9B' },
    { name: 'AVAX', sym: 'AVAX', icon: 'A', bg: 'radial-gradient(circle at 35% 35%,#ff6060,#e84142,#a00020)', price: 38.42, chg: 3.12, vol: 'Vol $0.9B' }
  ];

  const generateSparkline = (isUp) => {
    const pts = [];
    let v = 50;
    for (let i = 0; i < 22; i++) {
      v += (Math.random() - 0.47) * 8;
      v = Math.max(20, Math.min(80, v));
      pts.push(v);
    }
    if (isUp) pts[pts.length - 1] = pts[pts.length - 2] * 1.06;
    
    const w = 200, h = 48;
    const mx = Math.max(...pts);
    const mn = Math.min(...pts);
    const tx = i => (i / (pts.length - 1)) * w;
    const ty = v => h - ((v - mn) / (mx - mn + 1)) * h * 0.8 - h * 0.05;
    const col = isUp ? '#00ff88' : '#ff2d55';
    
    let d = `M${tx(0)},${ty(pts[0])}`;
    pts.forEach((_, i) => i > 0 && (d += ` L${tx(i)},${ty(pts[i])}`));
    
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="cc-spark" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sg${isUp ? 'u' : 'd'}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={col} stopOpacity=".15" />
            <stop offset="100%" stopColor={col} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#sg${isUp ? 'u' : 'd'})`} />
        <polyline 
          points={pts.map((_, i) => `${tx(i)},${ty(pts[i])}`).join(' ')} 
          fill="none" 
          stroke={col} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    );
  };

  return (
    <div className="landing-nexus">
      <div id="cur" ref={cursorRef}></div>
      <div id="cur2" ref={cursor2Ref}></div>
      <canvas id="bgCanvas" ref={bgCanvasRef}></canvas>
      <div className="scan"></div>

      {/* NAV */}
      <nav ref={navRef} className={scrolled ? 'scrolled' : ''}>
        <a href="#home" className="nav-logo">
          <span className="nl">NEX</span>
          <span className="nr">US</span>
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#markets">Markets</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="nav-cta">
          <button className="btn-out" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-fill" onClick={() => navigate('/dashboard')}>Launch App</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <canvas id="heroCanvas" ref={heroCanvasRef}></canvas>
        <div className="grid-overlay"></div>
        
        <div className="hero-coins">
          <div className="float-card" style={{ top: '18%', left: '5%', '--dur': '7s', '--delay': '0s', '--rot': '-3deg', '--rot2': '1deg' }}>
            <div className="fc-orb" style={{ background: 'radial-gradient(circle,#ff9500,#f7931a)' }}>₿</div>
            <div>
              <div className="fc-name">BTC</div>
              <div className="fc-price">$67,842</div>
              <div className="fc-chg u">▲ 1.86%</div>
            </div>
          </div>
          <div className="float-card" style={{ top: '15%', right: '6%', '--dur': '8s', '--delay': '.5s', '--rot': '2deg', '--rot2': '-1deg' }}>
            <div className="fc-orb" style={{ background: 'radial-gradient(circle,#8ea3f5,#627eea)' }}>Ξ</div>
            <div>
              <div className="fc-name">ETH</div>
              <div className="fc-price">$3,541</div>
              <div className="fc-chg u">▲ 2.34%</div>
            </div>
          </div>
          <div className="float-card" style={{ bottom: '24%', left: '4%', '--dur': '9s', '--delay': '1s', '--rot': '1deg', '--rot2': '-2deg' }}>
            <div className="fc-orb" style={{ background: 'radial-gradient(circle,#c074fc,#9945ff)' }}>◎</div>
            <div>
              <div className="fc-name">SOL</div>
              <div className="fc-price">$172.85</div>
              <div className="fc-chg d">▼ 0.82%</div>
            </div>
          </div>
          <div className="float-card" style={{ bottom: '30%', right: '5%', '--dur': '6s', '--delay': '1.5s', '--rot': '-1deg', '--rot2': '2deg' }}>
            <div className="fc-orb" style={{ background: 'radial-gradient(circle,#f5cc3a,#f3ba2f)' }}>B</div>
            <div>
              <div className="fc-name">BNB</div>
              <div className="fc-price">$412.30</div>
              <div className="fc-chg u">▲ 0.45%</div>
            </div>
          </div>
        </div>

        <div className="hero-eyebrow">
          <div className="eyebrow-line"></div>
          Next-Generation Crypto Trading Platform
          <div className="eyebrow-line"></div>
        </div>

        <div className="hero-title">
          <span className="ht1">TRADE THE</span>
          <span className="ht2">FUTURE</span>
          <span className="ht3">OF FINANCE</span>
        </div>

        <p className="hero-sub">
          The most advanced cryptocurrency terminal on the planet. Real-time data, institutional-grade execution, and unmatched analytics — all in one interface.
        </p>

        <div className="hero-btns">
          <button className="btn-hero-primary" onClick={() => navigate('/dashboard')}>START TRADING FREE</button>
          <button className="btn-hero-secondary">
            <span className="play-icon">
              <svg viewBox="0 0 10 12" fill="currentColor">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            </span>
            Watch Demo
          </button>
        </div>

        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-val">$2.8T</div>
            <div className="hstat-lbl">Trading Volume</div>
            <div className="hstat-chg">▲ 24h</div>
          </div>
          <div className="hstat">
            <div className="hstat-val">14M+</div>
            <div className="hstat-lbl">Active Traders</div>
            <div className="hstat-chg">▲ Growing</div>
          </div>
          <div className="hstat">
            <div className="hstat-val">500+</div>
            <div className="hstat-lbl">Trading Pairs</div>
            <div className="hstat-chg">▲ Listed</div>
          </div>
          <div className="hstat">
            <div className="hstat-val">0.01%</div>
            <div className="hstat-lbl">Maker Fee</div>
            <div className="hstat-chg">↓ Lowest</div>
          </div>
        </div>

        <div className="scroll-ind">
          <div className="scroll-text">SCROLL TO EXPLORE</div>
          <div className="scroll-mouse">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-strip">
        <div className="ts-inner">
          {[...tickerData, ...tickerData].map((t, idx) => {
            const u = t.c >= 0;
            return (
              <div key={idx} className="ts-item">
                <span className="ts-sym">{t.s}</span>
                <span className="ts-price">${t.p < 1 ? t.p.toFixed(4) : t.p.toLocaleString()}</span>
                <span className={`ts-chg ${u ? 'u' : 'd'}`}>{u ? '▲' : '▼'} {Math.abs(t.c).toFixed(2)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="reveal">
          <div className="section-eyebrow">Platform Features</div>
          <div className="section-title">BUILT FOR<br />SERIOUS TRADERS</div>
          <div className="section-sub">Everything you need to dominate the markets — lightning-fast execution to deep analytical tools.</div>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal" style={{ transitionDelay: '.1s' }}>
            <div className="fci fci-cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
            </div>
            <div className="fc-title">REAL-TIME CHARTS</div>
            <div className="fc-desc">Ultra-low latency WebSocket feeds with 200+ technical indicators, custom drawing tools, and multi-timeframe analysis.</div>
            <div className="fc-corner"></div>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '.2s' }}>
            <div className="fci fci-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="fc-title">INSTANT EXECUTION</div>
            <div className="fc-desc">Sub-millisecond order execution with smart routing across 12 liquidity pools for best price discovery.</div>
            <div className="fc-corner"></div>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '.3s' }}>
            <div className="fci fci-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="fc-title">BANK-GRADE SECURITY</div>
            <div className="fc-desc">Cold storage, multi-sig wallets, 2FA, and real-time threat detection protecting over $20B in assets.</div>
            <div className="fc-corner"></div>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '.4s' }}>
            <div className="fci fci-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
            </div>
            <div className="fc-title">AI MARKET SIGNALS</div>
            <div className="fc-desc">Proprietary ML models scanning 10,000+ data points to surface actionable trade setups in real time.</div>
            <div className="fc-corner"></div>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '.5s' }}>
            <div className="fci fci-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div className="fc-title">DEFI INTEGRATION</div>
            <div className="fc-desc">Native access to leading DeFi protocols — yield farming, liquidity pools, and cross-chain bridges in one click.</div>
            <div className="fc-corner"></div>
          </div>

          <div className="feature-card reveal" style={{ transitionDelay: '.6s' }}>
            <div className="fci fci-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="fc-title">MULTI-DEVICE SYNC</div>
            <div className="fc-desc">Seamlessly switch between web, mobile, and desktop. Your settings, portfolios, and alerts follow you everywhere.</div>
            <div className="fc-corner"></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section">
        <div className="stats-row">
          <div className="stat-block reveal">
            <div className="sb-val">$2.8T</div>
            <div className="sb-lbl">Total Volume Traded</div>
          </div>
          <div className="stat-block reveal" style={{ transitionDelay: '.1s' }}>
            <div className="sb-val">14M+</div>
            <div className="sb-lbl">Registered Users</div>
          </div>
          <div className="stat-block reveal" style={{ transitionDelay: '.2s' }}>
            <div className="sb-val">99.99%</div>
            <div className="sb-lbl">Uptime Percentage</div>
          </div>
          <div className="stat-block reveal" style={{ transitionDelay: '.3s' }}>
            <div className="sb-val">150+</div>
            <div className="sb-lbl">Countries Supported</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="how-grid">
          <div className="reveal-l">
            <div className="section-eyebrow">How It Works</div>
            <div className="section-title">THREE STEPS<br />TO LAUNCH</div>
            <div className="section-sub" style={{ marginBottom: '40px' }}>From zero to trading in under 5 minutes. No experience required.</div>
            
            <div className="how-steps">
              <div className="step">
                <div className="step-num">01</div>
                <div>
                  <div className="step-title">CREATE YOUR ACCOUNT</div>
                  <div className="step-desc">Sign up in 60 seconds. Verify your identity with our streamlined KYC powered by AI document scanning.</div>
                </div>
                <div className="step-arrow">→</div>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div>
                  <div className="step-title">FUND YOUR WALLET</div>
                  <div className="step-desc">Deposit crypto or fiat. We support 40+ currencies with instant bank transfers and zero deposit fees.</div>
                </div>
                <div className="step-arrow">→</div>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div>
                  <div className="step-title">START TRADING</div>
                  <div className="step-desc">Access 500+ markets instantly. Set up bots, configure alerts, and let NEXUS work while you sleep.</div>
                </div>
                <div className="step-arrow">→</div>
              </div>
            </div>
          </div>

          <div className="reveal-r">
            <div className="terminal-mock">
              <div className="tm-bar">
                <div className="tm-dot tm-d1"></div>
                <div className="tm-dot tm-d2"></div>
                <div className="tm-dot tm-d3"></div>
                <span className="tm-title">NEXUS TERMINAL — LIVE SESSION</span>
              </div>
              <div className="tm-body">
                <span className="tm-line" style={{ animationDelay: '.2s' }}>
                  <span className="tm-prompt">nexus@ultra:~$</span> <span className="tm-cmd">connect --exchange spot --ws</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '.8s' }}>
                  <span className="tm-out">✓ WebSocket connected (latency: 0.8ms)</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '1.2s' }}>
                  <span className="tm-prompt">nexus@ultra:~$</span> <span className="tm-cmd">fetch BTC/USDT --depth 10</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '1.8s' }}>
                  <span className="tm-out">→ Best ask: </span><span className="tm-out3">$67,845.20</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '2s' }}>
                  <span className="tm-out">→ Best bid: </span><span className="tm-out3">$67,842.50</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '2.4s' }}>
                  <span className="tm-out2">→ Spread: 0.004% | Liquidity: DEEP</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '2.8s' }}>
                  <span className="tm-prompt">nexus@ultra:~$</span> <span className="tm-cmd">order buy BTC 0.5 --limit 67800</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '3.4s' }}>
                  <span className="tm-out">✓ Order placed → ID: NX-0042918</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '4.1s' }}>
                  <span className="tm-out">✓ Order FILLED @ $67,799.90 (0.2ms)</span>
                </span>
                <span className="tm-line" style={{ animationDelay: '4.6s' }}>
                  <span className="tm-prompt">nexus@ultra:~$</span> <span className="tm-cursor"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section id="markets">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Live Markets</div>
          <div className="section-title" style={{ textAlign: 'center' }}>500+ TRADING<br />PAIRS AVAILABLE</div>
        </div>

        <div className="coin-grid">
          {coins.map((c, i) => {
            const u = c.chg >= 0;
            return (
              <div key={i} className="coin-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="cc-top">
                  <div className="cc-orb" style={{ background: c.bg }}>{c.icon}</div>
                  <div>
                    <div className="cc-name">{c.name}</div>
                    <div className="cc-sym">{c.sym}/USDT</div>
                  </div>
                  <div className={`cc-chg ${u ? 'u' : 'd'}`}>
                    {u ? '▲' : '▼'} {Math.abs(c.chg).toFixed(2)}%
                  </div>
                </div>
                <div className="cc-price">
                  {c.price < 1 ? `$${c.price.toFixed(4)}` : `$${c.price.toLocaleString()}`}
                </div>
                {generateSparkline(u)}
                <div className="cc-vol">{c.vol} · 24H</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Pricing Plans</div>
          <div className="section-title" style={{ textAlign: 'center' }}>CHOOSE YOUR<br />TIER</div>
          <div className="section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>No hidden fees. Cancel anytime. All plans include the full terminal.</div>
        </div>

        <div className="plans-grid">
          <div className="plan-card reveal" style={{ transitionDelay: '.1s' }}>
            <div className="plan-tier">// STARTER</div>
            <div className="plan-price"><span>$</span>0</div>
            <div className="plan-period">FOREVER FREE</div>
            <div className="plan-divider"></div>
            <div className="plan-features">
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Up to 10 trades/day
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Basic charting
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                50 trading pairs
              </div>
              <div className="pf">
                <div className="pfc off">—</div>
                <span style={{ color: 'var(--muted)' }}>AI signals</span>
              </div>
              <div className="pf">
                <div className="pfc off">—</div>
                <span style={{ color: 'var(--muted)' }}>API access</span>
              </div>
            </div>
            <button className="plan-btn pb-out" onClick={() => navigate('/login')}>GET STARTED</button>
          </div>

          <div className="plan-card featured reveal" style={{ transitionDelay: '.2s' }}>
            <div className="plan-badge">MOST POPULAR</div>
            <div className="plan-tier" style={{ marginTop: '18px' }}>// PRO</div>
            <div className="plan-price" style={{ color: 'var(--cyan)' }}><span>$</span>49</div>
            <div className="plan-period">PER MONTH</div>
            <div className="plan-divider"></div>
            <div className="plan-features">
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Unlimited trades
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Advanced charting + 200+ indicators
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                500+ trading pairs
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                AI signals &amp; alerts
              </div>
              <div className="pf">
                <div className="pfc off">—</div>
                <span style={{ color: 'var(--muted)' }}>API &amp; bot access</span>
              </div>
            </div>
            <button className="plan-btn pb-fill" onClick={() => navigate('/login')}>START PRO TRIAL</button>
          </div>

          <div className="plan-card reveal" style={{ transitionDelay: '.3s' }}>
            <div className="plan-tier">// ULTRA</div>
            <div className="plan-price"><span>$</span>199</div>
            <div className="plan-period">PER MONTH</div>
            <div className="plan-divider"></div>
            <div className="plan-features">
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Everything in Pro
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Full API &amp; bot suite
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Co-location server access
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Dedicated account manager
              </div>
              <div className="pf">
                <div className="pfc on">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="currentColor">
                    <path d="M1 4l3 3L9 1" />
                  </svg>
                </div>
                Priority 24/7 support
              </div>
            </div>
            <button className="plan-btn pb-out" onClick={() => navigate('/login')}>GO ULTRA</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="about">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Testimonials</div>
          <div className="section-title" style={{ textAlign: 'center' }}>TRUSTED BY<br />ELITE TRADERS</div>
        </div>

        <div className="testi-grid">
          <div className="testi-card reveal" style={{ transitionDelay: '.1s' }}>
            <div className="testi-stars">★★★★★</div>
            <div className="testi-text">"NEXUS changed how I approach markets entirely. The AI signals alone paid for my subscription in the first week."</div>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: 'linear-gradient(135deg,var(--cyan),var(--purple))' }}>AK</div>
              <div>
                <div className="testi-name">ALEX KOVACS</div>
                <div className="testi-role">Hedge Fund Manager, NYC</div>
              </div>
            </div>
          </div>

          <div className="testi-card reveal" style={{ transitionDelay: '.2s' }}>
            <div className="testi-stars">★★★★★</div>
            <div className="testi-text">"The order execution speed is absolutely insane. I've never seen 0.8ms fills anywhere else. This is professional-grade."</div>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: 'linear-gradient(135deg,var(--green),#00a060)' }}>SL</div>
              <div>
                <div className="testi-name">SARAH LIN</div>
                <div className="testi-role">Algorithmic Trader, Singapore</div>
              </div>
            </div>
          </div>

          <div className="testi-card reveal" style={{ transitionDelay: '.3s' }}>
            <div className="testi-stars">★★★★★</div>
            <div className="testi-text">"I've used every major platform. Nothing comes close to NEXUS for real-time data depth and the sheer beauty of the interface."</div>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: 'linear-gradient(135deg,var(--gold),#ff6b00)' }}>MR</div>
              <div>
                <div className="testi-name">MARCO ROSSI</div>
                <div className="testi-role">DeFi Investor, Milan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-ring cr1"></div>
        <div className="cta-ring cr2"></div>
        <div className="cta-ring cr3"></div>
        <div className="cta-title reveal">
          <span className="cta-t1">THE MARKET</span>
          <span className="cta-t2">NEVER SLEEPS</span>
        </div>
        <p className="cta-sub reveal">Join 14 million traders who trust NEXUS to execute their vision. Start for free today.</p>
        <div className="cta-btns reveal">
          <button className="btn-cta-big" onClick={() => navigate('/dashboard')}>LAUNCH NEXUS FREE</button>
          <button className="btn-cta-ghost">VIEW LIVE DEMO</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <a href="#home" className="footer-logo">
              <span className="nl">NEX</span>
              <span className="nr">US</span>
            </a>
            <p className="footer-desc">The world's most advanced cryptocurrency trading terminal. Built for professionals, accessible to everyone.</p>
            <div className="socials">
              <a href="#twitter" className="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#twitch" className="social-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 2H3v16h5v4l4-4h9V2zM7 8h10M7 12h6" />
                </svg>
              </a>
              <a href="#discord" className="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Product</div>
            <div className="footer-links">
              <a href="#terminal">Terminal</a>
              <a href="#mobile">Mobile App</a>
              <a href="#api">API</a>
              <a href="#bots">Trading Bots</a>
              <a href="#defi">DeFi Suite</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
              <a href="#press">Press</a>
              <a href="#blog">Blog</a>
              <a href="#security">Security</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Support</div>
            <div className="footer-links">
              <a href="#help">Help Center</a>
              <a href="#docs">API Docs</a>
              <a href="#status">Status</a>
              <a href="#community">Community</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2026 NEXUS ULTRA INC. ALL RIGHTS RESERVED.</div>
          <div className="footer-legal">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#risk">Risk Disclosure</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
