'use client';

/**
 * AI image editor: a prompt is typed on a console, a ControlNet edge map feeds a
 * canvas where grey diffusion noise resolves into a picture, a layer lifts off
 * for editing, and an upscale gantry sweeps over it and prints a sharper copy.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 10;
const CELL = 26, COLS = 8, ROWS = 6;
const CW = CELL * COLS, CH = CELL * ROWS; // 208 x 156
const TX = 210, TY = 110; // table
const CX = 226, CY = 128; // canvas origin
const PROMPT = 'misty mountains at dawn';

const FAR: [number, number][] = [[0, 100], [50, 70], [90, 95], [150, 60], [208, 90]];
const NEAR: [number, number][] = [[0, 125], [40, 105], [100, 128], [170, 100], [208, 120]];
const ridge = (pts: [number, number][], x: number) => {
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      return lerp(y0, y1, (x - x0) / (x1 - x0));
    }
  }
  return pts[pts.length - 1][1];
};

const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const mix = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k);
const SKY_TOP = hex('#f2541a'), SKY_MID = hex('#f6b38f'), SKY_LOW = hex('#f2f2ee');

function colorAt(px: number, py: number): number[] {
  if (py > 130) return hex('#141413');
  if (py > ridge(NEAR, px)) return hex('#2e2e2a');
  if (py > ridge(FAR, px)) return hex('#6f6f6a');
  if (Math.hypot(px - 140, py - 50) < 18) return hex('#f2f2ee');
  const k = py / 120;
  return k < 0.5 ? mix(SKY_TOP, SKY_MID, k / 0.5) : mix(SKY_MID, SKY_LOW, (k - 0.5) / 0.5);
}

const TARGET = Array.from({ length: COLS * ROWS }, (_, i) => colorAt((i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2));
const HASH = (i: number, s: number) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const poly = (pts: [number, number][]) => [...pts, [208, 156], [0, 156]].map((p) => p.join(',')).join(' ');

/** The finished picture as vector art, same shapes the noise cells sample. */
function Art({ w, h, id }: { w: number; h: number; id: string }) {
  return (
    <svg width={w} height={h} viewBox="0 0 208 156" style={{ maxWidth: 'none', display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2541a" />
          <stop offset=".5" stopColor="#f6b38f" />
          <stop offset="1" stopColor="#f2f2ee" />
        </linearGradient>
      </defs>
      <rect width="208" height="130" fill={`url(#${id})`} />
      <circle cx="140" cy="50" r="18" fill="#f2f2ee" />
      <polygon points={poly(FAR)} fill="#6f6f6a" />
      <polygon points={poly(NEAR)} fill="#2e2e2a" />
      <rect y="130" width="208" height="26" fill="#141413" />
    </svg>
  );
}

const rgb = (c: number[]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

function Machine() {
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const overlay = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const gantry = useRef<HTMLDivElement>(null);
  const print = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const lastLen = useRef(-1);

  useFrame((t) => {
    const lt = t % T;
    // diffusion progress: noise -> picture -> back to noise at the loop seam
    const p = lt < 9.2 ? ease(span(lt, 1.2, 6)) : 1 - ease(span(lt, 9.2, 10));
    const step = Math.floor(t * 9);
    cells.current.forEach((el, i) => {
      if (!el) return;
      const pc = Math.min(1, Math.max(0, p * 1.5 - HASH(i, 1) * 0.5));
      const g = 90 + HASH(i, step) * 110;
      el.style.background = rgb(mix([g, g, g + 6], TARGET[i], ease(pc)));
    });

    // prompt typing
    const len = Math.floor(span(lt, 0.2, 2.2) * PROMPT.length) * (lt < 9.2 ? 1 : 0);
    if (len !== lastLen.current && typed.current) {
      lastLen.current = len;
      typed.current.textContent = PROMPT.slice(0, len);
    }
    if (bar.current) bar.current.style.width = `${p * 100}%`;
    tiles.current.forEach((el, i) => {
      if (el) el.style.background = Math.floor(lt / 3.3) % 3 === i ? P.signal : P.paper2;
    });

    // layer lifts off the canvas for editing
    const lk = ease(span(lt, 5.6, 6.6)) * (1 - ease(span(lt, 7.2, 8)));
    layer.current!.style.transform = `translateZ(${24 + lk * 34}px)`;
    layer.current!.style.opacity = String(lk * 0.95);

    // upscale button + gantry sweep
    const press = span(lt, 7.1, 7.3) * (1 - span(lt, 7.3, 7.6));
    btn.current!.style.transform = `translateZ(${14 - press * 3}px)`;
    const sweep = ease(span(lt, 7.3, 8.8));
    const back = ease(span(lt, 9.2, 10));
    const gx = lerp(CX - 14, CX + CW - 4, sweep) - back * (CW + 20);
    gantry.current!.style.transform = `translate3d(${gx}px,0,0)`;
    const frac = clamp(((gx - CX) / CW) * 1, 0, 1);
    overlay.current!.style.clipPath = `inset(0 ${(1 - frac) * 100}% 0 0)`;
    overlay.current!.style.opacity = String(lt > 9.2 ? 1 - back : 1);

    // upscaled print arrives on the tray
    const pk = ease(span(lt, 8.6, 9.3)) * (lt > 9.2 ? 1 - back : 1);
    print.current!.style.opacity = String(pk);
    print.current!.style.transform = `translate3d(0,0,${(1 - pk) * 10}px)`;

    // ControlNet signal pulse along the cable
    pulse.current!.style.transform = `translate3d(${((t * 0.7) % 1) * 30}px,0,0)`;
  });

  const keys = 'repeating-linear-gradient(90deg,#3a3a35 0 8px,#2a2a27 8px 10px),#2a2a27';
  const edge = (
    <svg width={120} height={90} viewBox="0 0 120 90" style={{ maxWidth: 'none', display: 'block' }}>
      <rect width="120" height="90" fill="#141413" />
      <polyline points="0,64 28,40 52,56 86,34 120,52" fill="none" stroke={P.signal} strokeWidth="1.6" />
      <polyline points="0,76 22,62 58,74 98,58 120,68" fill="none" stroke="#f2f2ee" strokeWidth="1.4" opacity=".8" />
      <circle cx="80" cy="22" r="10" fill="none" stroke={P.signal} strokeWidth="1.4" strokeDasharray="3 3" />
    </svg>
  );

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* prompt console */}
      <Box x={40} y={30} w={120} d={60} h={44} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#0d0d0c', padding: '4px 6px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 6.5, letterSpacing: '.12em', opacity: 0.55 }}>PROMPT</div>
            <div style={{ fontSize: 8, lineHeight: 1.3, marginTop: 2, minHeight: 20 }}>
              <span ref={typed} />
              <span style={{ color: P.signal }}>|</span>
            </div>
            <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 3 }}>
              <div ref={bar} style={{ height: 3, width: '0%', borderRadius: 2, background: P.signal }} />
            </div>
          </div>
        } />
      <Box x={44} y={98} w={112} d={30} h={5} z={8} c={P.ink3} r={3}
        top={<div style={{ position: 'absolute', inset: '4px 6px', borderRadius: 2, background: keys }} />} />
      <Box ref={btn} x={134} y={108} w={14} d={14} h={5} z={14} c={P.signal} r={7} style={{ transform: 'translateZ(14px)' }} />
      {/* prompt suggestion tiles */}
      {[0, 1, 2].map((i) => (
        <Box key={i} x={44 + i * 40} y={146} w={34} d={22} h={4} z={8} c={P.paper2} r={3}
          top={<div ref={(el) => { tiles.current[i] = el; }} style={{ position: 'absolute', inset: 3, borderRadius: 2, background: P.paper2, backgroundImage: 'linear-gradient(rgba(20,20,19,.45),rgba(20,20,19,.45)),linear-gradient(rgba(20,20,19,.3),rgba(20,20,19,.3))', backgroundSize: '70% 3px,45% 3px', backgroundPosition: '4px 5px,4px 12px', backgroundRepeat: 'no-repeat' }} />} />
      ))}

      {/* ControlNet edge-map tray, cabled to the canvas table */}
      <Box x={480} y={40} w={120} d={90} h={10} z={8} c={P.paper2} r={4} top={edge} />
      <Box x={450} y={112} w={30} d={4} h={3} z={13} c={P.steel} />
      <Box ref={pulse} x={450} y={112.5} w={6} d={3} h={4} z={13} c={P.signal} />
      <Box x={456} y={96} w={26} d={14} h={4} z={8} c={P.steelDark} r={3} />

      {/* canvas table with rails */}
      <Box x={TX} y={TY} w={240} d={190} h={14} z={8} c={P.ink3} r={5} />
      <Box x={TX + 4} y={TY + 2} w={232} d={6} h={3} z={22} c={P.steelDark} />
      <Box x={TX + 4} y={TY + 180} w={232} d={6} h={3} z={22} c={P.steelDark} />
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <Slab key={i} ref={(el) => { cells.current[i] = el; }} x={CX + (i % COLS) * CELL} y={CY + Math.floor(i / COLS) * CELL} w={CELL - 1} d={CELL - 1} z={22.5} bg="#888" />
      ))}
      {/* sharp upscaled copy revealed by the gantry */}
      <Slab ref={overlay} x={CX} y={CY} w={CW} d={CH} z={23.5} bg="transparent" style={{ clipPath: 'inset(0 100% 0 0)' }}>
        <Art w={CW} h={CH} id="aie-a" />
      </Slab>
      {/* editable layer lifting off the canvas */}
      <Slab ref={layer} x={CX + 8} y={CY + 8} w={CW - 16} d={CH - 16} z={24} bg="rgba(242,242,238,.16)" r={4}
        style={{ border: `1.5px dashed ${P.signal}`, opacity: 0 }}>
        <div style={{ position: 'absolute', left: 120, top: 28, width: 50, height: 50, borderRadius: '50%', border: `1.5px solid ${P.paper}`, background: 'rgba(242,84,26,.25)' }} />
      </Slab>

      {/* upscale gantry */}
      <Group ref={gantry} style={{ transform: `translate3d(${CX - 14}px,0,0)` }}>
        <Box x={0} y={TY + 2} w={10} d={8} h={36} z={25} c={P.steel} r={2} />
        <Box x={0} y={TY + 180} w={10} d={8} h={36} z={25} c={P.steel} r={2} />
        <Box x={-1} y={TY + 2} w={12} d={186} h={7} z={61} c={P.signal} r={2} />
        <Slab x={3} y={CY} w={5} d={CH} z={24} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.7),transparent)" />
      </Group>

      {/* upscaled print on its tray */}
      <Box x={480} y={190} w={130} d={100} h={8} z={8} c={P.paper2} r={4} />
      <Group ref={print} style={{ opacity: 0 }}>
        <Box x={488} y={198} w={114} d={86} h={2} z={16} c={P.paper} top={<div style={{ position: 'absolute', inset: 5 }}><Art w={104} h={76} id="aie-b" /></div>} />
      </Group>

      <Bill x={100} y={30} z={62}><Chip tone="dark">prompt</Chip></Bill>
      <Bill x={540} y={44} z={24}><Chip tone="light">ControlNet</Chip></Bill>
      <Bill x={330} y={106} z={90}><Chip tone="dark">Stable Diffusion</Chip></Bill>
      <Bill x={545} y={296} z={14}><Chip tone="signal">upscale</Chip></Bill>
    </>
  );
}

export default function AiImageEditorScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.08} offset={[0, 0]} stillAt={9}
      label="An isometric image studio: a prompt console feeds a canvas where diffusion noise resolves into a landscape, a ControlNet edge map guides it, a layer lifts off for editing, and an upscale gantry sweeps over it and prints a sharper copy."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Machine />
    </Stage>
  );
}

function clamp(v: number, a: number, b: number) { return v < a ? a : v > b ? b : v; }
