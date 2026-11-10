// What the phones and the dashboard show, drawn into canvases each frame from the model.
// Phone screens: a car-sharing app (map, car card, booking, payment, trip), the agent's tap ring, the persona strip,
// a flash when that agent flags a finding. Dashboard: the ruling queue and the live counts.
import {countsAt, FINDINGS, PERSONAS, phoneAt, TOTAL, TRIP} from './model.js';

const C = {bg: '#fbf8f3', ink: '#24211e', mute: '#8e867b', line: '#e6ded1', accent: '#e8622c', green: '#2f9e68', map: '#e9efe7', road: '#ffffff', block: '#dbe4d6'};
const SCREENS = ['MAP', 'CAR', 'BOOK', 'PAY', 'TRIP'];
const rr = (g, x, y, w, h, r) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
};

// a tap point per screen and step, deterministic
const TAPS = [
  [[100, 200], [60, 150], [140, 260], [100, 350]],
  [[100, 330], [150, 120], [100, 350], [60, 330]],
  [[100, 180], [100, 240], [100, 300], [100, 360]],
  [[100, 200], [100, 260], [140, 300], [100, 360]],
  [[60, 360], [140, 360], [100, 160], [100, 360]],
];

export function drawPhone(s, i, r, picked) {
  const g = s.ctx;
  const W = 200;
  const H = 420;
  const st = phoneAt(i, r);
  const p = PERSONAS[i];
  g.fillStyle = C.bg;
  g.fillRect(0, 0, W, H);
  // status bar + persona strip
  g.fillStyle = C.ink;
  g.font = '600 11px Inter';
  g.fillText('9:41', 16, 22);
  g.fillRect(W - 34, 13, 20, 9);
  g.fillStyle = picked ? C.accent : C.ink;
  rr(g, 10, 32, W - 20, 26, 6);
  g.fill();
  g.fillStyle = '#fff';
  g.font = "700 11px 'JetBrains Mono'";
  g.fillText(p.name, 18, 49);
  g.textAlign = 'right';
  g.fillText(st.e2e ? 'E2E' : SCREENS[st.screen], W - 18, 49);
  g.textAlign = 'left';
  const y0 = 66;
  if (st.e2e) {
    // the scripted suite runs first: a checklist ticking down, with the exact-euro check
    g.fillStyle = C.ink;
    g.font = '700 15px Inter';
    g.fillText('End-to-end suite', 16, y0 + 26);
    const k = (r - Math.floor(r)) / 0.16;
    const rows = ['Sign in', 'Book a car', 'Start trip', 'End trip', 'Charge, exact €', 'Invoice'];
    rows.forEach((t, j) => {
      const done = k * rows.length > j;
      const y = y0 + 50 + j * 40;
      g.strokeStyle = C.line;
      g.lineWidth = 1;
      rr(g, 14, y, W - 28, 32, 6);
      g.stroke();
      g.fillStyle = done ? C.green : C.line;
      g.beginPath();
      g.arc(30, y + 16, 7, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = C.ink;
      g.font = '500 12px Inter';
      g.fillText(t, 46, y + 20);
    });
  } else if (st.screen === 0 || st.screen === 4) {
    // map with streets and cars
    g.fillStyle = C.map;
    g.fillRect(0, y0, W, 250);
    g.fillStyle = C.block;
    for (let a = 0; a < 4; a++) for (let b = 0; b < 5; b++) g.fillRect(8 + a * 48, y0 + 8 + b * 48, 38, 38);
    g.fillStyle = C.road;
    for (let a = 0; a < 5; a++) g.fillRect(2 + a * 48, y0, 6, 250);
    for (let b = 0; b < 6; b++) g.fillRect(0, y0 + 2 + b * 48, W, 6);
    for (let c = 0; c < 4; c++) {
      const cx = 30 + ((c * 53 + i * 31) % 150);
      const cy = y0 + 30 + ((c * 71 + i * 17) % 200);
      g.fillStyle = c === 0 ? C.accent : C.ink;
      rr(g, cx - 9, cy - 9, 18, 18, 5);
      g.fill();
    }
    if (st.screen === 4) {
      // a trip: a route drawn as the car moves
      g.strokeStyle = C.accent;
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(30, y0 + 220);
      g.lineTo(30 + 140 * st.local, y0 + 220 - 160 * st.local);
      g.stroke();
    }
    g.fillStyle = '#fff';
    rr(g, 10, y0 + 262, W - 20, 82, 10);
    g.fill();
    g.fillStyle = C.ink;
    g.font = '700 14px Inter';
    g.fillText(st.screen === 4 ? 'Trip running' : 'Cars near you', 22, y0 + 288);
    g.fillStyle = C.mute;
    g.font = '500 11px Inter';
    g.fillText(st.screen === 4 ? 'Ends when you park' : 'Tap a car to book', 22, y0 + 308);
    g.fillStyle = C.ink;
    rr(g, 22, y0 + 318, W - 44, 18, 9);
    g.fill();
  } else {
    // a form screen: car card, booking, or payment
    const title = ['', 'The car', 'Book', 'Payment'][st.screen];
    g.fillStyle = C.ink;
    g.font = '700 18px Inter';
    g.fillText(title, 16, y0 + 30);
    g.fillStyle = '#ece6dc';
    rr(g, 14, y0 + 44, W - 28, 92, 10);
    g.fill();
    g.fillStyle = C.ink;
    rr(g, 50, y0 + 70, 100, 34, 10);
    g.fill();
    g.fillStyle = '#ece6dc';
    g.beginPath();
    g.arc(72, y0 + 106, 9, 0, Math.PI * 2);
    g.arc(128, y0 + 106, 9, 0, Math.PI * 2);
    g.fill();
    for (let j = 0; j < 4; j++) {
      const y = y0 + 152 + j * 38;
      g.strokeStyle = C.line;
      g.lineWidth = 1;
      rr(g, 14, y, W - 28, 30, 6);
      g.stroke();
      g.fillStyle = C.mute;
      rr(g, 24, y + 12, 60 + ((j * 23 + i * 7) % 50), 6, 3);
      g.fill();
    }
    g.fillStyle = st.screen === 3 ? C.accent : C.ink;
    rr(g, 14, y0 + 310, W - 28, 36, 18);
    g.fill();
    g.fillStyle = '#fff';
    g.font = '700 13px Inter';
    g.textAlign = 'center';
    g.fillText(st.screen === 3 ? 'Pay' : st.screen === 2 ? 'Confirm booking' : 'Book this car', W / 2, y0 + 333);
    g.textAlign = 'left';
  }
  // the agent's tap
  if (!st.e2e) {
    const steps = TAPS[st.screen];
    const k = st.local * steps.length;
    const j = Math.floor(k);
    const [tx, ty] = steps[Math.min(j, steps.length - 1)];
    const ph = k - j;
    g.strokeStyle = C.accent;
    g.lineWidth = 2.5;
    g.globalAlpha = 1 - ph;
    g.beginPath();
    g.arc(tx, ty, 8 + 16 * ph, 0, Math.PI * 2);
    g.stroke();
    g.globalAlpha = 0.85;
    g.fillStyle = C.accent;
    g.beginPath();
    g.arc(tx, ty, 6, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 1;
  }
  // a finding: the frame flashes and a badge drops in
  if (st.flash > 0) {
    g.strokeStyle = C.accent;
    g.lineWidth = 8 * st.flash;
    g.strokeRect(0, 0, W, H);
    g.fillStyle = C.accent;
    rr(g, 40, H - 52, W - 80, 30, 15);
    g.fill();
    g.fillStyle = '#fff';
    g.font = "700 11px 'JetBrains Mono'";
    g.textAlign = 'center';
    g.fillText('FINDING FLAGGED', W / 2, H - 33);
    g.textAlign = 'left';
  }
  s.tex.needsUpdate = true;
}

let lastKey = '';
export function drawDashboard(d, r) {
  const c = countsAt(r);
  const key = `${c.confirmed}|${c.rejected}|${c.fixed}|${Math.floor(r * 4)}`;
  if (key === lastKey) return;
  lastKey = key;
  const g = d.ctx;
  const W = 720;
  const H = 480;
  g.fillStyle = C.bg;
  g.fillRect(0, 0, W, H);
  g.fillStyle = C.ink;
  g.font = '700 26px Inter';
  g.fillText('QA dashboard', 28, 50);
  g.fillStyle = C.mute;
  g.font = "600 14px 'JetBrains Mono'";
  g.fillText(`RUN ${String(c.run).padStart(2, '0')} / ${TOTAL.runs}`, W - 170, 48);
  const tiles = [['CONFIRMED', c.confirmed, C.accent], ['FIXED', c.fixed, C.green], ['REJECTED', c.rejected, C.mute]];
  tiles.forEach(([t, v, col], k) => {
    const x = 28 + k * 226;
    g.strokeStyle = C.line;
    g.lineWidth = 2;
    rr(g, x, 72, 210, 92, 12);
    g.stroke();
    g.fillStyle = col;
    g.font = '700 44px Inter';
    g.fillText(String(v), x + 18, 130);
    g.fillStyle = C.mute;
    g.font = "600 13px 'JetBrains Mono'";
    g.fillText(t, x + 18, 152);
  });
  // the ruling queue: the newest verdicts, each with its one-click ruling
  g.fillStyle = C.ink;
  g.font = "700 14px 'JetBrains Mono'";
  g.fillText('RULE EACH FINDING', 28, 202);
  const recent = FINDINGS.filter((f) => f.ok && f.verdict + TRIP.out <= r).slice(-5).reverse();
  recent.forEach((f, k) => {
    const y = 218 + k * 50;
    g.strokeStyle = C.line;
    rr(g, 28, y, W - 56, 42, 8);
    g.stroke();
    g.fillStyle = C.accent;
    g.beginPath();
    g.arc(50, y + 21, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = C.ink;
    g.font = '600 16px Inter';
    g.fillText(`Finding #${String(f.i + 1).padStart(3, '0')} · ${PERSONAS[f.phone].name.toLowerCase()}`, 68, y + 27);
    const fixed = f.fix <= r;
    g.fillStyle = fixed ? C.green : C.ink;
    rr(g, W - 196, y + 8, 140, 26, 13);
    g.fill();
    g.fillStyle = '#fff';
    g.font = "700 12px 'JetBrains Mono'";
    g.textAlign = 'center';
    g.fillText(fixed ? 'FIXED' : 'REAL BUG ✓', W - 126, y + 26);
    g.textAlign = 'left';
  });
  d.tex.needsUpdate = true;
}
