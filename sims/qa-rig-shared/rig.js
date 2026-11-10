// The rig, built from code in metres: a bench mat; 7 phones on docks in an arc, each running the app on its own
// screen; the end-to-end lamps on the docks; the host Mac mini; the staging server; the verifier gate; the bin for
// rejected findings; the tray of confirmed bugs beside the QA dashboard; and the rulings line back to the docks.
// update(state) poses it from the model at run position r.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {FINDINGS, N, PERSONAS, phoneAt, TOTAL, TRIP} from './model.js';

const V3 = THREE.Vector3;
export const COL = {
  bg: '#f3eee6', mat: '#e9e2d6', ink: '#24211e', alu: '#c9c6c1', dark: '#2b2a29', glass: '#151617',
  accent: '#e8622c', green: '#2f9e68', grey: '#a8a299', paper: '#fbf8f3',
};
export const GROUPS = ['e2e', 'agents', 'backend', 'verifier', 'rulings'];

// layout
export const ARC = {r: 0.46, cz: 0.3, a: 0.7};
export const phoneBase = (i) => {
  const a = -ARC.a + (2 * ARC.a * i) / (N - 1);
  return {a, x: ARC.r * Math.sin(a), z: ARC.cz - ARC.r * Math.cos(a)};
};
export const GATE = new V3(0, 0.028, 0.15);
export const BIN = {x: -0.22, z: 0.24, w: 0.12, d: 0.09, h: 0.045};
export const TRAY = {x: 0.17, z: 0.24, cols: 10, rows: 9, pitch: 0.0145};
export const TABLET = {x: 0.37, z: 0.25};
export const HOST = {x: -0.41, z: -0.17};
export const SERVER = {x: 0.41, z: -0.2};
const DOCK_H = 0.03;
const PHONE = {w: 0.072, h: 0.15, t: 0.0085, tilt: 0.2};
const TOKEN = 0.011;

const smooth = (x) => {
  const u = Math.min(1, Math.max(0, x));
  return u * u * (3 - 2 * u);
};

export function buildRig() {
  const root = new THREE.Group();
  const groups = Object.fromEntries(GROUPS.map((g) => [g, new THREE.Group()]));
  for (const g of GROUPS) root.add(groups[g]);
  const mats = Object.fromEntries(GROUPS.map((g) => [g, []]));
  const mat = (g, o) => {
    const m = new THREE.MeshStandardMaterial({roughness: 0.55, metalness: 0, ...o});
    m.userData.base = m.opacity;
    if (g) mats[g].push(m);
    return m;
  };
  const mesh = (g, geo, m, pos, parent) => {
    const x = new THREE.Mesh(geo, m);
    x.castShadow = true;
    x.receiveShadow = true;
    if (pos) x.position.set(...pos);
    (parent || groups[g]).add(x);
    return x;
  };
  const rbox = (w, h, d, r = 0.004) => new RoundedBoxGeometry(w, h, d, 3, r);

  // ---------------------------------------------------------------- the bench mat
  const matTop = new THREE.Mesh(rbox(1.34, 0.012, 0.8, 0.006), new THREE.MeshStandardMaterial({color: COL.mat, roughness: 0.9}));
  matTop.position.set(0, 0.006, 0.02);
  matTop.receiveShadow = true;
  root.add(matTop);

  // ---------------------------------------------------------------- docks, phones, screens, lamps
  const alu = mat('agents', {color: COL.alu, metalness: 0.6, roughness: 0.45});
  const body = mat('agents', {color: COL.dark, metalness: 0.3, roughness: 0.45});
  const lampOff = new THREE.Color('#d8d2c8');
  const lampOn = new THREE.Color(COL.green);
  const phones = [];
  const lamps = [];
  const screens = [];
  for (let i = 0; i < N; i++) {
    const {a, x, z} = phoneBase(i);
    const dock = new THREE.Group();
    dock.position.set(x, 0.012, z);
    dock.rotation.y = -a;
    groups.agents.add(dock);
    mesh('agents', rbox(0.1, DOCK_H, 0.07, 0.006), alu, [0, DOCK_H / 2, 0], dock);
    // three e2e lamps on the dock's front lip
    for (let k = 0; k < 3; k++) {
      const lm = mat('e2e', {color: lampOff.clone(), emissive: '#000000', roughness: 0.3});
      const l = mesh('e2e', new THREE.CylinderGeometry(0.0042, 0.0042, 0.003, 20), lm, [-0.022 + k * 0.022, 0.012, 0.0352], dock);
      l.rotation.x = Math.PI / 2;
      lamps.push({m: lm, i, k});
    }
    // the phone, leaning back in its slot; the pose group lets a picked phone step forward
    const pose = new THREE.Group();
    pose.position.set(0, DOCK_H, -0.006);
    dock.add(pose);
    const ph = new THREE.Group();
    ph.rotation.x = -PHONE.tilt;
    pose.add(ph);
    mesh('agents', rbox(PHONE.w, PHONE.h, PHONE.t, 0.009), body, [0, PHONE.h / 2 - 0.006, 0], ph);
    const cv = document.createElement('canvas');
    cv.width = 200;
    cv.height = 420;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(PHONE.w - 0.006, PHONE.h - 0.008), mat('agents', {map: tex, roughness: 0.25, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.55}));
    scr.position.set(0, PHONE.h / 2 - 0.006, PHONE.t / 2 + 0.0004);
    ph.add(scr);
    screens.push({cv, ctx: cv.getContext('2d'), tex});
    phones.push({dock, pose, a, x, z});
  }

  // the bus rail behind the docks, out to the host
  const railPts = [];
  for (let k = 0; k <= 40; k++) {
    const a = -ARC.a - 0.12 + ((2 * ARC.a + 0.24) * k) / 40;
    railPts.push(new V3((ARC.r + 0.07) * Math.sin(a), 0.016, ARC.cz - (ARC.r + 0.07) * Math.cos(a)));
  }
  railPts.unshift(new V3(HOST.x + 0.05, 0.016, HOST.z + 0.06));
  const railMat = mat('e2e', {color: COL.ink, roughness: 0.6});
  mesh('e2e', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts), 120, 0.0035, 8), railMat);

  // ---------------------------------------------------------------- the host Mac mini
  const hostMat = mat('e2e', {color: '#d9d7d3', metalness: 0.7, roughness: 0.4});
  mesh('e2e', rbox(0.197, 0.036, 0.197, 0.012), hostMat, [HOST.x, 0.012 + 0.018, HOST.z]);
  const hostLed = mat('e2e', {color: '#ffffff', emissive: COL.green, emissiveIntensity: 1.2});
  mesh('e2e', new THREE.SphereGeometry(0.0022, 12, 8), hostLed, [HOST.x + 0.07, 0.022, HOST.z + 0.0995]);

  // ---------------------------------------------------------------- the staging server and its API lines
  const srvMat = mat('backend', {color: COL.dark, metalness: 0.4, roughness: 0.5});
  const srvLeds = [];
  for (let u = 0; u < 4; u++) {
    mesh('backend', rbox(0.16, 0.026, 0.13, 0.004), srvMat, [SERVER.x, 0.012 + 0.014 + u * 0.029, SERVER.z]);
    const lm = mat('backend', {color: '#ffffff', emissive: COL.green, emissiveIntensity: 0});
    mesh('backend', new THREE.BoxGeometry(0.09, 0.004, 0.002), lm, [SERVER.x - 0.02, 0.012 + 0.014 + u * 0.029, SERVER.z + 0.0655]);
    srvLeds.push(lm);
  }
  const apiLines = [];
  for (let i = 0; i < N; i++) {
    const {x, z} = phoneBase(i);
    const a = new V3(x, 0.03, z - 0.03);
    const b = new V3(SERVER.x - 0.06, 0.06, SERVER.z);
    const c = a.clone().lerp(b, 0.5).add(new V3(0, 0.16 + 0.02 * Math.abs(i - 3), -0.1));
    const curve = new THREE.QuadraticBezierCurve3(a, c, b);
    const lm = new THREE.LineBasicMaterial({color: COL.green, transparent: true, opacity: 0.15, depthWrite: false});
    lm.userData.base = 0.15;
    mats.backend.push(lm);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), lm);
    groups.backend.add(line);
    apiLines.push({curve, lm});
  }
  const apiDots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0035, 10, 8), mat('backend', {color: '#ffffff', emissive: COL.green, emissiveIntensity: 1.4}), N);
  groups.backend.add(apiDots);

  // ---------------------------------------------------------------- the lanes on the mat, phone → gate
  const lanes = [];
  for (let i = 0; i < N; i++) {
    const {a, x, z} = phoneBase(i);
    const p0 = new V3(x + 0.05 * Math.sin(a), 0.0125, z + 0.05 * Math.cos(a));
    const p2 = new V3(0, 0.0125, GATE.z - 0.035);
    const p1 = new V3(x * 0.35, 0.0125, (p0.z + p2.z) / 2 + 0.03);
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    lanes.push(curve);
    const lm = mat('verifier', {color: '#d6cdbf', roughness: 0.9});
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.0016, 6), lm);
    tube.receiveShadow = true;
    groups.verifier.add(tube);
  }

  // ---------------------------------------------------------------- the verifier gate
  const gateMat = mat('verifier', {color: COL.ink, metalness: 0.2, roughness: 0.4});
  const gw = 0.12;
  for (const s of [-1, 1]) mesh('verifier', rbox(0.016, 0.1, 0.04, 0.004), gateMat, [s * (gw / 2), 0.012 + 0.05, GATE.z]);
  mesh('verifier', rbox(gw + 0.016, 0.018, 0.04, 0.004), gateMat, [0, 0.012 + 0.1, GATE.z]);
  mesh('verifier', rbox(gw + 0.05, 0.006, 0.07, 0.003), gateMat, [0, 0.015, GATE.z]);
  const lens = mat('verifier', {color: '#ffffff', emissive: COL.accent, emissiveIntensity: 0.6, roughness: 0.2});
  const eye = mesh('verifier', new THREE.CylinderGeometry(0.012, 0.012, 0.006, 32), lens, [0, 0.012 + 0.1 + 0.012, GATE.z]);
  const scanMat = new THREE.MeshBasicMaterial({color: COL.accent, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide});
  scanMat.userData.base = 1;
  mats.verifier.push(scanMat);
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(gw - 0.016, 0.004), scanMat);
  scan.rotation.x = -Math.PI / 2;
  scan.position.set(0, 0.05, GATE.z);
  groups.verifier.add(scan);

  // the bin for rejected findings: an open box
  const binMat = mat('verifier', {color: '#cfc7ba', roughness: 0.8});
  const {w: bw, d: bd, h: bh} = BIN;
  const wall = (w, d, x, z) => mesh('verifier', new THREE.BoxGeometry(w, bh, d), binMat, [BIN.x + x, 0.012 + bh / 2, BIN.z + z]);
  wall(bw, 0.004, 0, -bd / 2);
  wall(bw, 0.004, 0, bd / 2);
  wall(0.004, bd, -bw / 2, 0);
  wall(0.004, bd, bw / 2, 0);
  mesh('verifier', new THREE.BoxGeometry(bw, 0.003, bd), binMat, [BIN.x, 0.0135, BIN.z]);

  // ---------------------------------------------------------------- the tray of confirmed bugs and the dashboard
  const trayMat = mat('rulings', {color: COL.paper, roughness: 0.7});
  const tw = TRAY.cols * TRAY.pitch + 0.012;
  const td = TRAY.rows * TRAY.pitch + 0.012;
  mesh('rulings', rbox(tw, 0.006, td, 0.003), trayMat, [TRAY.x, 0.015, TRAY.z]);
  const slotMat = mat('rulings', {color: '#e6ded1', roughness: 0.9});
  const slots = new THREE.InstancedMesh(new THREE.BoxGeometry(TRAY.pitch * 0.82, 0.0012, TRAY.pitch * 0.82), slotMat, TOTAL.confirmed);
  const dm = new THREE.Matrix4();
  for (let k = 0; k < TOTAL.confirmed; k++) {
    dm.makeTranslation(...trayCell(k, 0.0185).toArray());
    slots.setMatrixAt(k, dm);
  }
  groups.rulings.add(slots);
  const tab = new THREE.Group();
  tab.position.set(TABLET.x, 0.012, TABLET.z);
  tab.rotation.y = -0.35;
  groups.rulings.add(tab);
  const stand = mat('rulings', {color: COL.alu, metalness: 0.6, roughness: 0.45});
  mesh('rulings', rbox(0.08, 0.01, 0.06, 0.004), stand, [0, 0.005, 0], tab);
  const tabBody = new THREE.Group();
  tabBody.position.set(0, 0.012, -0.01);
  tabBody.rotation.x = -0.55;
  tab.add(tabBody);
  mesh('rulings', rbox(0.25, 0.17, 0.007, 0.01), mat('rulings', {color: COL.dark, metalness: 0.3, roughness: 0.45}), [0, 0.085, 0], tabBody);
  const dcv = document.createElement('canvas');
  dcv.width = 720;
  dcv.height = 480;
  const dtex = new THREE.CanvasTexture(dcv);
  dtex.colorSpace = THREE.SRGBColorSpace;
  dtex.anisotropy = 4;
  const dscr = new THREE.Mesh(new THREE.PlaneGeometry(0.236, 0.157), mat('rulings', {map: dtex, roughness: 0.25, emissive: '#ffffff', emissiveMap: dtex, emissiveIntensity: 0.5}));
  dscr.position.set(0, 0.085, 0.0039);
  tabBody.add(dscr);

  // the rulings line: from the dashboard, over the bench, back into the bus rail
  const memCurve = new THREE.CatmullRomCurve3([
    new V3(TABLET.x + 0.04, 0.02, TABLET.z - 0.04),
    new V3(0.52, 0.12, -0.12),
    new V3(0.38, 0.2, -0.28),
    new V3(0.2, 0.06, -0.22),
    new V3(ARC.r * Math.sin(0.3) + 0.02, 0.018, ARC.cz - (ARC.r + 0.07) * Math.cos(0.3)),
  ]);
  const memMat = mat('rulings', {color: COL.accent, roughness: 0.5, transparent: true, opacity: 0.55});
  mesh('rulings', new THREE.TubeGeometry(memCurve, 80, 0.0018, 6), memMat);
  const memDots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.005, 12, 8), mat('rulings', {color: '#ffffff', emissive: COL.accent, emissiveIntensity: 1.2}), 6);
  groups.rulings.add(memDots);

  // ---------------------------------------------------------------- the findings
  const tokMat = new THREE.MeshStandardMaterial({roughness: 0.4, metalness: 0.05});
  const tokens = new THREE.InstancedMesh(rbox(TOKEN, TOKEN, TOKEN, 0.002), tokMat, FINDINGS.length);
  tokens.castShadow = true;
  tokens.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  root.add(tokens);
  const cInk = new THREE.Color(COL.ink);
  const cAcc = new THREE.Color(COL.accent);
  const cGrey = new THREE.Color(COL.grey);
  const cGreen = new THREE.Color(COL.green);
  const cHi = new THREE.Color('#ffffff');
  // the bin heap: a fixed place for each rejected finding, filled in order
  const rej = FINDINGS.filter((f) => !f.ok);
  const heap = new Map();
  rej.forEach((f, k) => {
    const cols = 8;
    const rows = 6;
    const layer = Math.floor(k / (cols * rows));
    const c = k % cols;
    const rr = Math.floor(k / cols) % rows;
    const jx = (((f.i * 37) % 7) / 7 - 0.5) * 0.004;
    heap.set(f, new V3(BIN.x - BIN.w / 2 + 0.012 + c * 0.0137 + jx + (layer % 2) * 0.006, 0.0155 + TOKEN / 2 + layer * TOKEN * 0.92, BIN.z - BIN.d / 2 + 0.012 + rr * 0.0135));
  });
  const conf = FINDINGS.filter((f) => f.ok);
  const slotOf = new Map(conf.map((f, k) => [f, k]));
  function trayCell(k, y) {
    const c = k % TRAY.cols;
    const r = Math.floor(k / TRAY.cols);
    return new V3(TRAY.x - ((TRAY.cols - 1) * TRAY.pitch) / 2 + c * TRAY.pitch, y, TRAY.z - ((TRAY.rows - 1) * TRAY.pitch) / 2 + r * TRAY.pitch);
  }

  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const sc = new V3();
  const p = new V3();
  const tmp = new V3();
  const col = new THREE.Color();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

  // where a finding is at r, and its colour
  const tokenAt = (f, r, picked) => {
    const d = r - f.flag;
    if (d < 0) return null;
    const lane = lanes[f.phone];
    let s = 1;
    let c = cInk;
    if (d < TRIP.toGate) {
      // out of the dock and along its lane into the gate
      const k = smooth(d / TRIP.toGate);
      lane.getPoint(k, p);
      p.y += TOKEN / 2 + 0.002 + Math.sin(Math.PI * Math.min(1, d / 0.25)) * 0.02 * (1 - k);
      p.x += (f.lane - 0.5) * 0.006 * (1 - k);
    } else if (d < TRIP.toGate + TRIP.inGate) {
      // held under the eye; the verdict colour arrives at the end
      const k = (d - TRIP.toGate) / TRIP.inGate;
      p.set(0, 0.012 + 0.006 + TOKEN / 2 + 0.03 * Math.sin(Math.PI * k), GATE.z);
      if (k > 0.8) c = f.ok ? cAcc : cGrey;
    } else {
      const k = Math.min(1, (d - TRIP.toGate - TRIP.inGate) / TRIP.out);
      const from = tmp.set(0, 0.018 + TOKEN / 2, GATE.z + 0.03);
      const to = f.ok ? trayCell(slotOf.get(f), 0.0185 + TOKEN / 2) : heap.get(f);
      const e = smooth(k);
      p.copy(from).lerp(to, e);
      p.y += Math.sin(Math.PI * e) * (f.ok ? 0.06 : 0.08);
      c = f.ok ? (f.fix <= r ? cGreen : cAcc) : cGrey;
      if (!f.ok && k >= 1) s = 0.92;
    }
    if (picked >= 0 && f.phone !== picked && d < TRIP.toGate + TRIP.inGate) s *= 0.7;
    return {s, c};
  };

  // ---------------------------------------------------------------- pose from the state
  const update = (st) => {
    const r = st.r;
    const picked = st.picked ?? -1;
    // phones step forward when picked, the rest lean back a little
    phones.forEach((ph, i) => {
      const k = st.pick?.[i] ?? 0;
      ph.pose.position.set(0, DOCK_H + 0.035 * k, -0.006 + 0.1 * k);
      ph.pose.rotation.x = 0.12 * k;
    });
    // lamps: during the e2e share of each run they light one by one, then hold green
    const runK = r - Math.floor(r);
    for (const L of lamps) {
      const order = (L.i * 3 + L.k) / (N * 3);
      const on = r >= TOTAL.runs || runK > order * 0.15 ? 1 : 0;
      L.m.color.copy(on ? lampOn : lampOff);
      L.m.emissive.copy(lampOn).multiplyScalar(on ? 0.6 : 0);
    }
    // API calls: a dot runs phone → server when a phone's screen changes
    for (let i = 0; i < N; i++) {
      const s = phoneAt(i, r);
      const k = s.local;
      const live = !s.e2e && r < TOTAL.runs;
      apiLines[i].lm.opacity = apiLines[i].lm.userData.base * (st.fade?.backend ?? 1) * (live ? 1 + 2 * (1 - k) : 0.6);
      if (live && k < 0.5) {
        apiLines[i].curve.getPoint(k * 2, p);
        m4.compose(p, q.identity(), sc.setScalar(1));
      } else m4.copy(hidden);
      apiDots.setMatrixAt(i, m4);
    }
    apiDots.instanceMatrix.needsUpdate = true;
    let busy = 0;
    for (let u = 0; u < srvLeds.length; u++) srvLeds[u].emissiveIntensity = 0.3 + 0.9 * (0.5 + 0.5 * Math.sin(r * 9 + u * 1.9)) * (r < TOTAL.runs ? 1 : 0.2);
    // findings
    let inGate = 0;
    FINDINGS.forEach((f, k) => {
      const at = tokenAt(f, r, picked);
      if (!at) {
        tokens.setMatrixAt(k, hidden);
        return;
      }
      const d = r - f.flag;
      if (d >= TRIP.toGate && d < TRIP.toGate + TRIP.inGate) inGate++;
      if (d < TRIP.toGate) busy++;
      m4.compose(p, q.identity(), sc.setScalar(at.s));
      tokens.setMatrixAt(k, m4);
      col.copy(at.c);
      if (picked >= 0 && f.phone === picked && d < TRIP.toGate + TRIP.inGate) col.lerp(cAcc, 0.65);
      tokens.setColorAt(k, col);
    });
    tokens.instanceMatrix.needsUpdate = true;
    if (tokens.instanceColor) tokens.instanceColor.needsUpdate = true;
    // the gate: the scan bar sweeps while something is under the eye
    const g = Math.min(1, inGate);
    scanMat.opacity = 0.85 * g * (st.fade?.verifier ?? 1);
    scan.position.y = 0.02 + 0.07 * (0.5 + 0.5 * Math.sin(r * 18));
    lens.emissiveIntensity = 0.5 + 1.2 * g;
    eye.scale.setScalar(1 + 0.12 * g);
    // the rulings line: a dot runs back to the docks after each confirmed verdict
    let n = 0;
    for (const f of conf) {
      const d = r - f.verdict - TRIP.out;
      if (d >= 0 && d < 1.6 && n < 6) {
        memCurve.getPoint(d / 1.6, p);
        m4.compose(p, q.identity(), sc.setScalar(1));
        memDots.setMatrixAt(n++, m4);
      }
    }
    for (; n < 6; n++) memDots.setMatrixAt(n, hidden);
    memDots.instanceMatrix.needsUpdate = true;
    // isolate: every other subsystem fades to a ghost
    for (const gk of GROUPS) {
      const a = st.fade?.[gk] ?? 1;
      for (const m of mats[gk]) {
        if (m === scanMat) continue;
        const base = m.userData.base ?? 1;
        const tr = a < 0.999 || base < 1;
        if (m.transparent !== tr) {
          m.transparent = tr;
          m.needsUpdate = true;
        }
        m.opacity = base * a;
        m.depthWrite = a > 0.5;
      }
    }
    return {busy, inGate};
  };

  return {root, groups, phones, screens, dashboard: {cv: dcv, ctx: dcv.getContext('2d'), tex: dtex}, update, lanes, memCurve};
}

// where to point a label at, per part (world coordinates)
export const PART_AT = {
  phones: () => {
    const {x, z} = phoneBase(3);
    return new V3(x, 0.15, z - 0.01);
  },
  lamps: () => {
    const {x, z} = phoneBase(1);
    return new V3(x, 0.025, z + 0.035);
  },
  host: () => new V3(HOST.x, 0.05, HOST.z),
  server: () => new V3(SERVER.x, 0.13, SERVER.z),
  gate: () => new V3(0, 0.13, GATE.z),
  bin: () => new V3(BIN.x, 0.06, BIN.z),
  tray: () => new V3(TRAY.x, 0.025, TRAY.z),
  tablet: () => new V3(TABLET.x, 0.14, TABLET.z - 0.05),
  memory: () => new V3(0.38, 0.2, -0.28),
};
export {PERSONAS};
