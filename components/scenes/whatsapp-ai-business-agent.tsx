'use client';

/**
 * WhatsApp AI business agent: chat messages ride a belt past the agent desk.
 * The agent pulls a tool drawer (availability, extend, update), a backend gate
 * validates the call, and most messages turn north into the "resolved" bin.
 * The rest roll on to a human desk. 5 of 9 resolved matches the 55% figure.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, span, useFrame } from './kit';

const N = 9;
const T = 14; // loop length
const V = 62; // belt speed px/s
const RESOLVED = [true, false, true, true, false, true, false, true, false];
const TOOLS = ['avail.', 'extend', 'update'];
const FORK = 404; // x where resolved messages turn north
const GATE = 336; // backend validation gate
const AGENT = 236; // agent arch
const paper = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };

function Message({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  const ok = RESOLVED[i];

  useFrame((t) => {
    const lt = (t + i * (T / N)) % T;
    const xs = -20 + V * lt;
    let x = xs, y = 163, z = 23, fade = 1;
    if (ok && xs > FORK) {
      const d = xs - FORK;
      x = FORK;
      y = Math.max(40, 163 - d);
      z = 23 - 6 * ease(span(d, 90, 123));
      if (y <= 44) fade = 0;
    } else if (!ok && xs > 520) {
      fade = Math.max(0, 1 - (xs - 520) / 40);
    }
    if (lt < 0.5) fade = Math.min(fade, lt / 0.5);
    g.current!.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    g.current!.style.opacity = String(fade);
    // painted once the gate has judged it
    tint.current!.style.opacity = xs > GATE + 8 ? '1' : '0';
  });

  const lines = 'repeating-linear-gradient(180deg,transparent 0 5px,rgba(20,20,19,.16) 5px 6px)';
  return (
    <Group ref={g}>
      <Box x={0} y={0} w={44} d={30} h={4} c={paper} r={5}
        top={
          <div style={{ position: 'absolute', inset: 0, borderRadius: 5 }}>
            <div style={{ position: 'absolute', inset: '5px 6px 8px', background: lines }} />
            <div style={{ position: 'absolute', left: 6, top: 5, width: 14, height: 3, borderRadius: 2, background: P.steel }} />
            <div ref={tint} style={{ position: 'absolute', right: 5, bottom: 5, width: 9, height: 9, borderRadius: 5, background: ok ? P.green : P.signal, opacity: 0, transition: 'opacity .3s' }} />
          </div>
        } />
    </Group>
  );
}

function Person() {
  return (
    <svg width="34" height="52" viewBox="0 0 34 52" style={{ maxWidth: 'none' }} aria-hidden="true">
      <ellipse cx="17" cy="49" rx="12" ry="3" fill="rgba(0,0,0,.25)" />
      <path d="M3 48c0-12 6-19 14-19s14 7 14 19z" fill={P.ink3} />
      <path d="M13 31l4 8 4-8z" fill={P.paper} />
      <circle cx="17" cy="19" r="9" fill={P.paper2} />
      <path d="M8 18c0-7 4-11 9-11s9 4 9 11c-3-4-6-5-9-5s-6 1-9 5z" fill={P.ink} />
      <path d="M5 21v-3a12 12 0 0124 0v3" fill="none" stroke={P.steel} strokeWidth="2.5" />
      <rect x="2" y="19" width="5" height="8" rx="2" fill={P.steel} />
    </svg>
  );
}

export default function WhatsappAgentScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const belt2 = useRef<HTMLDivElement>(null);
  const drawers = useRef<(HTMLDivElement | null)[]>([]);
  const lamps = useRef<(HTMLDivElement | null)[]>([]);
  const gateLight = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    belt2.current!.style.backgroundPosition = `0 ${(-t * V) % 16}px`;
    // which message is at the agent / gate right now
    let active = -1, gate = 0;
    for (let i = 0; i < N; i++) {
      const xs = -20 + V * ((t + i * (T / N)) % T);
      if (xs > AGENT - 40 && xs < AGENT + 70) active = i;
      if (xs > GATE - 30 && xs < GATE + 30) gate = 1;
    }
    TOOLS.forEach((_, k) => {
      const on = active >= 0 && active % 3 === k;
      const d = drawers.current[k], l = lamps.current[k];
      if (d) d.style.transform = `translate3d(0,${on ? 9 : 0}px,0)`;
      if (l) l.style.background = on ? '#7fd3a2' : '#4a4a45';
    });
    gateLight.current!.style.opacity = String(gate ? 0.9 : 0.35);
    dots.current.forEach((d, k) => { if (d) d.style.opacity = String(active >= 0 ? 0.35 + 0.65 * Math.max(0, Math.sin(t * 7 - k * 1.1)) : 0.25); });
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const beltBgV = 'repeating-linear-gradient(180deg,#2a2a27 0 14px,#33332f 14px 16px)';
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.92} offset={[0, -3]}
      label="An isometric message sorter: chat messages ride a belt past an AI agent desk with tool drawers and a validation gate; most turn into a resolved bin, the rest roll on to a human desk."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* main belt */}
      <Box x={18} y={150} w={604} d={56} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={154} w={592} d={48} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />
      <Box x={618} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />

      {/* north lane to the resolved bin */}
      <Box x={FORK - 8} y={56} w={60} d={96} h={10} z={8} c={P.ink3} r={4} />
      <Slab ref={belt2} x={FORK - 4} y={60} w={52} d={90} z={18.5} bg={beltBgV} r={3} />
      <Box x={FORK - 8} y={14} w={60} d={44} h={20} z={8} c={P.paper2} r={4}
        top={<div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#cfcfc8', boxShadow: 'inset 0 0 0 2px rgba(63,166,107,.7)' }} />} />

      {/* lane rails */}
      <Box x={FORK - 10} y={56} w={4} d={96} h={16} z={8} c={P.steel} />
      <Box x={FORK + 48} y={56} w={4} d={96} h={16} z={8} c={P.steel} />
      {/* agent desk: chat screen */}
      <Box x={96} y={52} w={112} d={50} h={50} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 6px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}><span>GPT-4 AGENT</span><span>NL / EN</span></div>
            <div style={{ marginTop: 4, width: 44, height: 9, borderRadius: 4, background: '#2a2a27' }} />
            <div style={{ marginTop: 3, marginLeft: 'auto', width: 60, height: 9, borderRadius: 4, background: P.green, display: 'flex', alignItems: 'center', gap: 3, padding: '0 6px' }}>
              {[0, 1, 2].map((k) => <span key={k} ref={(el) => { dots.current[k] = el; }} style={{ width: 3, height: 3, borderRadius: 2, background: '#0d0d0c' }} />)}
            </div>
          </div>
        } />
      <Box x={110} y={102} w={84} d={8} h={4} z={8} c={P.steelDark} />

      {/* tool drawers: availability, extend, update */}
      <Box x={222} y={50} w={150} d={50} h={40} z={8} c={P.steelDark} r={3} />
      {TOOLS.map((name, k) => (
        <Group key={name} ref={(el) => { drawers.current[k] = el; }}>
          <Box x={228 + k * 48} y={58} w={42} d={46} h={30} z={8.5} c={P.steel} r={2}
            front={
              <div style={{ position: 'relative', width: '100%', height: '100%', fontFamily: 'ui-monospace,monospace', fontSize: 7, color: P.ink, textAlign: 'center', paddingTop: 3 }}>
                {name}
                <div ref={(el) => { lamps.current[k] = el; }} style={{ position: 'absolute', left: '50%', bottom: 4, width: 14, height: 3, marginLeft: -7, borderRadius: 2, background: '#4a4a45', transition: 'background .25s' }} />
              </div>
            } />
        </Group>
      ))}

      {/* agent arch over the belt */}
      <Box x={AGENT} y={134} w={14} d={12} h={62} z={8} c={P.steel} />
      <Box x={AGENT} y={210} w={14} d={12} h={62} z={8} c={P.steel} />
      <Box x={AGENT - 4} y={130} w={22} d={96} h={12} z={70} c={P.ink3} r={3}
        top={<div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: P.paper }} />} />

      {/* backend validation gate */}
      <Box x={GATE} y={138} w={10} d={10} h={44} z={8} c={P.steelDark} />
      <Box x={GATE} y={208} w={10} d={10} h={44} z={8} c={P.steelDark} />
      <Box x={GATE - 2} y={134} w={14} d={88} h={8} z={52} c={P.ink3} r={2} />
      <div ref={gateLight} style={{ position: 'absolute', left: GATE + 1, top: 154, width: 8, height: 48, background: 'linear-gradient(90deg,transparent,rgba(63,166,107,.85),transparent)', transform: 'translateZ(23px)', transformStyle: 'preserve-3d', opacity: 0.35 }} />

      {/* human desk at the end of the belt */}
      <Box x={548} y={212} w={70} d={42} h={22} z={8} c={P.paper2} r={3} />
      <Box x={566} y={222} w={30} d={4} h={18} z={30} c={P.ink3} r={2}
        front={<div style={{ position: 'absolute', inset: 2, background: '#0d0d0c', borderRadius: 1 }} />} />
      <Box x={540} y={104} w={78} d={34} h={14} z={8} c={P.ink3} r={3} />
      <Box x={578} y={110} w={34} d={22} h={5} z={22} c={P.steelDark} r={2} />

      {Array.from({ length: N }, (_, i) => <Message key={i} i={i} />)}

      <Bill x={590} y={226} z={34}><Person /></Bill>
      <Bill x={590} y={226} z={90}><Chip tone="signal">human handoff</Chip></Bill>
      <Bill x={FORK + 22} y={34} z={42}><Chip tone="light"><span style={{ color: P.green }}>55%</span> resolved, no human</Chip></Bill>
      <Bill x={290} y={62} z={50}><Chip tone="dark">validated tool call</Chip></Bill>
      <Bill x={150} y={296} z={10}><Chip tone="dark"><span style={{ color: P.signal }}>80K+</span> customers</Chip></Bill>
    </Stage>
  );
}
