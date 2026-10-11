/**
 * The hero name heals itself. The letters are cut into small square cells that
 * carry the real glyph edges. The pointer knocks cells loose; small agents in
 * the signal colour fly out, pick the pieces up and put each one back where it
 * belongs. Framework-free so the same engine runs in React and in a plain page.
 */

type Cell = {
  hx: number; hy: number;          // home, top-left, CSS px in canvas space
  x: number; y: number; vx: number; vy: number; r: number; vr: number;
  state: 0 | 1 | 2 | 3;            // home, loose, carried, settling
  agent: number; glow: number; rest: number;
};

type Agent = {
  x: number; y: number; vx: number; vy: number;
  px: number; py: number;          // perch
  load: number[]; target: number;  // carried cell ids, cell id being fetched
};

export type HealingNameOptions = {
  host: HTMLElement;               // the hero section: the canvas covers its box
  name: HTMLElement;               // the h1 (positioned): holds the canvas, takes the pointer, sets the floor
  base: HTMLElement;               // the availability dot the agents live in
  letters: HTMLElement[];          // one element per glyph, in reading order
  ink: () => string;
  signal: () => string;
};

const GRAVITY = 2400, BOUNCE = 0.28, FRICTION = 0.86;
const AGENT_SPEED = 1700, AGENT_ACCEL = 9000, CARRY = 8, MAX_LOOSE = 320;

export function startHealingName(opts: HealingNameOptions): () => void {
  const { host, name, base, letters } = opts;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', left: '0', top: '0', pointerEvents: 'none', zIndex: '1' });
  // The canvas lives inside the name so it rides the name's scroll drift, and
  // reaches up over the whole section so the crew can fly down from the dot.
  name.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const glyphs = document.createElement('canvas');
  const gctx = glyphs.getContext('2d')!;

  let W = 0, H = 0, dpr = 1, cs = 4, floor = 0, bx = 0, by = 0, nameTop = 0;
  let cells: Cell[] = [], agents: Agent[] = [], queue: number[] = [];
  let frame = 0, last = 0, alive = true, idleAt = 0;
  let pointer = { x: 0, y: 0, vx: 0, vy: 0, t: 0, in: false };

  function layout() {
    const box = host.getBoundingClientRect();
    const nb = name.getBoundingClientRect(), bb = base.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(letters[0]).fontSize);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cs = Math.max(5, Math.round(fontSize / 16));
    W = Math.ceil(box.width);
    H = Math.ceil(box.height);
    nameTop = nb.top - box.top;
    floor = Math.min(H - 2, nb.bottom - box.top + fontSize * 0.04);
    bx = bb.left - box.left + bb.width / 2; by = bb.top - box.top + bb.height / 2;
    for (const c of [canvas, glyphs]) { c.width = Math.ceil(W * dpr); c.height = Math.ceil(H * dpr); }
    Object.assign(canvas.style, { width: W + 'px', height: H + 'px', left: box.left - nb.left + 'px', top: box.top - nb.top + 'px' });

    // Draw every glyph where the browser laid it out. The box of a one-glyph
    // inline-block is its advance plus letter-spacing, and its baseline sits
    // half the leading below the top, as CSS places it.
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.clearRect(0, 0, W, H);
    gctx.fillStyle = opts.ink();
    for (const el of letters) {
      const s = getComputedStyle(el);
      const size = parseFloat(s.fontSize);
      gctx.font = `${s.fontWeight} ${size}px ${s.fontFamily}`;
      if ('fontStretch' in gctx) (gctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = 'semi-expanded';
      const m = gctx.measureText(el.textContent || '');
      const r = el.getBoundingClientRect();
      const lh = parseFloat(s.lineHeight) || size;
      const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
      const baseline = r.top - box.top + (lh - (asc + desc)) / 2 + asc;
      const ls = parseFloat(s.letterSpacing) || 0;
      gctx.save();
      gctx.translate(r.left - box.left, 0);
      gctx.scale((r.width - ls) / m.width, 1);
      gctx.fillText(el.textContent || '', 0, baseline);
      gctx.restore();
    }

    // Cut the ink into cells: any cell with ink in it is a piece.
    const y0 = Math.max(0, Math.floor((nameTop - fontSize * 0.2) / cs) * cs), y1 = Math.min(H, floor + cs);
    const img = gctx.getImageData(0, Math.floor(y0 * dpr), glyphs.width, Math.ceil((y1 - y0) * dpr)).data;
    const step = cs * dpr;
    cells = [];
    for (let y = y0; y < y1 - cs; y += cs) for (let x = 0; x < W - cs; x += cs) {
      let ink = 0;
      for (let sy = 1; sy < step && !ink; sy += 2) for (let sx = 1; sx < step; sx += 2) {
        const i = ((Math.floor((y - y0) * dpr) + sy) * glyphs.width + Math.floor(x * dpr) + sx) * 4 + 3;
        if (img[i] > 24) { ink = 1; break; }
      }
      if (ink) cells.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, r: 0, vr: 0, state: 0, agent: -1, glow: 0, rest: 0 });
    }

    // The crew lives in the availability dot and leaves it only for work.
    const n = W < 700 ? 7 : 12;
    agents = [];
    for (let i = 0; i < n; i++) agents.push({ x: bx, y: by, vx: 0, vy: 0, px: bx, py: by, load: [], target: -1 });
    queue = [];
  }

  function knock(px: number, py: number, vx: number, vy: number, radius: number) {
    const speed = Math.hypot(vx, vy);
    let hit = 0, loose = cells.reduce((n, c) => n + (c.state !== 0 ? 1 : 0), 0);
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (c.state !== 0) continue;
      const dx = c.hx + cs / 2 - px, dy = c.hy + cs / 2 - py, d = Math.hypot(dx, dy);
      if (d > radius || loose >= MAX_LOOSE) continue;
      const f = 1 - d / radius;
      c.state = 1; c.x = c.hx; c.y = c.hy;
      c.vx = vx * 0.55 * f + (dx / (d || 1)) * (180 + speed * 0.25) * f + (Math.random() - 0.5) * 120;
      c.vy = vy * 0.55 * f + (dy / (d || 1)) * (180 + speed * 0.25) * f - 220 * f;
      c.vr = (Math.random() - 0.5) * 22; c.r = 0; c.rest = 0;
      queue.push(i); hit++; loose++;
    }
    if (hit) wake();
  }

  function nearestLoose(x: number, y: number) {
    let best = -1, bd = Infinity;
    for (const i of queue) {
      const c = cells[i];
      if (c.state !== 1 || c.agent >= 0) continue;
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  function steer(a: Agent, tx: number, ty: number, dt: number, arrive = 90) {
    const dx = tx - a.x, dy = ty - a.y, d = Math.hypot(dx, dy);
    const want = Math.min(AGENT_SPEED, (d / arrive) * AGENT_SPEED);
    const wx = (dx / (d || 1)) * want, wy = (dy / (d || 1)) * want;
    const ax = wx - a.vx, ay = wy - a.vy, am = Math.hypot(ax, ay), lim = AGENT_ACCEL * dt;
    const k = am > lim ? lim / am : 1;
    a.vx += ax * k; a.vy += ay * k;
    a.x += a.vx * dt; a.y += a.vy * dt;
    return d;
  }

  function update(dt: number) {
    let busy = false;
    for (const c of cells) {
      if (c.glow > 0) { c.glow = Math.max(0, c.glow - dt * 2.6); busy = true; }
      if (c.state === 1) {
        busy = true;
        if (c.rest > 0.4) continue;
        c.vy += GRAVITY * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += c.vr * dt;
        if (c.y + cs > floor) { c.y = floor - cs; c.vy *= -BOUNCE; c.vx *= FRICTION; c.vr *= 0.6; if (Math.abs(c.vy) < 40) { c.vy = 0; c.rest += dt; } }
        if (c.x < 0) { c.x = 0; c.vx *= -0.4; }
        if (c.x > W - cs) { c.x = W - cs; c.vx *= -0.4; }
      }
    }
    agents.forEach((a, ai) => {
      if (a.load.length) {
        // Carry the stack home; drop each piece in turn, nearest first.
        busy = true;
        const ci = a.load[0], c = cells[ci];
        const d = steer(a, c.hx + cs / 2, c.hy + cs / 2, dt, 60);
        a.load.forEach((li, k) => {
          const p = cells[li];
          p.x += (a.x - cs / 2 + Math.sin(k * 2.1) * 3 - p.x) * Math.min(1, dt * 18);
          p.y += (a.y + 3 + k * 1.6 - p.y) * Math.min(1, dt * 18);
          p.r *= 0.9;
        });
        if (d < 3) {
          c.state = 0; c.x = c.hx; c.y = c.hy; c.r = 0; c.agent = -1; c.glow = 1;
          a.load.shift();
          a.load.sort((i, j) => Math.hypot(cells[i].hx - a.x, cells[i].hy - a.y) - Math.hypot(cells[j].hx - a.x, cells[j].hy - a.y));
        }
        return;
      }
      if (a.target < 0) a.target = nearestLoose(a.x, a.y);
      if (a.target >= 0) {
        busy = true;
        const c = cells[a.target];
        if (c.state !== 1) { a.target = -1; return; }
        c.agent = ai;
        const d = steer(a, c.x + cs / 2, c.y + cs / 2, dt, 40);
        if (d < 6) {
          // Scoop up the target and loose neighbours, up to CARRY pieces.
          const near = queue.filter((i) => cells[i].state === 1 && (cells[i].agent < 0 || i === a.target) && Math.hypot(cells[i].x - c.x, cells[i].y - c.y) < cs * 6)
            .slice(0, CARRY);
          for (const i of near) { cells[i].state = 2; cells[i].agent = ai; }
          a.load = near.sort((i, j) => Math.hypot(cells[i].hx - a.x, cells[i].hy - a.y) - Math.hypot(cells[j].hx - a.x, cells[j].hy - a.y));
          queue = queue.filter((i) => cells[i].state === 1);
          a.target = -1;
        }
        return;
      }
      const d = steer(a, a.px, a.py, dt, 120);
      if (d > 0.5 || Math.hypot(a.vx, a.vy) > 5) busy = true; else { a.x = a.px; a.y = a.py; a.vx = a.vy = 0; }
    });
    return busy;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(glyphs, 0, 0, W, H);
    // Cut holes where pieces are missing, then draw each piece where it is.
    ctx.globalCompositeOperation = 'destination-out';
    for (const c of cells) if (c.state !== 0) ctx.fillRect(c.hx, c.hy, cs, cs);
    ctx.globalCompositeOperation = 'source-over';
    const s = cs * dpr;
    for (const c of cells) {
      if (c.state === 0) continue;
      ctx.save();
      ctx.translate(c.x + cs / 2, c.y + cs / 2);
      ctx.rotate(c.r);
      ctx.drawImage(glyphs, c.hx * dpr, c.hy * dpr, s, s, -cs / 2, -cs / 2, cs, cs);
      ctx.restore();
    }
    // A piece just put back shows the signal colour for a moment.
    ctx.fillStyle = opts.signal();
    // Full signal, then a quick cut back to ink: a long blend reads as brown.
    for (const c of cells) if (c.glow > 0 && c.state === 0) { ctx.globalAlpha = Math.min(1, c.glow * 3.5); ctx.fillRect(c.hx, c.hy, cs, cs); }
    ctx.globalAlpha = 1;
    const ar = Math.max(3, cs * 0.42);
    for (const a of agents) {
      const away = Math.hypot(a.x - bx, a.y - by);
      if (away < 4) continue;
      ctx.globalAlpha = Math.min(1, away / 24);
      ctx.beginPath(); ctx.arc(a.x, a.y, ar, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(now: number) {
    const dt = last ? Math.min(0.033, (now - last) / 1000) : 1 / 60;
    last = now;
    const busy = update(dt);
    draw();
    if (busy) idleAt = now;
    frame = alive && (busy || now - idleAt < 300) ? requestAnimationFrame(tick) : 0;
  }
  function wake() { if (!frame && alive) { last = 0; frame = requestAnimationFrame(tick); } }

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top, t = performance.now();
    if (pointer.in && t - pointer.t < 80) {
      const dt = Math.max(0.008, (t - pointer.t) / 1000);
      pointer.vx = (x - pointer.x) / dt; pointer.vy = (y - pointer.y) / dt;
      const speed = Math.hypot(pointer.vx, pointer.vy);
      // A slow hover only nudges; a fast swipe breaks a wider bite.
      if (speed > 250) {
        const steps = Math.ceil(Math.hypot(x - pointer.x, y - pointer.y) / cs);
        for (let i = 1; i <= steps; i++) knock(pointer.x + ((x - pointer.x) * i) / steps, pointer.y + ((y - pointer.y) * i) / steps, pointer.vx, pointer.vy, cs * (1.3 + Math.min(1, speed / 2000)));
      }
    }
    pointer = { ...pointer, x, y, t, in: true };
  };
  const onLeave = () => { pointer.in = false; };
  const onDown = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    knock(e.clientX - r.left, e.clientY - r.top, 0, -600, cs * 3.4);
  };

  let resizeTimer = 0;
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { layout(); draw(); }, 150); };
  const themeWatch = new MutationObserver(() => { layout(); draw(); });

  layout();
  draw();
  letters.forEach((el) => (el.style.color = 'transparent'));
  name.addEventListener('pointermove', onMove);
  name.addEventListener('pointerleave', onLeave);
  name.addEventListener('pointerdown', onDown);
  window.addEventListener('resize', onResize);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // First visit: one letter crumbles by itself so the visitor sees the crew work.
  const intro = window.setTimeout(() => {
    // The left bowl of the first letter: low on the page, away from the CTAs.
    const mid = cells.length ? (cells[0].hy + cells[cells.length - 1].hy) / 2 : 0;
    const o = cells.filter((c) => Math.abs(c.hy - mid) < cs).sort((a, b) => a.hx - b.hx)[0];
    if (o) knock(o.hx + cs, o.hy, 300, -200, cs * 3);
  }, 900);

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    clearTimeout(intro); clearTimeout(resizeTimer);
    name.removeEventListener('pointermove', onMove);
    name.removeEventListener('pointerleave', onLeave);
    name.removeEventListener('pointerdown', onDown);
    window.removeEventListener('resize', onResize);
    themeWatch.disconnect();
    letters.forEach((el) => (el.style.color = ''));
    canvas.remove();
  };
}
