// The console around the rig, laid out at 1600 x 900: title and the live confirmed count; the agents, one row each
// (click to pick); the verifier funnel with its chart; journey coverage, 74 tiles; the cost readout; the subsystem,
// view and label buttons; the run timeline; the honesty line. update(s) redraws every live part from the model at r.
import {countsAt, PER_RUN_USD, PERSONAS, phoneAt, SERIES, TOTAL} from './model.js';
import {GROUPS} from './rig.js';

export const C = {ink: '#24211e', mute: '#8e867b', faint: '#d9d0c2', line: '#e7dfd2', panel: 'rgba(251,248,243,.94)', acc: '#e8622c', green: '#2f9e68', grey: '#a8a299'};
const VIEWS = ['hero', 'phones', 'gate', 'tray', 'top'];
const VIEW_LABEL = {hero: 'HERO', phones: 'PHONES', gate: 'VERIFIER', tray: 'TRAY', top: 'TOP'};
const GROUP_LABEL = {e2e: 'E2E SUITE', agents: 'AGENTS', backend: 'BACKEND', verifier: 'VERIFIER', rulings: 'RULINGS'};
const CSS = `
#app{font-family:Inter,system-ui,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.ui{position:absolute;inset:0;pointer-events:none}
.mo{font-family:'JetBrains Mono',ui-monospace,monospace}
.cp{position:absolute;background:${C.panel};border:1px solid ${C.line};border-radius:8px;box-shadow:0 2px 12px rgba(110,80,40,.07)}
.ph{display:flex;align-items:center;gap:8px;font:700 10.5px 'JetBrains Mono',monospace;letter-spacing:1.8px}
.ph i{display:block;width:3px;height:13px;background:${C.acc}}
.sm{font:500 9.5px 'JetBrains Mono',monospace;letter-spacing:1.4px;color:${C.mute};text-transform:uppercase;white-space:nowrap}
.bt{position:absolute;display:flex;align-items:center;justify-content:center;height:26px;border:1px solid ${C.faint};border-radius:5px;background:#fffdf9;font:700 9.5px 'JetBrains Mono',monospace;letter-spacing:1.3px;white-space:nowrap;pointer-events:auto;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.ag{position:absolute;left:14px;right:14px;height:44px;border-radius:6px;pointer-events:auto;cursor:pointer;transition:background .25s}
.ag b{position:absolute;left:26px;top:7px;font:700 10.5px 'JetBrains Mono',monospace;letter-spacing:1.3px}
.ag span{position:absolute;left:26px;top:24px;font:500 11px Inter;color:${C.mute};white-space:nowrap}
.ag em{position:absolute;right:8px;top:8px;font:700 8.5px 'JetBrains Mono',monospace;letter-spacing:1.2px;font-style:normal;color:${C.mute}}
.ag u{position:absolute;left:8px;top:11px;width:8px;height:8px;border-radius:50%;background:${C.faint}}
.call{position:absolute;width:190px}
.call b{display:flex;align-items:center;gap:6px;font:700 10px 'JetBrains Mono',monospace;letter-spacing:1.2px;white-space:nowrap}
.call b i{display:block;width:7px;height:7px;background:${C.acc}}
.call span{display:block;margin:3px 0 0 13px;font:500 8.5px 'JetBrains Mono',monospace;letter-spacing:1px;color:${C.mute};white-space:nowrap}
`;

export const LAYOUT = {
  wide: {W: 1600, H: 900, title: [44, 34], big: [44, 104], agents: [40, 226], vf: [1262, 34, 298], cv: [1262, 314, 298], co: [1262, 496, 298], bar: [40, 790, 1520, 64], foot: [44, 868]},
  tall: {W: 900, H: 1500, title: [36, 34], big: [36, 104], agents: null, vf: [530, 30, 334], cv: [36, 1086, 404], co: [460, 1086, 404], bar: [36, 1246, 828, 196], foot: [40, 1460]},
};

export function createConsole(app, tall = false) {
  const LY = tall ? LAYOUT.tall : LAYOUT.wide;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  const root = document.createElement('div');
  root.className = 'ui';
  app.appendChild(root);
  const add = (html, parent = root) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    const n = t.content.firstChild;
    parent.appendChild(n);
    return n;
  };
  const btn = {};

  // ---------------------------------------------------------------- title + headline number
  add(`<div style="position:absolute;left:${LY.title[0]}px;top:${LY.title[1]}px;display:flex;align-items:center;gap:12px">
    <div class="mo" style="background:${C.acc};color:#fff;font-weight:700;font-size:13px;letter-spacing:1.5px;padding:6px 9px;border-radius:5px">QA</div>
    <div><div style="font:800 27px Inter;letter-spacing:-.5px">AI QA agents</div>
    <div class="sm" style="margin-top:3px">A car-sharing app · the first two weeks, replayed</div></div></div>`);
  const big = add(`<div style="position:absolute;left:${LY.big[0]}px;top:${LY.big[1]}px;font:800 66px/1 Inter;letter-spacing:-2px;color:${C.acc}">0</div>`);
  add(`<div class="sm" style="position:absolute;left:${LY.big[0] + 2}px;top:${LY.big[1] + 72}px;color:${C.ink};font-weight:700">Confirmed real bugs</div>`);
  const bigSub = add(`<div class="sm" style="position:absolute;left:${LY.big[0] + 2}px;top:${LY.big[1] + 89}px"></div>`);

  // ---------------------------------------------------------------- agents
  const ag = LY.agents ? add(`<div class="cp" style="left:${LY.agents[0]}px;top:${LY.agents[1]}px;width:300px;height:392px"></div>`) : null;
  if (ag) add(`<div class="ph" style="position:absolute;left:16px;top:14px"><i></i>AGENTS · ONE SIMULATOR EACH</div>`, ag);
  const rows = (ag ? PERSONAS : []).map((p, i) => {
    const row = add(`<div class="ag" style="top:${42 + i * 49}px"><u></u><b>${p.name}</b><span>${p.goal}</span><em></em></div>`, ag);
    btn[`p:${i}`] = row;
    return {row, dot: row.querySelector('u'), st: row.querySelector('em'), name: row.querySelector('b')};
  });

  // ---------------------------------------------------------------- verifier funnel + chart
  const vf = add(`<div class="cp" style="left:${LY.vf[0]}px;top:${LY.vf[1]}px;width:${LY.vf[2]}px;height:268px"></div>`);
  add(`<div class="ph" style="position:absolute;left:16px;top:14px"><i></i>VERIFIER · ONLY CONFIRMED COUNTS</div>`, vf);
  const FUN = [['flagged', 'FLAGGED', C.ink], ['rejected', 'REJECTED', C.grey], ['confirmed', 'CONFIRMED', C.acc], ['fixed', 'FIXED', C.green]];
  const bars = FUN.map(([k, label, col], j) => {
    const y = 44 + j * 27;
    add(`<div class="sm" style="position:absolute;left:16px;top:${y}px;color:${C.ink}">${label}</div>`, vf);
    add(`<div style="position:absolute;left:104px;top:${y + 4}px;width:${LY.vf[2] - 168}px;height:5px;background:#efe8dc;border-radius:3px"></div>`, vf);
    const f = add(`<div style="position:absolute;left:104px;top:${y + 4}px;height:5px;width:0;background:${col};border-radius:3px"></div>`, vf);
    const v = add(`<div class="mo" style="position:absolute;right:16px;top:${y - 2}px;font-size:13px;font-weight:700;color:${col}">0</div>`, vf);
    return {k, f, v};
  });
  const CW = LY.vf[2] - 32;
  const chart = add(`<svg style="position:absolute;left:16px;top:160px" width="${CW}" height="96"></svg>`, vf);

  // ---------------------------------------------------------------- coverage
  const cv = add(`<div class="cp" style="left:${LY.cv[0]}px;top:${LY.cv[1]}px;width:${LY.cv[2]}px;height:170px"></div>`);
  add(`<div class="ph" style="position:absolute;left:16px;top:14px"><i></i>CUSTOMER JOURNEYS</div>`, cv);
  const covNum = add(`<div style="position:absolute;left:16px;top:36px;font:800 30px Inter;letter-spacing:-.8px">0<span style="font-size:15px;color:${C.mute};font-weight:600"> / ${TOTAL.journeys} verified</span></div>`, cv);
  add(`<div class="sm" style="position:absolute;left:16px;top:74px">Counted on the newest build only</div>`, cv);
  const tiles = [];
  for (let j = 0; j < TOTAL.journeys; j++) {
    const c = j % 19;
    const r = Math.floor(j / 19);
    tiles.push(add(`<div style="position:absolute;left:${16 + c * 14}px;top:${96 + r * 16}px;width:11px;height:12px;border-radius:2px;background:#ece5d9"></div>`, cv));
  }

  // ---------------------------------------------------------------- cost
  const co = add(`<div class="cp" style="left:${LY.co[0]}px;top:${LY.co[1]}px;width:${LY.co[2]}px;height:${tall ? 170 : 122}px"></div>`);
  add(`<div class="ph" style="position:absolute;left:16px;top:14px"><i></i>COST · API LIST PRICE</div>`, co);
  const cost = [['STEPS LOGGED', ''], ['AGENT RUNS', ''], ['SPENT', ''], ['PER AGENT RUN', `$${PER_RUN_USD.toFixed(2)}`]].map(([l, v], j) => {
    add(`<div class="sm" style="position:absolute;left:16px;top:${40 + j * 19}px">${l}</div>`, co);
    return add(`<div class="mo" style="position:absolute;right:16px;top:${38 + j * 19}px;font-size:12px;font-weight:700">${v}</div>`, co);
  });

  // ---------------------------------------------------------------- bottom bar: isolate, views, labels, timeline
  const [BX, BY, BW, BH] = LY.bar;
  const bar = add(`<div class="cp" style="left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px"></div>`);
  const ROW = tall ? [26, 88, 150] : [26, 26, 26];
  add(`<div class="sm" style="position:absolute;left:16px;top:8px">Isolate</div>`, bar);
  let x = 16;
  for (const g of GROUPS) {
    const w = 18 + GROUP_LABEL[g].length * 7.2;
    btn[`g:${g}`] = add(`<div class="bt" style="left:${x}px;top:${ROW[0]}px;width:${w}px">${GROUP_LABEL[g]}</div>`, bar);
    x += w + 6;
  }
  x = tall ? 16 : x + 18;
  add(`<div class="sm" style="position:absolute;left:${x}px;top:${ROW[1] - 18}px">View</div>`, bar);
  for (const v of VIEWS) {
    const w = 18 + VIEW_LABEL[v].length * 7.2;
    btn[`v:${v}`] = add(`<div class="bt" style="left:${x}px;top:${ROW[1]}px;width:${w}px">${VIEW_LABEL[v]}</div>`, bar);
    x += w + 6;
  }
  x += 12;
  btn.labels = add(`<div class="bt" style="left:${x}px;top:${ROW[1]}px;width:70px">LABELS</div>`, bar);
  x = tall ? 16 : x + 92;
  btn.play = add(`<div class="bt" style="left:${x}px;top:${ROW[2]}px;width:30px">❚❚</div>`, bar);
  x += 44;
  const TL = {x: BX + x, w: BW - x - 150, y: BY + ROW[2] + 12};
  add(`<div class="sm" style="position:absolute;left:${x}px;top:${ROW[2] - 18}px">Run</div>`, bar);
  add(`<div style="position:absolute;left:${x}px;top:${ROW[2] + 12}px;width:${TL.w}px;height:3px;background:#ece5d9;border-radius:2px"></div>`, bar);
  const tlFill = add(`<div style="position:absolute;left:${x}px;top:${ROW[2] + 12}px;height:3px;background:${C.acc};border-radius:2px"></div>`, bar);
  const tlKnob = add(`<div style="position:absolute;top:${ROW[2] + 7}px;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;background:#fff;border:2px solid ${C.acc};box-sizing:border-box"></div>`, bar);
  const tlTxt = add(`<div class="mo" style="position:absolute;right:16px;top:${ROW[2] + 4}px;font-size:12px;font-weight:700"></div>`, bar);

  add(`<div class="sm" style="position:absolute;left:${LY.foot[0]}px;top:${LY.foot[1]}px;text-transform:none;letter-spacing:.4px;white-space:normal;width:${LY.W - 80}px">Staging only · test-mode payments · test accounts. Totals are measured; how they spread over the 52 runs is illustrative.</div>`);

  // callouts + pointer
  const callSvg = add(`<svg style="position:absolute;left:0;top:0;overflow:visible" width="${LY.W}" height="${LY.H}"></svg>`);
  const callG = add(`<div style="position:absolute;left:0;top:0"></div>`);
  const ptr = add(`<svg style="position:absolute;left:0;top:0;overflow:visible" width="${LY.W}" height="${LY.H}"><circle data-ring r="0" fill="none" stroke="${C.acc}" stroke-width="2"/><g data-p><path d="M0 0L0 19L5 14.5L8.6 22.5L11.6 21.2L8 13.4L14.4 13.2Z" fill="#fff" stroke="${C.ink}" stroke-width="1.4" stroke-linejoin="round"/></g></svg>`);

  const centre = (n) => {
    const r = n.getBoundingClientRect();
    const a = app.getBoundingClientRect();
    const s = a.width / LY.W || 1;
    return [(r.left - a.left + r.width / 2) / s, (r.top - a.top + r.height / 2) / s];
  };
  const spots = {};
  const refreshSpots = () => {
    for (const [k, n] of Object.entries(btn)) spots[k] = centre(n);
  };
  refreshSpots();

  const pointer = (c) => {
    const p = ptr.querySelector('[data-p]');
    const ring = ptr.querySelector('[data-ring]');
    if (!c || c.x < 0) {
      p.style.display = 'none';
    } else {
      p.style.display = '';
      p.setAttribute('transform', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) scale(${c.press ? 0.9 : 1})`);
    }
    if (c && c.ring > 0) {
      ring.setAttribute('cx', c.ringX);
      ring.setAttribute('cy', c.ringY);
      ring.setAttribute('r', (8 + (1 - c.ring) * 22).toFixed(1));
      ring.setAttribute('opacity', c.ring.toFixed(2));
    } else ring.setAttribute('opacity', 0);
  };

  const onBtn = (n, on) => {
    n.style.background = on ? C.acc : '#fffdf9';
    n.style.color = on ? '#fff' : C.ink;
    n.style.borderColor = on ? C.acc : C.faint;
  };
  let lastChart = -1;
  return {
    root,
    spots,
    refreshSpots,
    btn,
    TL,
    pointer,
    update(s) {
      const c = countsAt(s.r);
      big.textContent = String(c.confirmed);
      bigSub.textContent = `${c.flagged} flagged · ${c.fixed} fixed · run ${String(c.run).padStart(2, '0')} of ${TOTAL.runs}`;
      // agents
      rows.forEach((row, i) => {
        const ps = phoneAt(i, s.r);
        const done = s.r >= TOTAL.runs;
        const status = done ? 'DONE' : ps.e2e ? 'E2E FIRST' : ps.flash > 0 ? 'FLAGGED' : 'EXPLORING';
        row.st.textContent = status;
        row.st.style.color = status === 'FLAGGED' ? C.acc : C.mute;
        row.dot.style.background = status === 'FLAGGED' ? C.acc : status === 'E2E FIRST' ? C.green : done ? C.faint : C.ink;
        row.row.style.background = s.picked === i ? 'rgba(232,98,44,.10)' : 'transparent';
        row.name.style.color = s.picked === i ? C.acc : C.ink;
      });
      // funnel
      for (const b of bars) {
        const v = c[b.k];
        b.f.style.width = `${((v / TOTAL.flagged) * (LY.vf[2] - 168)).toFixed(1)}px`;
        b.v.textContent = String(v);
      }
      const ck = Math.round(s.r * 4);
      if (ck !== lastChart) {
        lastChart = ck;
        const W = CW;
        const H = 84;
        const n = SERIES.flagged.length;
        const line = (arr, col, w) => `<path d="${arr.map((v, k) => `${k ? 'L' : 'M'}${((k / (n - 1)) * W).toFixed(1)} ${(H - (v / TOTAL.flagged) * (H - 4)).toFixed(1)}`).join('')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`;
        const cx = (Math.min(1, s.r / TOTAL.runs) * W).toFixed(1);
        chart.innerHTML = `<line x1="0" x2="${W}" y1="${H}" y2="${H}" stroke="${C.faint}"/>` + line(SERIES.flagged, C.ink, 1.3) + line(SERIES.confirmed, C.acc, 1.8) + line(SERIES.fixed, C.green, 1.5) +
          `<rect x="${cx}" y="0" width="${W - cx}" height="${H}" fill="rgba(251,248,243,.82)"/><line x1="${cx}" x2="${cx}" y1="0" y2="${H}" stroke="${C.acc}" stroke-dasharray="2 2"/>` +
          `<text x="0" y="${H + 11}" font-family="JetBrains Mono" font-size="8" letter-spacing="1" fill="${C.mute}">RUN 1</text><text x="${W}" y="${H + 11}" text-anchor="end" font-family="JetBrains Mono" font-size="8" letter-spacing="1" fill="${C.mute}">RUN ${TOTAL.runs}</text>`;
      }
      // coverage
      covNum.firstChild.textContent = String(c.verified);
      const lit = new Set();
      // journeys light in the order the model reached them
      for (let j = 0; j < tiles.length; j++) tiles[j].style.background = '#ece5d9';
      let n = 0;
      for (let j = 0; j < tiles.length && n < c.verified; j++, n++) lit.add(j);
      lit.forEach((j) => (tiles[j].style.background = C.green));
      // cost
      cost[0].textContent = `≈ ${c.steps.toLocaleString('en-US')}`;
      cost[1].textContent = `${c.agentRuns} / ${TOTAL.agentRuns}`;
      cost[2].textContent = `$${Math.round(c.usd)}`;
      // buttons
      for (const g of GROUPS) onBtn(btn[`g:${g}`], s.iso === g);
      for (const v of VIEWS) onBtn(btn[`v:${v}`], s.view === v);
      onBtn(btn.labels, !!s.labelsOn);
      btn.play.textContent = s.paused ? '▶' : '❚❚';
      const k = Math.min(1, s.r / TOTAL.runs);
      tlFill.style.width = `${(k * TL.w).toFixed(1)}px`;
      tlKnob.style.left = `${(TL.x - BX + k * TL.w).toFixed(1)}px`;
      tlTxt.textContent = `RUN ${String(c.run).padStart(2, '0')} / ${TOTAL.runs}`;
      // callouts
      let lh = '';
      let ch = '';
      for (const cl of s.callouts || []) {
        const [ax, ay] = cl.at;
        const [lx, ly] = cl.label;
        const right = lx > ax;
        const ex = right ? lx - 6 : lx + cl.w + 4;
        lh += `<polyline points="${ax.toFixed(1)},${ay.toFixed(1)} ${ex.toFixed(1)},${(ly + 6).toFixed(1)}" fill="none" stroke="${C.acc}" stroke-width="1" opacity="${cl.o.toFixed(2)}"/><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="2.6" fill="${C.acc}" opacity="${cl.o.toFixed(2)}"/>`;
        ch += `<div class="call" style="left:${lx.toFixed(1)}px;top:${(ly - 1).toFixed(1)}px;opacity:${cl.o.toFixed(2)};${right ? '' : 'text-align:left'}"><b><i></i>${cl.name}</b><span>${cl.sub}</span></div>`;
      }
      callSvg.innerHTML = lh;
      callG.innerHTML = ch;
      pointer(s.cursor);
    },
  };
}
