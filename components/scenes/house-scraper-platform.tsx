'use client';

/**
 * House scraper platform: listings roll off three rental platforms onto a belt
 * into a Raspberry Pi. A filter gate checks each against the criteria; matches
 * ride into the Pi and come out as an email on a phone, the rest drop in a bin.
 * One clock revolution per loop stands for the 10-minute check.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 11;
const V = 56; // belt speed px/s
const N = 9;
const LANES = [50, 150, 250];
const NAMES = ['FUNDA', 'MVGM', 'VBO'];
const MATCH = [1, 0, 1, 0, 1, 1, 0, 0, 1];
const AX = 86, CX = 315, GATE = 392, END = 466;
const A = CX - AX, C = END - CX;

function Card({ i, onScan, onDeliver }: { i: number; onScan: () => void; onDeliver: () => void }) {
  const g = useRef<HTMLDivElement>(null);
  const stripe = useRef<HTMLDivElement>(null);
  const env = useRef<HTMLDivElement>(null);
  const scanned = useRef(-1);
  const delivered = useRef(-1);
  const lane = i % 3;
  const yl = LANES[lane];
  const B = Math.abs(yl - 150);
  const dir = Math.sign(150 - yl);
  const L = A + B + C;
  const match = !!MATCH[i];
  const tE = L / V;

  useFrame((t) => {
    const tt = t + (i * T) / N;
    const loop = Math.floor(tt / T);
    const lt = tt % T;
    const s = lt * V;
    let cx: number, cy: number;
    if (s < A) { cx = AX + s; cy = yl; }
    else if (s < A + B) { cx = CX; cy = yl + dir * (s - A); }
    else { cx = CX + (s - A - B); cy = 150; }
    let z = 23, fade = Math.min(1, lt / 0.5);
    if (cx > GATE) {
      stripe.current!.style.background = match ? P.green : P.signal;
      if (scanned.current !== loop && s > A + B) { scanned.current = loop; onScan(); }
    } else stripe.current!.style.background = P.steel;
    if (match) {
      fade = Math.min(fade, 1 - Math.min(1, Math.max(0, (s - (L - 16)) / 16)));
    } else if (cx > GATE + 10 && s > A + B) {
      const k = Math.min(1, (cx - GATE - 10) / 30);
      cx = GATE + 10 + k * 8;
      cy = 150 + ease(k) * 70;
      z = 23 - ease(k) * 11;
      fade = Math.min(fade, 1 - Math.max(0, (k - 0.6) / 0.4));
    }
    g.current!.style.transform = `translate3d(${cx - 12}px,${cy - 9}px,${z}px)`;
    g.current!.style.opacity = String(fade);

    // match: the Pi sends an email that flies to the phone
    const u = match ? span(lt, tE, tE + 1.4) : 0;
    const e = ease(u);
    env.current!.style.opacity = u > 0 && u < 1 ? '1' : '0';
    env.current!.style.transform = `translate3d(${lerp(514, 598, e)}px,${lerp(143, 56, e)}px,${lerp(26, 56, e) + Math.sin(Math.PI * e) * 24}px)`;
    if (u >= 1 && delivered.current !== loop) { delivered.current = loop; onDeliver(); }
  });

  const body = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };
  return (
    <>
      <Group ref={g}>
        <Box x={0} y={0} w={24} d={18} h={3} c={body}
          top={
            <div style={{ position: 'absolute', inset: 2 }}>
              <div style={{ position: 'absolute', left: 1, top: 1, width: 13, height: 12, background: '#b5b5ae', clipPath: 'polygon(50% 0,100% 45%,100% 100%,0 100%,0 45%)' }} />
              <div ref={stripe} style={{ position: 'absolute', right: 1, top: 2, width: 6, height: 12, borderRadius: 2, background: P.steel }} />
            </div>
          } />
      </Group>
      <Group ref={env}>
        <Box x={0} y={0} w={24} d={16} h={2} c={{ top: '#fbfbf8', s: '#cfcfc8', w: '#dcdcd5' }}
          top={
            <svg width={24} height={16} style={{ maxWidth: 'none', display: 'block' }}>
              <polyline points="0,0 12,9 24,0" fill="none" stroke={P.signal} strokeWidth={1.6} />
            </svg>
          } />
      </Group>
    </>
  );
}

export default function HouseScraperScene({ project, className }: { project: Project; className?: string }) {
  const lanes = useRef<(HTMLDivElement | null)[]>([]);
  const colUp = useRef<HTMLDivElement>(null);
  const colDown = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const laser = useRef<HTMLDivElement>(null);
  const hand = useRef<HTMLDivElement>(null);
  const led = useRef<HTMLDivElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const scan = useRef(0);
  const ping = useRef(0);

  useFrame((t) => {
    const o = (t * V) % 16;
    lanes.current.forEach((l) => { if (l) l.style.backgroundPosition = `${o}px 0`; });
    main.current!.style.backgroundPosition = `${o}px 0`;
    colDown.current!.style.backgroundPosition = `0 ${o}px`;
    colUp.current!.style.backgroundPosition = `0 ${-o}px`;
    const since = (performance.now() - scan.current) / 1000;
    laser.current!.style.opacity = String(0.4 + 0.6 * Math.max(0, 1 - since / 0.5) + 0.08 * Math.sin(t * 9));
    hand.current!.style.transform = `rotate(${((t % T) / T) * 360}deg)`;
    led.current!.style.opacity = String(0.55 + 0.45 * Math.sin(t * 6) ** 2);
    const p = (performance.now() - ping.current) / 1000;
    note.current!.style.opacity = String(0.25 + 0.75 * Math.max(0, 1 - p / 1.2));
  });

  const beltH = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const beltV = 'repeating-linear-gradient(180deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const grid = 'linear-gradient(rgba(20,20,19,.05) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(20,20,19,.05) 1px,transparent 1px) 0 0/24px 24px';

  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.92} offset={[1, 1]} stillAt={4.6}
      label="An isometric machine: listings from Funda, MVGM and VBO ride belts to a filter gate; matches enter a Raspberry Pi that sends an email to a phone, the rest drop in a bin."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: '#fafaf7', s: '#a9a9a2', w: '#bdbdb6' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: grid }} />} />

      {/* three source platforms with their feed belts */}
      {LANES.map((y, k) => (
        <Group key={k}>
          <Box x={14} y={y - 24} w={54} d={48} h={34} z={8} c={k === 0 ? P.paper2 : '#d4d4ce'} r={3}
            front={<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'ui-monospace,monospace', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', color: P.ink }}>{NAMES[k]}</div>} />
          <Box x={20} y={y - 18} w={42} d={36} h={6} z={42} c={k === 0 ? P.signal : P.ink3} r={2} />
          <Box x={68} y={y - 12} w={6} d={24} h={10} z={8} c={P.steelDark} r={3} />
          <Box x={70} y={y - 15} w={240} d={30} h={14} z={8} c={P.ink3} r={4} />
          <Slab ref={(el) => { lanes.current[k] = el; }} x={76} y={y - 11} w={232} d={22} z={22.5} bg={beltH} r={2} />
        </Group>
      ))}

      {/* collector belt: top lane flows down, bottom lane flows up */}
      <Box x={300} y={35} w={30} d={230} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={colDown} x={302} y={39} w={26} d={111} z={22.5} bg={beltV} />
      <Slab ref={colUp} x={302} y={150} w={26} d={111} z={22.5} bg={beltV} />

      {/* main belt to the Pi */}
      <Box x={329} y={135} w={150} d={30} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={main} x={330} y={139} w={144} d={22} z={22.5} bg={beltH} r={2} />

      {/* criteria filter gate */}
      <Box x={382} y={122} w={14} d={12} h={56} z={8} c={P.steel} />
      <Box x={382} y={166} w={14} d={12} h={56} z={8} c={P.steel} />
      <Box x={380} y={120} w={20} d={62} h={10} z={64} c={P.signal} r={3} />
      <Box ref={laser} x={388} y={136} w={2} d={28} h={40} z={23}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.65),rgba(242,84,26,.15))' }} />
      <Slab x={384} y={138} w={10} d={24} z={23} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.5),transparent)" />

      {/* reject bin */}
      <Box x={394} y={196} w={58} d={46} h={12} z={8} c={P.steelDark} r={4}
        top={<div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#2a2a27' }} />} />

      {/* 10-minute clock */}
      <Slab x={176} y={84} w={44} d={44} z={8.5} bg={P.paper} r={22} style={{ boxShadow: `0 0 0 3px ${P.steelDark}` }}>
        <div ref={hand} style={{ position: 'absolute', left: 21, top: 4, width: 2, height: 18, background: P.signal, borderRadius: 1, transformOrigin: '50% 100%' }} />
        <div style={{ position: 'absolute', left: 19, top: 19, width: 6, height: 6, borderRadius: 3, background: P.ink }} />
      </Slab>

      {/* Raspberry Pi */}
      <Box x={480} y={112} w={92} d={76} h={6} z={8} c={P.green} r={4} />
      <Box x={498} y={126} w={26} d={26} h={4} z={14} c={P.ink2} r={2} />
      <Box x={534} y={122} w={22} d={14} h={4} z={14} c={P.steel} r={1} />
      <Box x={534} y={160} w={22} d={20} h={9} z={14} c={P.steel} r={1} />
      <Box x={500} y={166} w={20} d={14} h={3} z={14} c={P.ink3} r={1} />
      <Slab x={556} y={126} w={5} d={5} z={14.5} bg={P.green} r={3} style={{ boxShadow: '0 0 6px #7fd3a2' }} />
      <Slab ref={led} x={556} y={136} w={5} d={5} z={14.5} bg={P.signal} r={3} style={{ boxShadow: '0 0 6px rgba(242,84,26,.8)' }} />
      <Slab x={522} y={188} w={3} d={44} z={8.5} bg={P.ink2} />
      <Box x={508} y={230} w={32} d={20} h={12} z={8} c={P.paper2} r={3} />

      {/* phone receiving the email */}
      <Box x={586} y={40} w={34} d={10} h={58} z={8} c={P.ink2} r={4}
        front={
          <div style={{ position: 'absolute', inset: 4, borderRadius: 3, background: '#0d0d0c', padding: '4px 4px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 6, letterSpacing: '.1em', opacity: 0.6 }}>INBOX</div>
            <div ref={note} style={{ marginTop: 3, height: 9, borderRadius: 2, background: P.signal, opacity: 0.25 }} />
            <div style={{ marginTop: 3, height: 5, borderRadius: 2, background: '#2a2a27' }} />
          </div>
        } />

      {Array.from({ length: N }, (_, i) => (
        <Card key={i} i={i}
          onScan={() => { scan.current = performance.now(); }}
          onDeliver={() => { ping.current = performance.now(); }} />
      ))}

      <Bill x={390} y={118} z={78}><Chip tone="signal">every 10 min</Chip></Bill>
      <Bill x={500} y={340} z={0}><Chip tone="dark">24/7 on a Raspberry Pi</Chip></Bill>
      <Bill x={560} y={50} z={66}><Chip tone="dark"><span style={{ color: P.signal }}>2 mo</span> vs 8-12</Chip></Bill>
    </Stage>
  );
}
