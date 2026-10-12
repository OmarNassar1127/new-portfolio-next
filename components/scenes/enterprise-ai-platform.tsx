'use client';

/**
 * Enterprise AI platform: a sealed machine room. Employee queries ride belts to a
 * router, past the agent gantry and the Qdrant cabinet, into the on-premise Llama
 * rack and come back as answers. A packet that tries to leave bounces off the
 * locked gate in the perimeter wall: nothing leaves the building.
 */
import { Fragment, useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 10;
const N = 4;
const LANES = [115, 165, 215, 265];
const DESK_Y = LANES.map((y) => y - 15);

type Pt = [number, number];
/** Position along a polyline at progress u (0..1) by length. */
function along(pts: Pt[], u: number): Pt {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = u * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] ? Math.min(1, d / lens[i]) : 0;
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    d -= lens[i];
  }
  return pts[0];
}

const lines = 'repeating-linear-gradient(180deg,transparent 0 3px,rgba(20,20,19,.18) 3px 4px)';
const paperC = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };
const greenC = { top: '#8fd6ad', s: '#4f9e73', w: '#66b88a' };

function Packet({ i }: { i: number }) {
  const q = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const ly = LANES[i];
  useFrame((t) => {
    const lt = (t + i * (T / N)) % T;
    let p: Pt = [0, 0], vq = 0, va = 0;
    if (lt < 2.2) { p = along([[70, ly - 7], [200, ly - 7]], ease(lt / 2.2)); vq = Math.min(1, lt / 0.4); }
    else if (lt >= 2.6 && lt < 5.4) { p = along([[252, 173], [446, 173]], span(lt, 2.6, 5.4)); vq = 1; }
    else if (lt >= 6.2 && lt < 9.8) {
      p = along([[546, 200], [572, 200], [572, 306], [120, 306]], span(lt, 6.2, 9.8));
      va = lt > 9.4 ? (9.8 - lt) / 0.4 : 1;
    }
    const tr = `translate3d(${p[0]}px,${p[1]}px,9px)`;
    q.current!.style.transform = tr; a.current!.style.transform = tr;
    q.current!.style.opacity = String(vq); a.current!.style.opacity = String(va);
  });
  return (
    <>
      <Group ref={q}>
        <Box x={0} y={0} w={20} d={14} h={5} c={paperC}
          top={<div style={{ position: 'absolute', inset: '3px 4px', background: `linear-gradient(90deg,${P.signal} 0 6px,transparent 6px) 0 0/100% 3px no-repeat,${lines}` }} />} />
      </Group>
      <Group ref={a}>
        <Box x={0} y={0} w={20} d={14} h={5} c={greenC}
          top={<div style={{ position: 'absolute', inset: '3px 4px', background: `${lines}` }} />} />
      </Group>
    </>
  );
}

export default function EnterpriseAIPlatformScene({ project, className }: { project: Project; className?: string }) {
  const trunk = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const lock = useRef<HTMLDivElement>(null);
  const lamps = useRef<(HTMLDivElement | null)[]>([]);
  const drawers = useRef<(HTMLDivElement | null)[]>([]);
  const rackLights = useRef<(HTMLDivElement | null)[]>([]);
  const screens = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((t) => {
    trunk.current!.style.backgroundPosition = `${(t * 70) % 16}px 0`;
    back.current!.style.backgroundPosition = `${-(t * 70) % 16}px 0`;
    // multi-agent gantry lamps, Qdrant drawers, desk screens
    const lampOn = [0, 0, 0], drOn = [0, 0, 0], scrOn = [0, 0, 0, 0];
    for (let i = 0; i < N; i++) {
      const lt = (t + i * (T / N)) % T;
      if (lt > 3.3 && lt < 3.9) lampOn[i % 3] = 1;
      if (lt > 4.2 && lt < 4.9) drOn[i % 3] = 1;
      if (lt > 9.2 || lt < 0.5) scrOn[i] = 1;
    }
    lamps.current.forEach((l, k) => { if (l) l.style.background = lampOn[k] ? P.signal : '#5a5a55'; });
    drawers.current.forEach((d, k) => { if (d) d.style.opacity = String(0.25 + 0.75 * drOn[k]); });
    screens.current.forEach((s, k) => { if (s) s.style.background = scrOn[k] ? '#8fd6ad' : '#2d3b34'; });
    rackLights.current.forEach((l, k) => {
      if (!l) return;
      const busy = (t % T) > 5.4 && (t % T) < 6.4;
      l.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(t * (busy ? 7 : 1.3) + k * 1.7)));
    });
    // ghost packet tries to leave, bounces off the locked gate
    const g = t % T;
    let gx = 252, go = 0;
    if (g < 4.6) { gx = lerp(252, 590, ease(g / 4.6)); go = Math.min(1, g / 0.4); }
    else if (g < 5.0) { gx = lerp(590, 580, (g - 4.6) / 0.4); go = 1; }
    else if (g < 7) { gx = lerp(580, 360, ease((g - 5.0) / 2)); go = 1 - span(g, 6.2, 7); }
    ghost.current!.style.transform = `translate3d(${gx}px,52px,9px)`;
    ghost.current!.style.opacity = String(go);
    const hit = g > 4.5 && g < 5.8 ? Math.sin((g - 4.5) * 30) * 0.5 + 0.5 : 0;
    lock.current!.style.transform = `translateX(-50%) scale(${1 + hit * 0.15})`;
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#3a3a35 14px 16px)';
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.8} offset={[0, 0]} stillAt={4.6}
      label="An isometric sealed machine room: employee queries ride belts to a router, past an agent gantry and a Qdrant cabinet into an on-premise Llama 70B rack, and answers return. A packet that tries to leave bounces off the locked perimeter gate."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* perimeter wall (north and east) with a locked gate */}
      <Box x={0} y={0} w={640} d={8} h={34} z={8} c={P.ink3} />
      <Box x={632} y={8} w={8} d={32} h={34} z={8} c={P.ink3} />
      <Box x={632} y={40} w={8} d={40} h={34} z={8} c={P.paper2} />
      <Box x={632} y={80} w={8} d={280} h={34} z={8} c={P.ink3} />
      <Slab x={634} y={44} w={4} d={32} z={42.5} bg={P.signal} />

      {/* employee desks */}
      {DESK_Y.map((dy, i) => (
        <Fragment key={i}>
          <Box x={24} y={dy} w={42} d={30} h={10} z={8} c={P.paper2} r={2} />
          <Box x={50} y={dy + 10} w={14} d={4} h={14} z={18} c={P.ink3}
            front={<div ref={(el) => { screens.current[i] = el; }} style={{ position: 'absolute', inset: 2, background: '#2d3b34' }} />} />
          <Bill x={36} y={dy + 14} z={18}>
            <div style={{ width: 12, height: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: P.paper }} />
              <div style={{ width: 12, height: 11, borderRadius: '6px 6px 2px 2px', background: P.steel }} />
            </div>
          </Bill>
        </Fragment>
      ))}

      {/* lane belts into the router */}
      {LANES.map((y, i) => (
        <Slab key={i} x={68} y={y - 10} w={138} d={20} z={8.5} bg="#2a2a27" r={2} />
      ))}

      {/* router */}
      <Box x={206} y={40} w={40} d={250} h={12} z={8} c={P.ink3} r={3}
        top={<div style={{ position: 'absolute', inset: '8px 12px', background: `repeating-linear-gradient(180deg,${P.signal} 0 14px,transparent 14px 28px)`, opacity: 0.9 }} />} />
      <Box x={206} y={40} w={4} d={250} h={16} z={8} c={P.steelDark} />

      {/* trunk belt */}
      <Box x={246} y={160} w={204} d={40} h={4} z={8} c={P.ink3} />
      <Slab ref={trunk} x={248} y={166} w={200} d={28} z={12.5} bg={beltBg} />

      {/* agent gantry with three specialist lamps */}
      <Box x={284} y={150} w={10} d={10} h={44} z={8} c={P.steel} />
      <Box x={284} y={204} w={10} d={10} h={44} z={8} c={P.steel} />
      <Box x={282} y={150} w={14} d={64} h={10} z={52} c={P.paper2} r={2} />
      {[0, 1, 2].map((k) => (
        <Slab key={k} ref={(el) => { lamps.current[k] = el; }} x={285} y={158 + k * 18} w={8} d={10} z={62.5} bg="#5a5a55" r={2} />
      ))}

      {/* Qdrant cabinet beside the belt */}
      <Box x={346} y={92} w={52} d={44} h={50} z={8} c={P.paper2} r={3}
        top={<div style={{ position: 'absolute', inset: 5, background: 'radial-gradient(circle,#6f6f6a 1.6px,transparent 2px) 0 0/9px 9px' }} />}
        front={
          <div style={{ position: 'absolute', inset: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ flex: 1, background: '#cfcfc8', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div ref={(el) => { drawers.current[k] = el; }} style={{ width: 14, height: 4, background: P.signal, borderRadius: 2, opacity: 0.25 }} />
              </div>
            ))}
          </div>
        } />
      <Slab x={368} y={136} w={4} d={26} z={8.5} bg={P.steelDark} />

      {/* Llama rack */}
      <Box x={450} y={140} w={92} d={74} h={78} z={8} c={P.ink3} r={3}
        top={<div style={{ position: 'absolute', inset: 6, background: 'repeating-linear-gradient(90deg,#1a1a18 0 6px,#26261f 6px 8px)', borderRadius: 2 }} />}
        front={
          <div style={{ position: 'absolute', inset: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <div key={k} style={{ flex: 1, background: '#161614', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 4, padding: '0 5px' }}>
                <div ref={(el) => { rackLights.current[k] = el; }} style={{ width: 5, height: 5, borderRadius: 5, background: k % 3 === 0 ? P.signal : '#7fd3a2' }} />
                <div style={{ flex: 1, height: 2, background: '#33332f' }} />
              </div>
            ))}
          </div>
        } />
      <Slab x={452} y={156} w={4} d={40} z={8.5} bg={P.steelDark} />

      {/* return belt */}
      <Box x={110} y={296} w={470} d={20} h={3} z={8} c={P.ink3} />
      <Slab ref={back} x={112} y={298} w={466} d={16} z={11.5} bg={beltBg} />
      <Slab x={560} y={190} w={24} d={20} z={8.5} bg="#2a2a27" />
      <Slab x={566} y={190} w={12} d={116} z={8.5} bg="#2a2a27" />

      {/* locked lane to the gate */}
      <Slab x={246} y={44} w={388} d={16} z={8.5} bg="#242421" />
      <Group ref={ghost}>
        <Box x={0} y={0} w={20} d={14} h={5} c={{ top: P.steel, s: P.steelDark, w: '#85857f' }}
          top={<div style={{ position: 'absolute', inset: '3px 4px', background: lines }} />} />
      </Group>
      <Bill x={629} y={62} z={50}>
        <div ref={lock} style={{ width: 22, height: 26, transformOrigin: '50% 100%' }}>
          <svg width={22} height={26} viewBox="0 0 22 26" style={{ maxWidth: 'none' }}>
            <path d="M6 11V8a5 5 0 0 1 10 0v3" fill="none" stroke={P.paper} strokeWidth={2.4} />
            <rect x={2} y={11} width={18} height={14} rx={3} fill={P.paper} />
            <circle cx={11} cy={17} r={2} fill={P.ink} />
          </svg>
        </div>
      </Bill>

      {Array.from({ length: N }, (_, i) => <Packet key={i} i={i} />)}

      <Bill x={60} y={92} z={20}><Chip tone="dark">~400 employees</Chip></Bill>
      <Bill x={470} y={190} z={100}><Chip tone="signal">Llama 3 70B</Chip></Bill>
      <Bill x={470} y={304} z={20}><Chip tone="light">&lt;2s</Chip></Bill>
      <Bill x={540} y={340} z={6}><Chip tone="light">0 data out</Chip></Bill>
    </Stage>
  );
}
