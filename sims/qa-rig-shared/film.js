// The QA rig film: the two weeks replayed in 30 s. The operator walks the views, picks an agent, isolates the
// verifier, the rulings, the backend and the e2e suite, and ends on the totals. A pure function of t.
import * as THREE from 'three';
import {runSim} from 'teardown-kit/runtime.js';
import {createConsole} from './console.js';
import {N, TOTAL} from './model.js';
import {GROUPS, PART_AT} from './rig.js';
import {createRigStage} from './stage.js';

export const SCRIPT = [
  {t: 0, view: 'hero'},
  {t: 2.4, labels: 1},
  {t: 6.2, labels: 0},
  {t: 6.6, view: 'phones'},
  {t: 7.8, pick: 2},
  {t: 11.0, pick: -1},
  {t: 11.4, view: 'gate'},
  {t: 11.8, iso: 'verifier'},
  {t: 15.2, iso: 'rulings'},
  {t: 15.6, view: 'tray'},
  {t: 18.8, iso: null},
  {t: 19.2, view: 'hero'},
  {t: 19.8, iso: 'backend'},
  {t: 22.0, iso: 'e2e'},
  {t: 24.2, iso: null},
  {t: 24.6, view: 'top'},
  {t: 27.6, view: 'hero'},
];
export const DURATION = 31;
export const R_START = 0.4;
export const R_END = 27.2;
export const DEFAULTS = {duration: DURATION, fps: 60, theme: 'light', hud: {enabled: false, title: 'qa-rig', subtitle: ''}, director: {enabled: false}, watermark: ''};
export const D2R = Math.PI / 180;
const smoother = (x) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * u * (u * (u * 6 - 15) + 10);
};
export const ss = (a, b, t) => smoother((t - a) / (b - a));

/** The one input: run position 0..52 at film time t (eased in and out, steady in the middle). */
export const runAt = (t) => {
  const u = Math.min(1, Math.max(0, (t - R_START) / (R_END - R_START)));
  // a gentle ease at both ends, linear in the middle
  const e = u < 0.08 ? (u * u) / 0.16 : u > 0.92 ? 1 - ((1 - u) * (1 - u)) / 0.16 : u - 0.04;
  return (TOTAL.runs * e) / 0.92;
};

// ------------------------------------------------------------ views (degrees, metres)
export const VIEW_FN = {
  hero: (u) => ({tx: 0.0, ty: 0.05, tz: 0.04, az: 8 + 1.0 * u, el: 28, d: 1.98, sx: 0, sy: 40}),
  phones: (u) => ({tx: 0, ty: 0.07, tz: -0.08, az: 4 + 1.5 * u, el: 24, d: 1.15, sx: 0, sy: 30}),
  gate: (u) => ({tx: -0.05, ty: 0.04, tz: 0.17, az: -22 + 2 * u, el: 30, d: 0.9, sx: 0, sy: 30}),
  tray: (u) => ({tx: 0.3, ty: 0.06, tz: 0.18, az: 8 + 2 * u, el: 32, d: 1.1, sx: 0, sy: 30}),
  top: (u) => ({tx: 0, ty: 0, tz: 0.06, az: 0 + 1 * u, el: 72, d: 1.9, sx: 0, sy: 30}),
};
export const VIEWS = Object.keys(VIEW_FN);
const VIEW_EV = SCRIPT.filter((e) => e.view).map((e) => [e.t, e.view]);
const blend = (a, b, k) => {
  const o = {};
  for (const key in b) o[key] = key === 'az' ? a.az + ((((b.az - a.az + 540) % 360) - 180) * k) : a[key] + (b[key] - a[key]) * k;
  return o;
};
export const camAt = (t) => {
  let i = 0;
  while (i < VIEW_EV.length - 1 && VIEW_EV[i + 1][0] <= t) i++;
  const cur = VIEW_FN[VIEW_EV[i][1]](t - VIEW_EV[i][0]);
  if (i === 0) return cur;
  const k = ss(VIEW_EV[i][0], VIEW_EV[i][0] + 1.5, t);
  return k < 1 ? blend(VIEW_FN[VIEW_EV[i - 1][1]](t - VIEW_EV[i - 1][0]), cur, k) : cur;
};
export const viewAt = (t) => VIEW_EV.filter(([a]) => a <= t).pop();

// ------------------------------------------------------------ pick, isolate, labels at t
const lastOf = (key, t) => SCRIPT.filter((e) => key in e && e.t <= t).pop();
export const pickAt = (t) => lastOf('pick', t)?.pick ?? -1;
export const isoAt = (t) => lastOf('iso', t)?.iso ?? null;
export const labelsAt = (t) => {
  const e = lastOf('labels', t);
  if (!e) return 0;
  const k = ss(e.t, e.t + 0.5, t);
  return e.labels ? k : 1 - k;
};
// eased per-phone pick (0..1) and per-group fade (1 = solid) for a film time
export const pickVec = (t) => {
  const evs = SCRIPT.filter((e) => 'pick' in e && e.t <= t);
  const out = new Array(N).fill(0);
  if (!evs.length) return out;
  const cur = evs[evs.length - 1].pick;
  const prev = evs.length > 1 ? evs[evs.length - 2].pick : -1;
  const k = ss(evs[evs.length - 1].t, evs[evs.length - 1].t + 0.8, t);
  for (let i = 0; i < N; i++) out[i] = (i === cur ? k : 0) + (i === prev && prev !== cur ? 1 - k : 0);
  return out;
};
export const fadeAt = (t) => {
  const evs = SCRIPT.filter((e) => 'iso' in e && e.t <= t);
  const cur = evs.length ? evs[evs.length - 1] : null;
  const prev = evs.length > 1 ? evs[evs.length - 2].iso : null;
  const k = cur ? ss(cur.t, cur.t + 0.7, t) : 1;
  const want = (iso, g) => (iso === null || iso === g ? 1 : 0.14);
  return Object.fromEntries(GROUPS.map((g) => [g, want(prev, g) + (want(cur?.iso ?? null, g) - want(prev, g)) * k]));
};

// ------------------------------------------------------------ the operator's pointer
const REST = [[800, 520], [720, 470], [900, 560], [820, 430]];
export function makeCursor(ui) {
  const EV = SCRIPT.filter((e) => e.t > 0).flatMap((e) => {
    const out = [];
    if (e.view) out.push({t: e.t, spot: ui.spots[`v:${e.view}`]});
    if ('pick' in e) out.push({t: e.t, spot: ui.spots[`p:${e.pick >= 0 ? e.pick : lastPick(e.t)}`]});
    if ('iso' in e) out.push({t: e.t, spot: ui.spots[`g:${e.iso ?? lastIso(e.t)}`]});
    if ('labels' in e) out.push({t: e.t, spot: ui.spots.labels});
    return out.filter((x) => x.spot);
  });
  const WP = [[0, 820, 600]];
  EV.forEach((e, i) => {
    WP.push([e.t - 0.16, ...e.spot], [e.t + 0.22, ...e.spot]);
    WP.push([e.t + 1.3, ...REST[i % REST.length]]);
  });
  WP.sort((a, b) => a[0] - b[0]);
  return (t) => {
    let i = 0;
    while (i < WP.length - 2 && t > WP[i + 1][0]) i++;
    const [t0, x0, y0] = WP[i];
    const [t1, x1, y1] = WP[i + 1];
    const k = ss(t0, t1, t);
    let press = false;
    let ring = 0;
    let rx = 0;
    let ry = 0;
    for (const e of EV) {
      if (t >= e.t - 0.07 && t < e.t + 0.09) press = true;
      if (t >= e.t && t < e.t + 0.55) {
        ring = 1 - (t - e.t) / 0.55;
        [rx, ry] = e.spot;
      }
    }
    return {x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, press, ring, ringX: rx, ringY: ry};
  };
}
function lastPick(t) {
  return SCRIPT.filter((e) => 'pick' in e && e.t < t && e.pick >= 0).pop()?.pick ?? 0;
}
function lastIso(t) {
  return SCRIPT.filter((e) => 'iso' in e && e.t < t && e.iso).pop()?.iso ?? 'verifier';
}

// ------------------------------------------------------------ labels with leaders into the parts
const PARTS = [
  {k: 'phones', name: 'AGENT PHONES', sub: 'ONE SIMULATOR EACH'},
  {k: 'lamps', name: 'E2E LAMPS', sub: 'SCRIPTED SUITE RUNS FIRST'},
  {k: 'host', name: 'HOST MAC MINI', sub: 'RUNS THE WAVE'},
  {k: 'server', name: 'STAGING API + DB', sub: 'EVERY RESULT CHECKED HERE'},
  {k: 'gate', name: 'VERIFIER', sub: 'RE-CHECKS EVERY CLAIM'},
  {k: 'bin', name: 'REJECTED', sub: 'DID NOT HOLD UP'},
  {k: 'tray', name: 'CONFIRMED BUGS', sub: 'ONE CELL EACH, GREEN = FIXED'},
  {k: 'tablet', name: 'QA DASHBOARD', sub: 'ONE-CLICK RULINGS'},
  {k: 'memory', name: 'RULINGS → MEMORY', sub: 'READ ON THE NEXT RUN'},
];
export function makeLabels(st, tall = false) {
  const LO = tall ? {x0: 40, x1: 860, y0: 330, y1: 1060, mid: 450, cl: 40, cr: 680, top: 340, bot: 1040} : {x0: 360, x1: 1240, y0: 120, y1: 700, mid: 800, cl: 370, cr: 1060, top: 140, bot: 690};
  return (o) => {
    if (o < 0.02) return [];
    const pts = PARTS.map((p) => ({p, at: st.project(PART_AT[p.k]())})).filter((x) => x.at && x.at[0] > LO.x0 && x.at[0] < LO.x1 && x.at[1] > LO.y0 && x.at[1] < LO.y1);
    const L = pts.filter((x) => x.at[0] < LO.mid).sort((a, b) => a.at[1] - b.at[1]);
    const R = pts.filter((x) => x.at[0] >= LO.mid).sort((a, b) => a.at[1] - b.at[1]);
    const out = [];
    const stack = (col, x) => {
      let y = LO.top;
      for (const c of col) {
        y = Math.max(y, Math.min(LO.bot, c.at[1] - 40));
        out.push({name: c.p.name, sub: c.p.sub, at: c.at, label: [x, y], w: 180, o});
        y += 40;
      }
    };
    stack(L, LO.cl);
    stack(R, LO.cr);
    return out;
  };
}

export function makeFilm() {
  return async ({canvas, capture}) => {
    const st = createRigStage({canvas});
    const resize = () => st.resize(1600, 900, capture ? devicePixelRatio || 1 : Math.min(devicePixelRatio || 1, 2));
    resize();
    const ui = createConsole(document.getElementById('app'));
    const cursorAt = makeCursor(ui);
    const labels = makeLabels(st);
    window.QA = st;
    return {
      resize,
      render(t) {
        const r = runAt(t);
        const cam = camAt(t);
        const picked = pickAt(t);
        st.frame({r, picked, pick: pickVec(t), fade: fadeAt(t)}, {...cam, az: cam.az * D2R, el: cam.el * D2R});
        ui.update({r, view: viewAt(t)[1], picked, iso: isoAt(t), labelsOn: labelsAt(t) > 0.5, callouts: labels(labelsAt(t)), cursor: cursorAt(t), paused: false, speed: 1});
        return {};
      },
    };
  };
}

export const run = () => runSim(DEFAULTS, makeFilm());
void THREE;
