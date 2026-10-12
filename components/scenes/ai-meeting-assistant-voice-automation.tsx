'use client';

/**
 * AI meeting assistant: people talk around a table with a mic pod. The speech
 * runs down a rail as an equalizer wave, a transcriber prints it, and finished
 * action items ride a belt onto a calendar and stamp themselves into a day.
 * A small local server below the transcriber is the offline Whisper.cpp mode.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 9; // card loop
const BARS = 14;
const CARDS = [
  { col: 1, row: 0 },
  { col: 2, row: 2 },
  { col: 0, row: 3 },
];
const CAL_X = 540, CAL_Y = 90;
const cellX = (c: number) => CAL_X + 4 + 23 * c + 11.5;
const cellY = (r: number) => CAL_Y + 26 + 28 * r + 14;
const paper = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };

function Person({ x, y, tone }: { x: number; y: number; tone: string }) {
  return (
    <Bill x={x} y={y} z={8}>
      <svg width={30} height={46} viewBox="0 0 30 46" style={{ maxWidth: 'none', display: 'block' }}>
        <ellipse cx="15" cy="44" rx="12" ry="2.5" fill="rgba(0,0,0,.35)" />
        <path d="M3 43 C3 28 8 24 15 24 C22 24 27 28 27 43 Z" fill={tone} />
        <circle cx="15" cy="13" r="8.5" fill={P.paper2} />
        <circle cx="15" cy="13" r="8.5" fill="none" stroke="rgba(0,0,0,.25)" />
      </svg>
    </Bill>
  );
}

function ActionCard({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const stamp = useRef<HTMLDivElement>(null);
  const { col, row } = CARDS[i];

  useFrame((t) => {
    const lt = (((t - i * 3) % T) + T) % T;
    const bx = 470, by = 169;
    const tx = cellX(col) - 9, ty = cellY(row) - 6;
    let x = lerp(bx, 566, span(lt, 0.4, 3.2));
    let y = by, z = 19;
    const k = ease(span(lt, 3.2, 4.2));
    x = lerp(x, tx, k);
    y = lerp(by, ty, k);
    z = lerp(19, 20, k);
    const vis = Math.min(span(lt, 0.4, 0.9), 1 - span(lt, 4.2, 4.5));
    g.current!.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    g.current!.style.visibility = vis > 0.05 ? 'visible' : 'hidden';
    const s = span(lt, 4.3, 4.7) * (1 - span(lt, T - 1, T - 0.3));
    stamp.current!.style.visibility = s > 0.05 ? 'visible' : 'hidden';
  });

  return (
    <>
      <Group ref={g}>
        <Box x={0} y={0} w={18} d={12} h={3} c={paper}
          top={<div style={{ position: 'absolute', inset: '2px 2px', background: `linear-gradient(90deg,${P.signal} 0 5px,transparent 5px) 0 0/100% 2px no-repeat,repeating-linear-gradient(180deg,transparent 0 3px,rgba(20,20,19,.2) 3px 4px)` }} />} />
      </Group>
      <Group ref={stamp} style={{ visibility: 'hidden' }}>
        <Slab x={cellX(col) - 10} y={cellY(row) - 12} w={20} d={24} z={19} r={3} bg="rgba(242,84,26,.9)">
          <div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: 'rgba(255,255,255,.35)' }} />
        </Slab>
      </Group>
    </>
  );
}

export default function MeetingAssistantScene({ project, className }: { project: Project; className?: string }) {
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  const rings = useRef<(HTMLDivElement | null)[]>([]);
  const belt = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const led = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    bars.current.forEach((b, i) => {
      if (!b) return;
      const env = 0.55 + 0.45 * Math.sin(t * 1.3 - i * 0.18);
      const k = 0.5 + 2.6 * Math.abs(Math.sin(t * 3.1 - i * 0.7) * Math.sin(t * 0.9 + i * 0.3)) * env;
      b.style.transform = `translate3d(0,0,0) scale3d(1,1,${k})`;
    });
    rings.current.forEach((r, i) => {
      if (!r) return;
      const p = ((t / 2.4) + i / 3) % 1;
      r.style.transform = `translateZ(23px) scale(${0.25 + p * 1.4})`;
      r.style.opacity = String(0.7 * (1 - p));
    });
    belt.current!.style.backgroundPosition = `${(t * 24) % 12}px 0`;
    screen.current!.style.backgroundPosition = `0 ${(t * 9) % 12}px`;
    sheet.current!.style.transform = `translate3d(0,0,0) scale3d(1,1,${0.45 + 0.55 * ease(((t % 6) / 6) * 1.2)})`;
    led.current!.style.opacity = String(0.6 + 0.4 * Math.sin(t * 5));
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 10px,#35352f 10px 12px)';
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.0} offset={[0, 2]}
      label="An isometric meeting room machine: people talk around a table with a microphone, the speech runs down a rail as a sound wave into a transcriber, and finished action items ride a belt onto a calendar. A small local server stands for the offline mode."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* rug + meeting table */}
      <Slab x={22} y={86} w={186} d={170} z={8.5} r={14} bg="rgba(255,255,255,.05)" />
      <Box x={48} y={128} w={134} d={86} h={14} z={8} c={{ top: P.paper2, s: '#b9b9b2', w: '#c9c9c2' }} r={26} />
      <Box x={60} y={228} w={110} d={0.1} h={0.1} z={8} c={P.ink3} />
      <Box x={66} y={190} w={22} d={14} h={2} z={22} c={P.ink3} r={2} />
      <Box x={140} y={140} w={22} d={14} h={2} z={22} c={paper} r={2} />
      <Person x={84} y={118} tone={P.steelDark} />
      <Person x={148} y={118} tone={P.steel} />
      <Person x={84} y={246} tone={P.steel} />
      <Person x={148} y={246} tone={P.steelDark} />
      <Person x={34} y={176} tone={P.steelDark} />

      {/* mic pod with speech rings */}
      {[0, 1, 2].map((i) => (
        <div key={i} ref={(el) => { rings.current[i] = el; }}
          style={{ position: 'absolute', left: 115 - 40, top: 171 - 40, width: 80, height: 80, borderRadius: '50%', border: `2px solid ${P.signal}`, opacity: 0, transformStyle: 'preserve-3d' }} />
      ))}
      <Box x={108} y={164} w={14} d={14} h={10} z={22} c={P.ink} r={7} />
      <Box x={111} y={167} w={8} d={8} h={4} z={32} c={P.signal} r={4} />

      {/* rail carrying the sound wave */}
      <Box x={205} y={160} w={190} d={30} h={6} z={8} c={P.ink3} r={3} />
      <Slab x={209} y={164} w={182} d={22} z={14.5} r={2} bg="rgba(255,255,255,.05)" />
      {Array.from({ length: BARS }, (_, i) => (
        <Group key={i} ref={(el) => { bars.current[i] = el; }} style={{ transform: 'translate3d(0,0,0)' }}>
          <Box x={212 + i * 12.5} y={169} w={8} d={12} h={10} z={14.5} c={i % 3 === 0 ? P.signal : P.paper} r={1} />
        </Group>
      ))}

      {/* transcriber */}
      <Box x={394} y={126} w={74} d={86} h={46} z={8} c={P.ink3} r={4}
        front={
          <div ref={screen} style={{ position: 'absolute', inset: 6, borderRadius: 3, background: 'repeating-linear-gradient(180deg,transparent 0 5px,rgba(127,211,162,.55) 5px 7px) 0 0/100% 12px,#0d0d0c' }} />
        } />
      <Box x={394} y={126} w={74} d={6} h={8} z={54} c={P.signal} r={2} />
      <Group ref={sheet} style={{ transform: 'translate3d(0,0,0)' }}>
        <Box x={414} y={150} w={34} d={2} h={26} z={54} c={paper}
          front={<div style={{ position: 'absolute', inset: '3px 4px', background: 'repeating-linear-gradient(180deg,transparent 0 4px,rgba(20,20,19,.3) 4px 5px)' }} />} />
      </Group>

      {/* action-item belt */}
      <Box x={466} y={158} w={68} d={34} h={8} z={8} c={P.ink3} r={3} />
      <Slab ref={belt} x={468} y={162} w={62} d={26} z={16.5} r={2} bg={beltBg} />
      <Box x={460} y={156} w={6} d={38} h={14} z={8} c={P.steelDark} r={2} />

      {/* calendar */}
      <Box x={CAL_X} y={CAL_Y} w={100} d={170} h={10} z={8} c={paper} r={4} />
      <Slab x={CAL_X} y={CAL_Y} w={100} d={22} z={18.5} r={4} bg={P.ink3} />
      <Slab x={CAL_X + 4} y={CAL_Y + 26} w={92} d={140} z={18.5}
        bg="linear-gradient(90deg,rgba(20,20,19,.2) 1px,transparent 1px) 0 0/25% 100%,linear-gradient(rgba(20,20,19,.2) 1px,transparent 1px) 0 0/100% 20%" />
      <Box x={CAL_X + 8} y={CAL_Y + 6} w={10} d={10} h={6} z={19} c={P.signal} r={2} />
      <Box x={CAL_X + 82} y={CAL_Y + 6} w={10} d={10} h={6} z={19} c={P.signal} r={2} />

      {/* local server: offline Whisper.cpp mode */}
      <Box x={402} y={246} w={60} d={34} h={22} z={8} c={P.steel} r={3}
        front={
          <div style={{ position: 'absolute', inset: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 4, background: 'rgba(0,0,0,.35)', borderRadius: 2 }} />
            <div style={{ height: 4, background: 'rgba(0,0,0,.35)', borderRadius: 2 }} />
            <div ref={led} style={{ width: 5, height: 5, borderRadius: '50%', background: P.green }} />
          </div>
        } />
      <Slab x={428} y={212} w={4} d={34} z={8.5} bg={P.steelDark} />

      {CARDS.map((_, i) => <ActionCard key={i} i={i} />)}

      <Bill x={115} y={78} z={34}><Chip tone="dark">live audio · WebRTC</Chip></Bill>
      <Bill x={300} y={150} z={38}><Chip tone="signal">85% in noise</Chip></Bill>
      <Bill x={580} y={60} z={30}><Chip tone="light"><span style={{ color: P.signalDark }}>5 h</span> saved / week</Chip></Bill>
      <Bill x={540} y={344} z={0}><Chip tone="dark">offline · Whisper.cpp</Chip></Bill>
    </Stage>
  );
}
