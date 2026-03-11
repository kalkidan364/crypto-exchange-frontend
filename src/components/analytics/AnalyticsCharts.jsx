import React, { useEffect, useRef } from 'react';

export const MainPriceChart = ({ pair }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawMainChart(canvasRef.current, pair);
  }, [pair]);

  const drawMainChart = (canvas, pair) => {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const W = parent.clientWidth;
    const H = 205;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#091520';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 50, r: 16, t: 8, b: 22 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;
    const n = 70;

    // Generate candles
    const candles = [];
    const prices = [];
    let v = pair.price * 0.9;
    for (let i = 0; i < n; i++) {
      const o = v;
      const c = v * (1 + (Math.random() - 0.474) * 0.02);
      const h = Math.max(o, c) * (1 + Math.random() * 0.006);
      const l = Math.min(o, c) * (1 - Math.random() * 0.006);
      v = c;
      prices.push(c);
      candles.push({ o, h, l, c });
    }
    candles[n - 1].c = pair.price;
    prices[n - 1] = pair.price;

    // Calculate Bollinger Bands
    const bbu = [], bbl = [], ema20 = [];
    for (let i = 19; i < n; i++) {
      const sl = prices.slice(i - 19, i + 1);
      const mean = sl.reduce((a, b) => a + b, 0) / 20;
      const stdv = Math.sqrt(sl.reduce((s, x) => s + (x - mean) ** 2, 0) / 20);
      bbu.push({ i, v: mean + 2 * stdv });
      bbl.push({ i, v: mean - 2 * stdv });
      ema20.push({ i, v: mean });
    }

    const allP = [...candles.flatMap(c => [c.h, c.l]), ...bbu.map(b => b.v), ...bbl.map(b => b.v)];
    const mn = Math.min(...allP) * 0.999;
    const mx = Math.max(...allP) * 1.001;

    const tx = i => pad.l + (i / (n - 1)) * cw;
    const ty = v => pad.t + ch - ((v - mn) / (mx - mn)) * ch;
    const bw = Math.max(1.2, cw / n * 0.6);

    // Draw grid
    ctx.strokeStyle = 'rgba(0,245,255,.045)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (ch * i / 4);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(W - pad.r, y);
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = 'rgba(90,128,144,.4)';
    ctx.font = "8px 'Share Tech Mono'";
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const v = mx - (mx - mn) * (i / 4);
      const y = pad.t + (ch * i / 4);
      ctx.fillText('$' + Math.round(v), pad.l - 4, y + 3);
    }

    // BB fill
    const gbb = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    gbb.addColorStop(0, 'rgba(0,245,255,.035)');
    gbb.addColorStop(1, 'rgba(0,245,255,.005)');
    ctx.beginPath();
    bbu.forEach((b, j) => j === 0 ? ctx.moveTo(tx(b.i), ty(b.v)) : ctx.lineTo(tx(b.i), ty(b.v)));
    [...bbl].reverse().forEach(b => ctx.lineTo(tx(b.i), ty(b.v)));
    ctx.closePath();
    ctx.fillStyle = gbb;
    ctx.fill();

    // BB lines
    ['rgba(0,245,255,.3)', 'rgba(0,245,255,.3)'].forEach((col, idx) => {
      const arr = idx === 0 ? bbu : bbl;
      ctx.beginPath();
      arr.forEach((b, j) => j === 0 ? ctx.moveTo(tx(b.i), ty(b.v)) : ctx.lineTo(tx(b.i), ty(b.v)));
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // EMA20
    ctx.beginPath();
    ema20.forEach((e, j) => j === 0 ? ctx.moveTo(tx(e.i), ty(e.v)) : ctx.lineTo(tx(e.i), ty(e.v)));
    ctx.strokeStyle = 'rgba(255,204,0,.55)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Candles
    candles.forEach((c, i) => {
      const up = c.c >= c.o;
      const col = up ? 'rgba(0,255,136,.85)' : 'rgba(255,51,85,.8)';
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx(i), ty(c.h));
      ctx.lineTo(tx(i), ty(c.l));
      ctx.stroke();
      ctx.fillStyle = col;
      const bt = ty(Math.max(c.o, c.c));
      const bh = Math.max(1, Math.abs(ty(c.o) - ty(c.c)));
      ctx.fillRect(tx(i) - bw / 2, bt, bw, bh);
    });

    // Current price line
    const py = ty(pair.price);
    ctx.strokeStyle = 'rgba(0,245,255,.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(pad.l, py);
    ctx.lineTo(W - pad.r, py);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  return <canvas ref={canvasRef} style={{ width: '100%', height: '205px' }} />;
};

export const RSIChart = ({ pair }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawRSIChart(canvasRef.current, pair);
  }, [pair]);

  const drawRSIChart = (canvas, pair) => {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const W = parent.clientWidth;
    const H = 205;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#091520';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 30, r: 10, t: 8, b: 22 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;
    const n = 70;

    const rsis = [];
    let r = 50;
    for (let i = 0; i < n; i++) {
      r += (Math.random() - 0.46) * 4;
      r = Math.max(12, Math.min(88, r));
      rsis.push(r);
    }
    rsis[n - 1] = pair.rsi;

    const tx = i => pad.l + (i / (n - 1)) * cw;
    const ty = v => pad.t + ch * (1 - v / 100);

    // OB/OS zones
    ctx.fillStyle = 'rgba(255,51,85,.05)';
    ctx.fillRect(pad.l, pad.t, cw, ch * (30 / 100));
    ctx.fillStyle = 'rgba(0,255,136,.05)';
    ctx.fillRect(pad.l, ty(30), cw, ch * (30 / 100));

    // Level lines
    [30, 50, 70].forEach(lvl => {
      const y = ty(lvl);
      ctx.strokeStyle = lvl === 50 ? 'rgba(0,245,255,.04)' : 'rgba(0,245,255,.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash(lvl === 50 ? [] : [2, 5]);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + cw, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(90,128,144,.38)';
      ctx.font = "8px 'Share Tech Mono'";
      ctx.textAlign = 'right';
      ctx.fillText(lvl, pad.l - 4, y + 3);
    });

    // RSI line
    for (let i = 1; i < n; i++) {
      const col = rsis[i] >= 70 ? 'rgba(255,51,85,.85)' : rsis[i] <= 30 ? 'rgba(0,255,136,.85)' : 'rgba(0,245,255,.78)';
      ctx.beginPath();
      ctx.moveTo(tx(i - 1), ty(rsis[i - 1]));
      ctx.lineTo(tx(i), ty(rsis[i]));
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Gradient fill
    const rg = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    rg.addColorStop(0, 'rgba(0,245,255,.08)');
    rg.addColorStop(1, 'rgba(0,245,255,0)');
    ctx.beginPath();
    rsis.forEach((r, i) => i === 0 ? ctx.moveTo(tx(i), ty(r)) : ctx.lineTo(tx(i), ty(r)));
    ctx.lineTo(tx(n - 1), pad.t + ch);
    ctx.lineTo(tx(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = rg;
    ctx.fill();

    // Live dot
    const lx = tx(n - 1);
    const ly = ty(rsis[n - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00f5ff';
    ctx.fill();
  };

  return <canvas ref={canvasRef} style={{ width: '100%', height: '205px' }} />;
};
