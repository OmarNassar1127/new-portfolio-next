'use client';

/**
 * Full-stack multi-agent: a brief enters a dispatcher and fans out onto three
 * parallel lanes. Each lane has two agent stations (6 agents in all) that work
 * the packet in turn. The review lane rejects a packet once and sends it back
 * (self-correction) before it ships. Finished work lands in the output tray.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, useFrame } from './kit';

const T = 11;
const AX = [210, 360]; // agent station x
const LANE_Y = [70, 160, 250];
const COLORS = [P.glass, P.green, P.signal];
const BELT_BG = 'repeating-linear-gradient(90deg,#3a3a35 0 14px,#454540 14px 16px)';

// [time, x] keypoints; equal x = the packet waits under an agent
const KEYS: [number, number][][] = [
  [[0.3, 90], [1.6, 200], [3.4, 200], [4.8, 350], [6.4, 350], [8, 540]],
  [[0.6, 90], [1.9, 200], [3.4, 200], [4.8, 350], [6.4, 350], [8.2, 540]],
  [[0.9, 90], [2.2, 200], [3.4, 200], [4.6, 350], [5.4, 350], [6.4, 285], [7, 285], [8, 350], [9, 350], [10.3, 540]],
];
const DONE = [8.2, 8.4, 10.4];

function xAt(keys: [number, number][], lt: number) {
  if (lt <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1] = keys[i], [t0, x0] = keys[i - 1];
    if (lt <= t1) return lerp(x0, x1, ease((lt - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

function Agent({ ax, y0, color, lamp, glow }: {
  ax: number; y0: number; color: string;
  lamp: React.Ref<HTMLDivElement>; glow: React.Ref<HTMLDivElement>;
}) {
  const eye = <div style={{ position: 'absolute', top: 4, width: 4, height: 4, borderRadius: 1, background: color }} />;
  return (
    <>
      <Slab ref={glow} x={ax - 14} y={y0 + 6} w={28} d={28} z={16.4} r={3} bg={color} style={{ opacity: 0 }} />
      <Box x={ax - 14} y={y0 - 30} w={28} d={22} h={26} z={8} c={P.paper2} r={3} />
      <Box x={ax - 3} y={y0 - 8} w={6} d={26} h={4} z={26} c={P.steelDark} />
      <Box x={ax - 7} y={y0 + 14} w={14} d={8} h={3} z={22} c={P.steel} r={1} />
      <Box x={ax - 11} y={y0 - 27} w={22} d={16} h={14} z={34} c={P.ink3} r={3}
        front={<div style={{ position: 'absolute', inset: 0 }}><div style={{ position: 'absolute', left: 5, top: 0 }}>{eye}</div><div style={{ position: 'absolute', right: 5, top: 0 }}>{eye}</div></div>} />
      <Box ref={lamp} x={ax - 3} y={y0 - 21} w={6} d={6} h={4} z={48} c={color} r={1} />
    </>
  );
}

function Lane({ i }: { i: number }) {
  const y0 = LANE_Y[i], color = COLORS[i], keys = KEYS[i];
  const belt = useRef<HTMLDivElement>(null);
  const pkt = useRef<HTMLDivElement>(null);
  const stripe = useRef<HTMLDivElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const lamps = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const glows = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useFrame((t) => {
    const lt = t % T;
    belt.current!.style.backgroundPosition = `${(t * 40) % 16}px 0`;
    const x = xAt(keys, lt);
    const fadeIn = Math.min(1, Math.max(0, (lt - keys[0][0]) / 0.5));
    const fadeOut = Math.max(0, Math.min(1, (556 - x) / 22));
    const gone = lt > DONE[i] + 1.4 ? 0 : 1;
    pkt.current!.style.transform = `translate3d(${x - 14}px,${y0 + 11}px,16.5px)`;
    pkt.current!.style.opacity = String(Math.min(fadeIn, fadeOut) * (lt > T - 0.4 ? 0 : 1));
    // stripe colour tracks progress: raw -> worked -> (rejected) -> done
    const rejected = i === 2 && lt > 5.8 && lt < 7.8;
    const stage = x > AX[1] + 20 && !rejected ? 2 : x > AX[0] + 20 ? 1 : 0;
    stripe.current!.style.background = rejected ? P.signal : [P.steel, P.glass, color === P.signal ? P.green : color][stage];
    // agents glow while a packet is parked under them
    AX.forEach((ax, k) => {
      const on = Math.abs(x - ax) < 12 && fadeIn > 0.9 && lt < DONE[i] ? 1 : 0;
      const pulse = on * (0.55 + 0.25 * Math.sin(t * 8));
      glows[k].current!.style.opacity = String(pulse * 0.6);
      lamps[k].current!.style.opacity = String(on ? 1 : 0.35);
    });
    const sheet = lt > DONE[i] && lt < T - 0.5 ? 1 : 0;
    out.current!.style.opacity = String(sheet * Math.min(1, (lt - DONE[i]) / 0.4));
    void gone;
  });

  return (
    <>
      <Box x={78} y={y0 - 3} w={474} d={46} h={8} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={84} y={y0} w={462} d={40} z={16.2} bg={BELT_BG} r={3} />
      {AX.map((ax, k) => (
        <Agent key={ax} ax={ax} y0={y0} color={color} lamp={lamps[k]} glow={glows[k]} />
      ))}
      <Group ref={pkt}>
        <Box x={0} y={0} w={28} d={18} h={4} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
          top={<div style={{ position: 'absolute', inset: '3px 4px', background: 'repeating-linear-gradient(180deg,transparent 0 3px,rgba(20,20,19,.2) 3px 4px)' }}>
            <div ref={stripe} style={{ position: 'absolute', left: 0, top: 0, width: 9, height: 3 }} />
          </div>} />
      </Group>
      <Box ref={out} x={572} y={y0 + 8} w={36} d={24} h={4} z={18} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
        top={<div style={{ position: 'absolute', inset: '3px 4px', background: `linear-gradient(90deg,${P.green} 0 9px,transparent 9px) 0 0/100% 3px no-repeat,repeating-linear-gradient(180deg,transparent 0 3px,rgba(20,20,19,.2) 3px 4px)` }} />} />
    </>
  );
}

export default function FullStackMultiAgentScene({ project, className }: { project: Project; className?: string }) {
  const lamp = useRef<HTMLDivElement>(null);
  const seq = useRef<HTMLDivElement>(null);
  const par = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    const lt = t % T;
    lamp.current!.style.opacity = String(lt < 2.2 ? 0.6 + 0.4 * Math.sin(t * 9) : 0.3);
    // parallel bar runs the loop and settles at 20% of the sequential one
    const k = ease((lt - 1) / 8);
    par.current!.style.width = `${lerp(100, 20, k)}%`;
    seq.current!.style.width = '100%';
    feed.current!.style.backgroundPosition = `0 ${(t * 30) % 12}px`;
  });

  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.0} offset={[0, 3]} stillAt={5.6}
      label="An isometric workshop: a brief enters a dispatcher and fans out onto three parallel belts. Six agent stations work the packets in turn, the review lane sends one back for a fix, and finished work lands in an output tray."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* dispatcher */}
      <Box x={14} y={126} w={52} d={64} h={54} z={8} c={P.ink3} r={4}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 6px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>BRIEF</div>
            {[34, 26, 30].map((w, i) => <div key={i} style={{ height: 2, width: `${w + 20}%`, background: '#3a3a35', marginTop: 4 }} />)}
          </div>
        } />
      <Box ref={lamp} x={34} y={150} w={12} d={12} h={5} z={62} c={P.signal} r={2} />
      {/* feeder rail splitting to the lanes */}
      <Box x={66} y={72} w={10} d={198} h={6} z={8} c={P.steelDark} r={3} />
      <Slab ref={feed} x={68} y={76} w={6} d={190} z={14.5} bg="repeating-linear-gradient(180deg,#f2541a 0 4px,transparent 4px 12px)" style={{ opacity: 0.7 }} />
      {LANE_Y.map((y) => <Box key={y} x={66} y={y + 12} w={14} d={16} h={6} z={8} c={P.steel} r={2} />)}

      {LANE_Y.map((_, i) => <Lane key={i} i={i} />)}

      {/* output tray */}
      <Box x={552} y={52} w={76} d={256} h={10} z={8} c={P.steelDark} r={4}
        top={<div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#2e2e2a' }} />} />

      {/* sequential vs parallel gauge */}
      <Box x={410} y={8} w={130} d={14} h={40} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#0d0d0c', padding: '4px 6px' }}>
            <div ref={seq} style={{ height: 6, background: '#55554f', borderRadius: 2 }} />
            <div ref={par} style={{ height: 6, background: P.signal, borderRadius: 2, marginTop: 5, width: '100%' }} />
          </div>
        } />

      <Bill x={36} y={150} z={72}><Chip tone="dark">CrewAI + LangGraph</Chip></Bill>
      <Bill x={285} y={34} z={22}><Chip tone="light">6 agents</Chip></Bill>
      <Bill x={475} y={8} z={60}><Chip tone="signal">80% less execution time</Chip></Bill>
    </Stage>
  );
}
