// The QA rig as a page you drive. The run timeline scrubs the two weeks, play pauses, the five views, isolate a
// subsystem, pick an agent, labels; drag to orbit, wheel to zoom. Left alone it plays the film's script as an auto
// tour with the operator's cursor; a click, drag, wheel or key hands control over, 25 s of quiet hands it back.
import {warmComposer} from 'teardown-kit/warm.js';
import {createConsole, LAYOUT} from './console.js';
import {camAt, D2R, DURATION, fadeAt, isoAt, labelsAt, makeCursor, makeLabels, pickAt, pickVec, runAt, ss, VIEW_FN, VIEWS, viewAt} from './film.js';
import {N, TOTAL} from './model.js';
import {GROUPS} from './rig.js';
import {createRigStage} from './stage.js';

const TALL = innerHeight > innerWidth * 1.15;
const {W, H} = TALL ? LAYOUT.tall : LAYOUT.wide;
// portrait needs the camera further out to fit the rig's width
const DK = TALL ? 2.15 : 1;
const SY = TALL ? -40 : 0;
const IDLE = 25;
const RUNS_PER_S = 1.9; // the film's pace
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;

const CSS = `
html,body{background:#f3eee6;overflow:hidden;margin:0;overscroll-behavior:none}
#app{position:absolute!important;inset:auto!important;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
#gl{touch-action:none;cursor:grab;position:absolute;left:0;top:0;width:${W}px;height:${H}px}
#gl.drag{cursor:grabbing}
.bt:hover,.ag:hover{filter:brightness(.97)}
.hit{position:absolute;pointer-events:auto;cursor:ew-resize}
.tourchip{position:absolute;left:${TALL ? 450 : 800}px;top:${TALL ? 300 : 40}px;transform:translateX(-50%);display:flex;align-items:center;gap:7px;height:24px;padding:0 12px;border:1px solid #e7dfd2;border-radius:5px;background:rgba(251,248,243,.95);color:#24211e;font:700 9.5px 'JetBrains Mono',monospace;letter-spacing:1.3px;white-space:nowrap;cursor:pointer;pointer-events:auto}
.tourchip i{display:block;width:6px;height:6px;border-radius:50%;background:#e8622c}
.tourchip.on i{animation:blink 1.2s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
`;

export function runLive() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  const app = document.getElementById('app');
  const canvas = document.createElement('canvas');
  canvas.id = 'gl';
  app.appendChild(canvas);
  const st = createRigStage({canvas});
  const ui = createConsole(app, TALL);
  const labels = makeLabels(st, TALL);

  // ------------------------------------------------------------ quality tiers
  const TIERS = [
    {samples: 8, shadow: 2048, pr: 2, every: 1},
    {samples: 4, shadow: 1024, pr: 1.5, every: 2},
    {samples: 0, shadow: 512, pr: 1, every: 3},
  ];
  const light = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 600;
  let tier = light ? 1 : 0;
  let scale = 1;
  const fit = () => {
    scale = Math.min(innerWidth / W, innerHeight / H);
    app.style.transform = `translate(${(innerWidth - W * scale) / 2}px, ${(innerHeight - H * scale) / 2}px) scale(${scale})`;
    st.resize(W, H, clamp((devicePixelRatio || 1) * scale, 0.75, TIERS[tier].pr));
    ui.refreshSpots();
  };
  const applyTier = () => {
    const {samples, shadow} = TIERS[tier];
    st.setQuality({samples, shadow});
    fit();
  };
  applyTier();
  addEventListener('resize', () => {
    if ((innerHeight > innerWidth * 1.15) !== TALL) location.reload();
    else fit();
  });
  const toStage = (cx) => (cx - app.getBoundingClientRect().left) / scale;
  const tourChip = document.createElement('div');
  tourChip.className = 'tourchip';
  ui.root.appendChild(tourChip);
  const tourCursor = makeCursor(ui);

  // ------------------------------------------------------------ state
  let T = 0;
  let r = 0;
  let paused = false;
  let view = 'hero';
  let viewAt0 = 0;
  let iso = null;
  let isoT = -9;
  let isoPrev = null;
  let picked = -1;
  let pickT = -9;
  let pickPrev = -1;
  let labelsOn = 0;
  let labelsT = -9;
  const off = {az: 0, el: 0, k: 1};
  const cam = {...VIEW_FN.hero(0)};
  cam.d *= DK;
  let ring = {t: -9, x: 0, y: 0};
  const pulse = (k) => (ring = {t: T, x: ui.spots[k][0], y: ui.spots[k][1]});

  // ------------------------------------------------------------ the tour
  const AP = {on: true, t0: 0};
  let lastInput = 0;
  const startTour = () => {
    AP.on = true;
    AP.t0 = T;
    paused = false;
    Object.assign(off, {az: 0, el: 0, k: 1});
  };
  const takeOver = () => {
    lastInput = T;
    if (!AP.on) return;
    AP.on = false;
    const cyc = (T - AP.t0) % DURATION;
    const [t0, v] = viewAt(cyc);
    view = v;
    viewAt0 = T - (cyc - t0);
    iso = isoAt(cyc);
    isoPrev = iso;
    picked = pickAt(cyc);
    pickPrev = picked;
    labelsOn = labelsAt(cyc) > 0.5 ? 1 : 0;
    if (r >= TOTAL.runs - 0.01) r = 0;
  };
  tourChip.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    lastInput = T;
    if (AP.on) takeOver();
    else startTour();
  });
  addEventListener('pointerdown', (e) => {
    if (e.target !== tourChip) takeOver();
  });

  // ------------------------------------------------------------ controls
  for (const v of VIEWS)
    ui.btn[`v:${v}`].addEventListener('click', () => {
      takeOver();
      pulse(`v:${v}`);
      view = v;
      viewAt0 = T;
      Object.assign(off, {az: 0, el: 0, k: 1});
    });
  for (const g of GROUPS)
    ui.btn[`g:${g}`].addEventListener('click', () => {
      takeOver();
      pulse(`g:${g}`);
      isoPrev = iso;
      iso = iso === g ? null : g;
      isoT = T;
    });
  for (let i = 0; i < N; i++)
    ui.btn[`p:${i}`]?.addEventListener('click', () => {
      takeOver();
      pulse(`p:${i}`);
      pickPrev = picked;
      picked = picked === i ? -1 : i;
      pickT = T;
    });
  ui.btn.labels.addEventListener('click', () => {
    takeOver();
    pulse('labels');
    labelsOn = labelsOn ? 0 : 1;
    labelsT = T;
  });
  ui.btn.play.addEventListener('click', () => {
    takeOver();
    pulse('play');
    if (r >= TOTAL.runs - 0.01) r = 0;
    paused = !paused;
  });
  {
    const d = document.createElement('div');
    d.className = 'hit';
    Object.assign(d.style, {left: `${ui.TL.x - 8}px`, top: `${ui.TL.y - 15}px`, width: `${ui.TL.w + 16}px`, height: '30px'});
    const move = (e) => {
      r = clamp((toStage(e.clientX) - ui.TL.x) / ui.TL.w, 0, 1) * TOTAL.runs;
      paused = true;
      lastInput = T;
    };
    d.addEventListener('pointerdown', (e) => {
      takeOver();
      d.setPointerCapture(e.pointerId);
      const up = () => {
        removeEventListener('pointermove', move);
        removeEventListener('pointerup', up);
      };
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
      move(e);
    });
    ui.root.appendChild(d);
  }
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const key = e.key.toLowerCase();
    const v = {1: 'hero', 2: 'phones', 3: 'gate', 4: 'tray', 5: 'top'}[key];
    if (v) ui.btn[`v:${v}`].click();
    else if (key === ' ') ui.btn.play.click();
    else if (key === 'l') ui.btn.labels.click();
    else return;
    e.preventDefault();
  });
  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    drag = {x: e.clientX, y: e.clientY};
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('drag');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    off.az -= ((e.clientX - drag.x) / scale) * 0.3;
    off.el = clamp(off.el + ((e.clientY - drag.y) / scale) * 0.2, -20, 55);
    drag = {x: e.clientX, y: e.clientY};
    lastInput = T;
  });
  const endDrag = () => {
    drag = null;
    canvas.classList.remove('drag');
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      takeOver();
      off.k = clamp(off.k * Math.exp(e.deltaY * 0.0012), 0.45, 2.2);
    },
    {passive: false},
  );

  // the visitor's eased pick / isolate / labels, matching the film's shapes
  const livePick = () => {
    const k = ss(pickT, pickT + 0.8, T);
    const out = new Array(N).fill(0);
    for (let i = 0; i < N; i++) out[i] = (i === picked ? k : 0) + (i === pickPrev && pickPrev !== picked ? 1 - k : 0);
    return out;
  };
  const liveFade = () => {
    const k = ss(isoT, isoT + 0.7, T);
    const want = (x, g) => (x === null || x === g ? 1 : 0.14);
    return Object.fromEntries(GROUPS.map((g) => [g, want(isoPrev, g) + (want(iso, g) - want(isoPrev, g)) * k]));
  };

  // ------------------------------------------------------------ the frame
  startTour();
  let last = performance.now();
  const perf = {n: 0, sum: 0, slow: 0, age: 0};
  const frame = (now) => {
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    T += dt;
    if (tier < TIERS.length - 1) {
      perf.age += dt;
      if (perf.age > 0.8) {
        perf.sum += dt;
        perf.n++;
        if (perf.sum >= 0.5 && perf.n >= 6) {
          perf.slow = perf.sum / perf.n > 0.024 ? perf.slow + 1 : 0;
          perf.sum = 0;
          perf.n = 0;
          if (perf.slow >= 2) {
            tier++;
            applyTier();
            Object.assign(perf, {age: 0, slow: 0});
          }
        }
      }
    }
    let tgt;
    let cursor;
    let state;
    let lab;
    if (AP.on) {
      const cyc = (T - AP.t0) % DURATION;
      r = runAt(cyc);
      tgt = camAt(cyc);
      view = viewAt(cyc)[1];
      cursor = tourCursor(cyc);
      state = {r, picked: pickAt(cyc), pick: pickVec(cyc), fade: fadeAt(cyc)};
      lab = labelsAt(cyc);
      iso = isoAt(cyc);
    } else {
      if (T - lastInput > IDLE) startTour();
      if (!paused) r = Math.min(TOTAL.runs, r + dt * RUNS_PER_S);
      if (r >= TOTAL.runs) paused = true;
      tgt = VIEW_FN[view](T - viewAt0);
      tgt.az += off.az;
      tgt.el = clamp(tgt.el + off.el, -15, 85);
      tgt.d *= off.k;
      const rk = Math.max(0, 1 - (T - ring.t) / 0.55);
      cursor = {x: -99, y: -99, press: false, ring: rk, ringX: ring.x, ringY: ring.y};
      state = {r, picked, pick: livePick(), fade: liveFade()};
      const k = ss(labelsT, labelsT + 0.5, T);
      lab = labelsOn ? k : 1 - k;
    }
    tgt = {...tgt, d: tgt.d * DK, sy: (tgt.sy ?? 0) + SY};
    const k = 1 - Math.exp(-dt / (AP.on ? 0.12 : 0.4));
    cam.az += wrap(tgt.az - cam.az) * k;
    for (const key of ['tx', 'ty', 'tz', 'el', 'd', 'sx', 'sy']) cam[key] += (tgt[key] - cam[key]) * k;
    st.frame(state, {...cam, az: cam.az * D2R, el: cam.el * D2R}, {screensEvery: TIERS[tier].every});
    ui.update({r, view, picked: state.picked, iso, labelsOn: lab > 0.5, callouts: labels(lab), cursor, paused: AP.on ? false : paused});
    if (tourChip.classList.contains('on') !== AP.on || !tourChip.firstChild) {
      tourChip.classList.toggle('on', AP.on);
      tourChip.innerHTML = AP.on ? '<i></i>AUTO TOUR · CLICK TO TAKE OVER' : '▶ RESUME TOUR';
    }
    if (!window.SIM_SHOWN) {
      window.SIM_SHOWN = true;
      dispatchEvent(new Event('simframe'));
    }
    requestAnimationFrame(frame);
  };
  warmComposer(st.renderer, st.composer, st.scene, st.camera).then(() => requestAnimationFrame(frame));
  window.LIVE = {st, startTour, takeOver, get tier() {
    return tier;
  }};
}
