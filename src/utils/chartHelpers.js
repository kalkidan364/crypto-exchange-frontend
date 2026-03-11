// Canvas chart drawing utilities

export const prepareCanvas = (canvasRef, height) => {
  if (!canvasRef) return null;
  
  const canvas = canvasRef;
  const parent = canvas.parentElement;
  const W = parent?.clientWidth || 600;
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = W * dpr;
  canvas.height = height * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.fillStyle = '#091520';
  ctx.fillRect(0, 0, W, height);
  
  return { ctx, W, H: height };
};

export const drawGridLines = (ctx, W, H, pad, rows = 4) => {
  ctx.strokeStyle = 'rgba(0,245,255,.045)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= rows; i++) {
    const y = pad.t + (H - pad.t - pad.b) * (i / rows);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(W - pad.r, y);
    ctx.stroke();
  }
};

export const drawYLabels = (ctx, mn, mx, W, H, pad, rows = 4, prefix = '', decimals = 0) => {
  ctx.fillStyle = 'rgba(90,128,144,.4)';
  ctx.font = "8px 'Share Tech Mono'";
  ctx.textAlign = 'right';
  for (let i = 0; i <= rows; i++) {
    const v = mx - (mx - mn) * (i / rows);
    const y = pad.t + (H - pad.t - pad.b) * (i / rows);
    ctx.fillText(prefix + (decimals ? v.toFixed(decimals) : Math.round(v)), pad.l - 4, y + 3);
  }
};

export const drawDateLabels = (ctx, n, W, H, pad, step = 7) => {
  ctx.fillStyle = 'rgba(90,128,144,.35)';
  ctx.font = "8px 'Share Tech Mono'";
  ctx.textAlign = 'center';
  for (let i = 0; i < n; i += step) {
    const d = new Date(Date.now() - (n - 1 - i) * 3600000);
    ctx.fillText((d.getMonth() + 1) + '/' + d.getDate(), pad.l + (i / (n - 1)) * (W - pad.l - pad.r), H - 4);
  }
};

export const formatPrice = (v) => {
  if (v >= 10000) return '$' + v.toLocaleString('en', { maximumFractionDigits: 0 });
  if (v >= 100) return '$' + v.toFixed(2);
  if (v >= 1) return '$' + v.toFixed(2);
  return '$' + v.toFixed(4);
};

// Generate price data for charts
export const generatePriceData = (basePrice, points) => {
  const data = [];
  let price = basePrice;
  
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.5) * 0.02);
    data.push(price);
  }
  
  return data;
};

// Generate sparkline data
export const generateSparklineData = (basePrice, points, isUp) => {
  const data = [];
  let price = basePrice * 0.95;
  const trend = isUp ? 0.52 : 0.48;
  
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - trend) * 0.03);
    data.push(price);
  }
  
  return data;
};

// Draw price chart on canvas
export const drawPriceChart = (canvas, data, color) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  const width = parent.clientWidth;
  const height = parent.clientHeight || 300;
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  
  if (!data || data.length === 0) return;
  
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice;
  
  const xStep = chartWidth / (data.length - 1);
  
  // Draw grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
  
  // Draw price labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const price = maxPrice - (priceRange / 5) * i;
    const y = padding.top + (chartHeight / 5) * i;
    ctx.fillText('$' + price.toFixed(0), padding.left - 10, y + 4);
  }
  
  // Draw gradient fill
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, color.replace('0.8', '0.3'));
  gradient.addColorStop(1, color.replace('0.8', '0.0'));
  
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);
  
  data.forEach((price, index) => {
    const x = padding.left + index * xStep;
    const y = padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    
    if (index === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.lineTo(padding.left + (data.length - 1) * xStep, height - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw line
  ctx.beginPath();
  data.forEach((price, index) => {
    const x = padding.left + index * xStep;
    const y = padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
};
