'use client';

/**
 * LinkedIn AI outreach: profile cards come out of a search hopper (SerpAPI) and ride a belt
 * through a scoring gate (Gemini). Irrelevant ones get shoved off into a reject bin; relevant
 * ones stop under a pen that writes a personal message, then under a plunger (Puppeteer) that
 * presses Connect, paced by a rate-limit panel, and drop into the connections bin.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 12; // loop length
const GAP = 3; // seconds between cards
const REJECT = 1; // index of the card the gate turns away
const V = 48; // belt speed px/s

type Pts = [number, number][];
const GOOD: Pts = [[0, 20], [2.2, 140], [3.4, 215], [4.8, 318], [6.6, 326], [8.4, 458], [10, 466], [12, 590]];
const BAD: Pts = [[0, 20], [2.2, 140], [3.4, 215], [4.6, 222], [12, 222]];
const at = (pts: Pts, t: number) => {
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], span(t, pts[i - 1][0], pts[i][0]));
  }
  return pts[pts.length - 1][1];
};
const lt = (t: number, k: number) => (t + k * GAP) % T;

const PAPER = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };

function Card({ k }: { k: number }) {
  const g = useRef<HTMLDivElement>(null);
  const m1 = useRef<HTMLDivElement>(null);
  const m2 = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLDivElement>(null);
  const bad = k === REJECT;

  useFrame((t) => {
    const l = lt(t, k);
    const x = at(bad ? BAD : GOOD, l);
    let y = 164, z = 23, fade = 1;
    if (bad) {
      y = 164 + 46 * ease(span(l, 3.5, 4.4));
      z = lerp(23, 21.5, span(l, 4.2, 4.5));
      fade = 1 - span(l, 4.7, 5.5);
    } else if (x > 540) fade = 1 - (x - 540) / 50;
    if (l < 0.8) fade = Math.min(fade, l / 0.8);
    const el = g.current!;
    el.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    el.style.opacity = String(Math.max(0, fade));
    if (!bad) {
      const w = span(l, 5, 6.4);
      m1.current!.style.width = `${Math.min(1, w * 2) * 34}px`;
      m2.current!.style.width = `${span(w, 0.5, 1) * 24}px`;
      btn.current!.style.background = l > 9.2 ? P.green : '#c9c9c2';
    }
  });

  const abs = (s: React.CSSProperties) => <div style={{ position: 'absolute', ...s }} />;
  return (
    <Group ref={g}>
      <Box x={0} y={0} w={44} d={30} h={3} c={PAPER}
        top={
          <div style={{ position: 'absolute', inset: 0 }}>
            {abs({ left: 5, top: 4, width: 9, height: 9, borderRadius: 9, background: bad ? P.steel : P.steelDark })}
            {abs({ left: 17, top: 5, width: 18, height: 3, background: P.ink })}
            {abs({ left: 17, top: 10, width: 12, height: 2, background: P.steel })}
            <div ref={m1} style={{ position: 'absolute', left: 5, top: 16, height: 2, width: 0, background: P.signal }} />
            <div ref={m2} style={{ position: 'absolute', left: 5, top: 20, height: 2, width: 0, background: P.signal }} />
            <div ref={btn} style={{ position: 'absolute', left: 32, top: 23, width: 8, height: 4, borderRadius: 1, background: '#c9c9c2' }} />
          </div>
        } />
    </Group>
  );
}

function Machine({ stat }: { stat: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const pen = useRef<HTMLDivElement>(null);
  const plunger = useRef<HTMLDivElement>(null);
  const push1 = useRef<HTMLDivElement>(null);
  const push2 = useRef<HTMLDivElement>(null);
  const lampGood = useRef<HTMLDivElement>(null);
  const lampBad = useRef<HTMLDivElement>(null);
  const laser = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  const rate = useRef<(HTMLDivElement | null)[]>([]);
  const penPos = useRef({ x: 0, y: 140 });

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;

    // pen follows whichever good card is in the writing station
    let tx = 0, ty = 140, dz = 16, dy = 0, lamp = 0;
    for (let k = 0; k < 4; k++) {
      const l = lt(t, k);
      const cx = at(GOOD, l) + 22;
      if (k !== REJECT && l >= 4.8 && l <= 6.9) {
        const w = span(l, 5, 6.4);
        tx = cx - 340 + 5 * Math.sin(w * 16);
        ty = 172 + 14 * w + 2 * Math.sin(w * 40);
        if (l > 6.4) ty = 150;
      }
      if (k !== REJECT && l >= 8.6 && l <= 10.2) {
        dz = 16 - 23 * ease(span(l, 8.8, 9.1)) + 23 * ease(span(l, 9.5, 9.9));
      }
      if (l >= 2.3 && l <= 3.9) lamp = k === REJECT ? 2 : 1;
      if (k === REJECT) dy = 46 * ease(span(l, 3.5, 4.4)) - 46 * ease(span(l, 4.7, 5.6));
    }
    const p = penPos.current;
    p.x += (tx - p.x) * 0.14; p.y += (ty - p.y) * 0.14;
    pen.current!.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
    plunger.current!.style.transform = `translate3d(0,0,${dz}px)`;
    push1.current!.style.transform = `translate3d(0,${dy}px,0)`;
    push2.current!.style.transform = `translate3d(0,${dy * 0.5}px,0)`;
    lampGood.current!.style.transform = `translate3d(0,0,${lamp === 1 ? 0 : -70}px)`;
    lampBad.current!.style.transform = `translate3d(0,0,${lamp === 2 ? 0 : -70}px)`;
    laser.current!.style.opacity = String(0.55 + 0.35 * Math.sin(t * 8));
    bars.current.forEach((b, i) => { if (b) b.style.width = `${35 + 55 * Math.abs(Math.sin(t * 1.3 + i * 1.7))}%`; });
    const lit = 1 + Math.floor(((t % T) / T) * 7);
    rate.current.forEach((r, i) => { if (r) r.style.background = i < lit ? P.signal : '#3a3a35'; });
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const glow = { top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.6),rgba(242,84,26,.12))' };

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* belt */}
      <Box x={18} y={150} w={570} d={54} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={154} w={558} d={46} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={147} w={10} d={60} h={22} z={8} c={P.steelDark} r={5} />

      {/* search hopper (SerpAPI) */}
      <Box x={14} y={92} w={72} d={46} h={34} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', display: 'flex', alignItems: 'center', gap: 5, padding: '0 6px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ maxWidth: 'none' }}>
              <circle cx="5" cy="5" r="3.4" fill="none" stroke={P.signal} strokeWidth="1.6" />
              <path d="M7.6 7.6 11 11" stroke={P.signal} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div style={{ height: 3, flex: 1, background: '#3a3a35', borderRadius: 2 }} />
          </div>
        } />
      <Box x={22} y={98} w={32} d={22} h={2} z={42} c={PAPER} />
      <Box x={24} y={100} w={32} d={22} h={2} z={44} c={PAPER} />
      <Box x={21} y={99} w={32} d={22} h={2} z={46} c={PAPER} />
      <Slab x={26} y={138} w={44} d={14} z={22.5} bg="linear-gradient(180deg,#2e2e2a,#24241f)" r={2} />
      <Slab x={56} y={100} w={22} d={12} z={42.5} bg="#0d0d0c" r={2} />

      {/* scoring gate (Gemini) with analysis monitor behind it */}
      <Box x={140} y={62} w={112} d={12} h={54} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 8px', display: 'grid', gap: 4, alignContent: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 3, background: '#2a2a27', borderRadius: 2 }}>
                <div ref={(el) => { bars.current[i] = el; }} style={{ height: 3, width: '50%', borderRadius: 2, background: i === 0 ? P.signal : '#7fd3a2' }} />
              </div>
            ))}
          </div>
        } />
      <Box x={188} y={74} w={8} d={8} h={12} z={8} c={P.steelDark} />
      <Slab x={170} y={86} w={44} d={4} z={8.5} bg={P.steelDark} />
      <Box x={192} y={134} w={14} d={12} h={58} z={8} c={P.steel} />
      <Box x={192} y={208} w={14} d={12} h={58} z={8} c={P.steel} />
      <Box x={188} y={130} w={22} d={94} h={10} z={66} c={P.signal} r={3} />
      <Group ref={lampGood}><Box x={196} y={166} w={6} d={6} h={5} z={76} c={P.green} /></Group>
      <Group ref={lampBad}><Box x={196} y={178} w={6} d={6} h={5} z={76} c="#ff7a3d" /></Group>
      <Box ref={laser} x={198} y={152} w={2} d={50} h={40} z={22} c={glow} />
      <Slab x={193} y={154} w={12} d={46} z={23} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.5),transparent)" />

      {/* rejection pusher and bin */}
      <Box x={214} y={104} w={34} d={46} h={16} z={8} c={P.steelDark} r={2} />
      <Group ref={push2}><Box x={226} y={120} w={10} d={56} h={4} z={24} c={P.steel} /></Group>
      <Group ref={push1}>
        <Box x={228} y={130} w={6} d={34} h={4} z={28} c={P.paper2} />
        <Box x={216} y={158} w={30} d={6} h={9} z={22.5} c={P.signal} r={1} />
      </Group>
      <Box x={202} y={208} w={74} d={58} h={12} z={8} c={P.ink3} r={4}
        top={<div style={{ position: 'absolute', inset: 4, borderRadius: 3, background: '#0d0d0c' }} />} />

      {/* writing station: pen on a gantry */}
      <Box x={334} y={126} w={12} d={12} h={58} z={8} c={P.steel} />
      <Box x={334} y={218} w={12} d={12} h={58} z={8} c={P.steel} />
      <Box x={332} y={124} w={16} d={108} h={8} z={66} c={P.steelDark} r={2} />
      <Group ref={pen}>
        <Box x={331} y={-3} w={18} d={12} h={8} z={58} c={P.ink3} r={2} />
        <Box x={337} y={0} w={6} d={6} h={24} z={34} c={P.signal} r={1} />
        <Box x={338.5} y={1.5} w={3} d={3} h={6} z={27} c={P.ink} />
      </Group>
      <Slab x={316} y={158} w={48} d={38} z={22.7} bg="rgba(242,84,26,.14)" r={3} />

      {/* connect station (Puppeteer): plunger */}
      <Box x={474} y={126} w={12} d={12} h={58} z={8} c={P.steel} />
      <Box x={474} y={218} w={12} d={12} h={58} z={8} c={P.steel} />
      <Box x={472} y={124} w={16} d={108} h={8} z={66} c={P.steelDark} r={2} />
      <Group ref={plunger}>
        <Box x={477} y={176} w={6} d={6} h={30} z={36} c={P.paper2} r={1} />
        <Box x={475.5} y={174.5} w={9} d={9} h={4} z={30} c={P.ink} r={2} />
      </Group>
      <Slab x={452} y={158} w={56} d={38} z={22.7} bg="rgba(63,166,107,.16)" r={3} />

      {/* rate-limit panel */}
      <Box x={430} y={240} w={100} d={14} h={24} z={8} c={P.ink3} r={2}
        front={
          <div style={{ position: 'absolute', inset: 4, borderRadius: 2, background: '#0d0d0c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} ref={(el) => { rate.current[i] = el; }} style={{ width: 7, height: 7, borderRadius: 7, background: '#3a3a35' }} />
            ))}
          </div>
        } />
      <Slab x={478} y={226} w={4} d={14} z={8.5} bg={P.steelDark} />

      {/* connections bin */}
      <Box x={592} y={128} w={42} d={92} h={30} z={8} c={P.paper2} r={4}
        top={<div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#cfcfc8' }} />}
        front={<div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'ui-monospace,monospace', fontWeight: 700, fontSize: 12, color: P.ink }}>{stat}</div>} />

      {[0, 1, 2, 3].map((k) => <Card key={k} k={k} />)}

      <Bill x={50} y={96} z={58}><Chip tone="dark">SerpAPI</Chip></Bill>
      <Bill x={199} y={134} z={86}><Chip tone="signal">Gemini Pro</Chip></Bill>
      <Bill x={480} y={176} z={92}><Chip tone="light">Puppeteer</Chip></Bill>
      <Bill x={612} y={96} z={56}><Chip tone="light">{stat} / run</Chip></Bill>
    </>
  );
}

export default function LinkedinOutreachScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.92} offset={[0, -2]} stillAt={5.6}
      label="An isometric outreach line: profile cards leave a search hopper, pass a scoring gate where weak fits are pushed aside, get a message written by a pen, and a plunger presses Connect before they drop into a connections bin."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Machine stat={project.cover.stat?.value ?? ''} />
    </Stage>
  );
}
