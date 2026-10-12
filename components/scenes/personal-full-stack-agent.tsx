'use client';

/**
 * Personal full-stack agent: mail rides a belt through a memory gate (a tower of
 * discs that lights up as it recalls context), then a stamp press takes the
 * action and a tool station lights up. A clock keeps turning because it never stops.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 10; // loop length per envelope
const N = 4;
const V = 58; // belt speed px/s
const X_MEM = 300; // envelope x where the memory gate reads it
const X_STAMP = 452; // envelope x under the stamp press
const toolX = [372, 440, 508];
const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
const flapA = 'linear-gradient(155deg,transparent 46%,rgba(20,20,19,.28) 47% 50%,transparent 51%)';
const flapB = 'linear-gradient(25deg,transparent 46%,rgba(20,20,19,.28) 47% 50%,transparent 51%)';

function Envelope({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);
  useFrame((t) => {
    const lt = (t + i * (T / N)) % T;
    const x = -6 + V * lt;
    let fade = 1, z = 0;
    if (lt < 0.7) { fade = ease(lt / 0.7); z = (1 - fade) * 10; }
    if (x > 520) { const k = span(x, 520, 570); fade = 1 - ease(k); z = -ease(k) * 6; }
    g.current!.style.transform = `translate3d(${x}px,166px,${z}px)`;
    g.current!.style.opacity = String(fade);
    done.current!.style.opacity = x > X_MEM + 20 ? '1' : '0';
  });
  return (
    <Group ref={g}>
      <Box x={0} y={0} w={40} d={28} h={3} z={21} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
        top={<div style={{ position: 'absolute', inset: 0, background: `${flapA},${flapB}` }} />} />
      <Slab ref={done} x={29} y={4} w={7} d={7} z={24.5} r={4} bg={P.signal} style={{ transition: 'opacity .25s' }} />
    </Group>
  );
}

export default function PersonalFullStackAgentScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const discs = useRef<(HTMLDivElement | null)[]>([]);
  const glow = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const lit = useRef<(HTMLDivElement | null)[]>([]);
  const hand = useRef<SVGLineElement>(null);
  const hand2 = useRef<SVGLineElement>(null);

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    let pulse = 0, press = 0;
    const tool = [0, 0, 0];
    for (let i = 0; i < N; i++) {
      const lt = (t + i * (T / N)) % T;
      const s = lt - (X_MEM + 6) / V;
      if (s >= 0 && s < 1.6) pulse = Math.max(pulse, 1 - s / 1.6);
      const d = lt - (X_STAMP + 20) / V;
      press = Math.max(press, 1 - Math.min(1, Math.abs(d) / 0.4));
      const u = lt - (X_STAMP + 20) / V - 0.2;
      if (u >= 0 && u < 2.2) tool[i % 3] = Math.max(tool[i % 3], 1 - u / 2.2);
    }
    discs.current.forEach((el, k) => {
      if (!el) return;
      const w = Math.max(0, pulse - k * 0.08);
      el.style.transform = `translateZ(${8 + k * 13 + Math.sin(t * 1.4 + k) * 0.6 + w * 4}px)`;
    });
    glow.current!.style.opacity = String(0.35 + 0.65 * pulse);
    beam.current!.style.opacity = String(0.25 + 0.75 * pulse);
    head.current!.style.transform = `translateZ(${lerp(44, 25, ease(press))}px)`;
    lit.current.forEach((el, k) => { if (el) el.style.opacity = String(tool[k]); });
    hand.current!.setAttribute('transform', `rotate(${(t * 36) % 360} 20 20)`);
    hand2.current!.setAttribute('transform', `rotate(${(t * 3) % 360} 20 20)`);
  });

  const screen = (inner: React.ReactNode) => (
    <div style={{ position: 'absolute', inset: 4, borderRadius: 3, background: '#0d0d0c', overflow: 'hidden' }}>{inner}</div>
  );
  const tools = [
    screen(<div style={{ position: 'absolute', inset: 4, background: 'linear-gradient(90deg,rgba(242,242,238,.5) 1px,transparent 1px) 0 0/8px 8px,linear-gradient(rgba(242,242,238,.5) 1px,transparent 1px) 0 0/8px 8px' }} />),
    screen(<div style={{ position: 'absolute', inset: 4, background: `${flapA},${flapB}`, filter: 'invert(1)' }} />),
    screen(<div style={{ position: 'absolute', inset: 5, background: 'repeating-linear-gradient(180deg,rgba(242,242,238,.6) 0 2px,transparent 2px 6px)' }} />),
  ];

  return (
    <Stage w={600} d={360} tone={project.cover.tone} className={className} zoom={0.86} offset={[-1, 2]} stillAt={5.2}
      label="An isometric operations desk: email arrives on a conveyor, passes a memory tower that recalls context, is stamped into an action and handed to calendar, mail and research tool stations, under a clock that never stops."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate with a faint grid */}
      <Box x={0} y={0} w={600} d={360} h={8} r={18} c={{ top: '#dcdcd6', s: '#9a9a93', w: '#a8a8a1' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(20,20,19,.06) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(20,20,19,.06) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* inbox tray, chute and belt */}
      <Box x={20} y={64} w={78} d={52} h={14} z={8} c={P.ink3} r={4}
        top={<div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: P.ink }} />} />
      {[0, 1, 2].map((k) => (
        <Box key={k} x={30 + k * 2} y={74 + k * 2} w={44} d={30} h={3} z={22 + k * 3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
          top={<div style={{ position: 'absolute', inset: 0, background: `${flapA},${flapB}` }} />} />
      ))}
      <Slab x={44} y={116} w={36} d={36} z={8.5} r={3} bg="linear-gradient(180deg,#2e2e2a,#24241f)" />
      <Box x={14} y={150} w={572} d={56} h={12} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={20} y={154} w={560} d={48} z={20.5} bg={beltBg} r={3} />
      <Box x={8} y={147} w={10} d={62} h={20} z={8} c={P.steelDark} r={5} />
      <Box x={582} y={147} w={10} d={62} h={20} z={8} c={P.steelDark} r={5} />
      {[60, 170, 280, 390, 500].map((x) => <Box key={x} x={x} y={208} w={10} d={8} h={8} z={8} c={P.steel} />)}

      {/* memory gate and disc tower */}
      <Box x={284} y={134} w={14} d={12} h={62} z={8} c={P.steel} />
      <Box x={284} y={210} w={14} d={12} h={62} z={8} c={P.steel} />
      <Box x={280} y={130} w={22} d={96} h={10} z={70} c={P.ink3} r={3} />
      <Box ref={beam} x={289} y={152} w={2} d={48} h={46} z={22}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.7),rgba(242,84,26,.12))' }} />
      <Slab x={286} y={154} w={10} d={48} z={21} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.5),transparent)" />
      <Slab x={288} y={100} w={6} d={34} z={8.5} bg={P.steelDark} />
      <Box x={246} y={28} w={84} d={76} h={6} z={8} c={P.steelDark} r={8} />
      {[0, 1, 2, 3].map((k) => (
        <Box key={k} ref={(el) => { discs.current[k] = el; }} x={256} y={38} w={64} d={56} h={10} z={14 + k * 13} r={10}
          c={k % 2 ? P.ink3 : P.paper2}
          front={k === 3 ? <div style={{ position: 'absolute', left: 10, right: 10, top: 3, height: 3, background: P.signal, borderRadius: 2 }} /> : undefined} />
      ))}
      <Slab ref={glow} x={264} y={46} w={48} d={40} z={14 + 3 * 13 + 10.6} r={8} bg={`radial-gradient(${P.signal},rgba(242,84,26,.1))`} />

      {/* stamp press */}
      <Box x={440} y={134} w={12} d={12} h={52} z={8} c={P.steel} />
      <Box x={440} y={210} w={12} d={12} h={52} z={8} c={P.steel} />
      <Box x={436} y={130} w={20} d={96} h={8} z={60} c={P.ink3} r={3} />
      <Box x={444} y={172} w={4} d={4} h={16} z={44} c={P.steelDark} />
      <Box ref={head} x={438} y={162} w={16} d={26} h={10} z={44} c={P.signal} r={2} />

      {/* tool stations: calendar, mail, research */}
      {toolX.map((x, k) => (
        <Group key={x}>
          <Box x={x} y={252} w={56} d={36} h={34} z={8} c={P.ink3} r={3} front={tools[k]} />
          <Slab ref={(el) => { lit.current[k] = el; }} x={x} y={252} w={56} d={36} z={42.5} r={3} bg={P.signal} style={{ opacity: 0 }} />
          <Slab x={x + 24} y={216} w={8} d={36} z={8.5} bg={P.steelDark} />
        </Group>
      ))}

      {/* clock that never stops */}
      <Box x={540} y={56} w={16} d={12} h={22} z={8} c={P.steelDark} />
      <Bill x={548} y={62} z={30}>
        <svg width={40} height={40} viewBox="0 0 40 40" style={{ maxWidth: 'none', display: 'block' }}>
          <circle cx={20} cy={20} r={18} fill={P.paper} stroke={P.ink} strokeWidth={3} />
          <line ref={hand2} x1={20} y1={20} x2={20} y2={9} stroke={P.ink} strokeWidth={2.5} strokeLinecap="round" />
          <line ref={hand} x1={20} y1={20} x2={20} y2={5} stroke={P.signal} strokeWidth={2} strokeLinecap="round" />
          <circle cx={20} cy={20} r={2} fill={P.ink} />
        </svg>
      </Bill>

      {Array.from({ length: N }, (_, i) => <Envelope key={i} i={i} />)}

      <Bill x={60} y={44} z={34}><Chip tone="dark">email</Chip></Bill>
      <Bill x={288} y={20} z={86}><Chip tone="signal">memory</Chip></Bill>
      <Bill x={470} y={336} z={4}><Chip tone="dark">tools API</Chip></Bill>
      <Bill x={250} y={338} z={4}><Chip tone="light"><span style={{ color: P.signalDark }}>+30%</span> daily efficiency, 24/7</Chip></Bill>
    </Stage>
  );
}
