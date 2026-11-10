// The QA rig's model. One input drives everything: r, the position in the first two weeks, 0..52 runs.
// The end totals are the measured ones from the write-up. How they spread over the 52 runs is illustrative
// (seeded, front-loaded: early runs find more), and every counter on screen is counted from the same event list
// that moves the tokens, so the panels and the machine can never disagree.
import {rng} from 'teardown-kit/util.js';

export const TOTAL = {
  runs: 52, // QA runs in the first two weeks
  agentRuns: 72, // individual agent sessions inside those runs
  steps: 1270, // logged test steps (about)
  flagged: 301,
  confirmed: 90,
  fixed: 55,
  journeys: 74,
  verified: 64,
  usd: 435, // Claude API list price, all 72 agent runs
};
export const PER_RUN_USD = TOTAL.usd / TOTAL.agentRuns; // ≈ 6.04

export const PERSONAS = [
  {key: 'careful', name: 'CAREFUL', goal: 'Books, drives, returns, pays. By the book.'},
  {key: 'nonpay', name: 'NON-PAYER', goal: 'Tries to drive with a payment that fails.'},
  {key: 'gamer', name: 'GAMER', goal: 'Tries to game the charge rules.'},
  {key: 'signup', name: 'NEW SIGNUP', goal: 'Signs up from scratch, first booking.'},
  {key: 'family', name: 'FAMILY', goal: 'Shares one account across a household.'},
  {key: 'sweepA', name: 'SWEEPER 1', goal: 'Cheaper agent. Covers one area of the app.'},
  {key: 'sweepB', name: 'SWEEPER 2', goal: 'Cheaper agent. Covers another area.'},
];
export const N = PERSONAS.length;

// run-time of the token trip, in runs: phone → gate, held in the gate, gate → tray or bin
export const TRIP = {toGate: 1.1, inGate: 0.55, out: 0.9};
// inside one run: the end-to-end suite lamps first, then the agents explore
export const E2E_SHARE = 0.16;

const R = rng(20261110);
// front-loaded density over 0..1: more findings early, a long tail of harder ones
const early = () => 1 - Math.sqrt(1 - R() * 0.995);

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 301 findings: who flagged it, when, and the verifier's verdict. Exactly 90 confirmed, 55 of those fixed by run 52.
const LAST = TOTAL.runs - TRIP.toGate - TRIP.inGate - TRIP.out - 0.4;
export const FINDINGS = (() => {
  const out = [];
  for (let i = 0; i < TOTAL.flagged; i++) {
    const run = 0.6 + early() * (LAST - 0.6);
    // the agents explore after the e2e lamps, so snap the flag into the agent part of its run
    const base = Math.floor(run);
    const flag = base + E2E_SHARE + (run - base) * (1 - E2E_SHARE);
    out.push({i, phone: Math.floor(R() * N), flag: Math.min(LAST, flag), lane: R()});
  }
  out.sort((a, b) => a.flag - b.flag);
  const idx = shuffle(out.map((_, k) => k));
  const confirmed = new Set(idx.slice(0, TOTAL.confirmed));
  out.forEach((f, k) => {
    f.ok = confirmed.has(k);
    f.verdict = f.flag + TRIP.toGate + TRIP.inGate;
  });
  // fixes land some runs after the verdict; pick 55 confirmed ones whose fix fits before run 52
  const conf = out.filter((f) => f.ok);
  shuffle(conf);
  let n = 0;
  for (const f of conf) {
    const lag = 2 + R() * 10;
    if (n < TOTAL.fixed && f.verdict + lag < TOTAL.runs - 0.2) {
      f.fix = f.verdict + lag;
      n++;
    } else f.fix = Infinity;
  }
  // if the lag draw left us short, fix the earliest remaining ones just after their verdict
  for (const f of conf.sort((a, b) => a.verdict - b.verdict)) {
    if (n >= TOTAL.fixed) break;
    if (f.fix === Infinity) {
      f.fix = Math.min(TOTAL.runs - 0.3, f.verdict + 1.5);
      n++;
    }
  }
  return out;
})();

// 64 of 74 journeys verified, in the order they were reached
export const JOURNEYS = (() => {
  const at = new Array(TOTAL.journeys).fill(Infinity);
  const order = shuffle([...Array(TOTAL.journeys).keys()]);
  for (let k = 0; k < TOTAL.verified; k++) at[order[k]] = 0.8 + early() * (TOTAL.runs - 1.6);
  return at;
})();

const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 1.6);

/** Everything the panels show at r, counted from the event lists. */
export function countsAt(r) {
  let flagged = 0;
  let confirmed = 0;
  let rejected = 0;
  let fixed = 0;
  for (const f of FINDINGS) {
    if (f.flag <= r) flagged++;
    if (f.verdict <= r) f.ok ? confirmed++ : rejected++;
    if (f.fix <= r) fixed++;
  }
  let verified = 0;
  for (const j of JOURNEYS) if (j <= r) verified++;
  const x = Math.min(1, r / TOTAL.runs);
  const agentRuns = Math.round(TOTAL.agentRuns * x);
  return {
    run: Math.min(TOTAL.runs, Math.floor(r) + (r >= TOTAL.runs ? 0 : 1)),
    flagged,
    confirmed,
    rejected,
    fixed,
    verified,
    steps: Math.round(TOTAL.steps * ease(x) * 0.35 + TOTAL.steps * x * 0.65),
    agentRuns,
    usd: (TOTAL.usd * x),
  };
}

/** What each phone is doing at r: its screen, the tap point, a flag flash. */
export function phoneAt(i, r) {
  const k = r - Math.floor(r);
  const e2e = k < E2E_SHARE && r < TOTAL.runs;
  // the agent moves through screens about 3 per run, phase-shifted per persona
  const u = r * 3.1 + i * 0.37;
  const screen = Math.floor(u + i * 1.7) % 5;
  const local = u - Math.floor(u);
  let flash = 0;
  for (const f of FINDINGS) {
    if (f.phone !== i) continue;
    const d = r - f.flag;
    if (d >= 0 && d < 0.5) flash = Math.max(flash, 1 - d / 0.5);
    if (f.flag > r + 1) break;
  }
  return {e2e, screen, local, flash};
}

/** A cumulative series for the chart: n samples of flagged / confirmed / fixed over 0..52. */
export const SERIES = (() => {
  const n = 105;
  const s = {flagged: [], confirmed: [], fixed: []};
  for (let k = 0; k < n; k++) {
    const c = countsAt((k / (n - 1)) * TOTAL.runs);
    s.flagged.push(c.flagged);
    s.confirmed.push(c.confirmed);
    s.fixed.push(c.fixed);
  }
  return s;
})();
