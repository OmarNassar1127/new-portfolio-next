'use client';

/**
 * Invoice fraud prevention: invoices ride a conveyor through a risk scanner.
 * Low scores roll on to "approved"; high scores drop to a second belt and split
 * into micro-invoices, the way the real system split monthly invoices by risk.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, OnFrame, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 11; // loop length per invoice
const SCORES = [14, 88, 31, 76];
const V = 62; // belt speed px/s

function Invoice({ i, onScan }: { i: number; onScan: (score: number) => void }) {
  const g = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const micro = useRef<(HTMLDivElement | null)[]>([]);
  const score = SCORES[i];
  const high = score > 60;
  const scanned = useRef(-1);

  useFrame((t) => {
    const lt = (t + i * (T / 4)) % T;
    let x = -20 + V * lt, y = 163, z = 23, split = 0, fade = 1;
    if (high && x > 380) {
      const k = ease(span(lt, 400 / V, 7.2));
      const along = Math.max(0, lt - 7.2);
      x = lerp(380, 392, k) + V * along;
      y = lerp(163, 262, k);
      z = lerp(23, 19, k);
      split = ease(span(lt, 7.3, 8.1));
    }
    const end = high ? 500 : 560;
    if (x > end) fade = Math.max(0, 1 - (x - end) / 50);
    if (lt < 0.6) fade = lt / 0.6;
    g.current!.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    g.current!.style.opacity = String(fade);
    // scored once it clears the gate
    const past = x > 296;
    tag.current!.style.opacity = past ? '1' : '0';
    if (past && scanned.current !== Math.floor((t + i * (T / 4)) / T)) {
      scanned.current = Math.floor((t + i * (T / 4)) / T);
      onScan(score);
    }
    if (high) {
      main.current!.style.opacity = String(1 - split);
      micro.current.forEach((m, k) => {
        if (!m) return;
        m.style.opacity = String(split);
        m.style.transform = `translate3d(${split * (k * 30 - 30)}px,${split * 4}px,0)`;
      });
    }
  });

  const lines = 'repeating-linear-gradient(180deg,transparent 0 5px,rgba(20,20,19,.16) 5px 6px)';
  return (
    <Group ref={g}>
      <div ref={main} style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
        <Box x={0} y={0} w={44} d={30} h={3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
          top={<div style={{ position: 'absolute', inset: '5px 6px', background: `linear-gradient(90deg,${high ? P.signal : P.green} 0 10px,transparent 10px) 0 0/100% 4px no-repeat,${lines}` }} />} />
      </div>
      {high && [0, 1, 2, 3].map((k) => (
        <div key={k} ref={(el) => { micro.current[k] = el; }} style={{ position: 'absolute', opacity: 0, transformStyle: 'preserve-3d' }}>
          <Box x={12} y={6} w={20} d={16} h={3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
            top={<div style={{ position: 'absolute', inset: '3px', background: `linear-gradient(90deg,${P.signal} 0 5px,transparent 5px) 0 0/100% 3px no-repeat,${lines}` }} />} />
        </div>
      ))}
      <Bill x={22} y={15} z={26} ref={tag} style={{ opacity: 0, transition: 'opacity .3s' }}>
        <Chip tone={high ? 'signal' : 'light'}>
          <span className="opacity-60">risk</span> {score}
        </Chip>
      </Bill>
    </Group>
  );
}

export default function InvoiceFraudScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const belt2 = useRef<HTMLDivElement>(null);
  const laser = useRef<HTMLDivElement>(null);
  const screenN = useRef<HTMLSpanElement>(null);
  const screenBar = useRef<HTMLDivElement>(null);
  const flash = useRef(0);

  const onScan = (s: number) => {
    flash.current = performance.now();
    if (screenN.current) { screenN.current.textContent = String(s); screenN.current.style.color = s > 60 ? P.signal : '#7fd3a2'; }
    if (screenBar.current) { screenBar.current.style.width = s + '%'; screenBar.current.style.background = s > 60 ? P.signal : P.green; }
  };

  const tick = (t: number) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    belt2.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    const since = (performance.now() - flash.current) / 1000;
    laser.current!.style.opacity = String(0.35 + 0.65 * Math.max(0, 1 - since / 0.6) + 0.08 * Math.sin(t * 9));
  };

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.08} offset={[0, -2]}
      label="An isometric conveyor: invoices pass a risk scanner; high-risk invoices drop to a second belt and split into micro-invoices."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate with a faint grid */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* main conveyor */}
      <Box x={18} y={150} w={604} d={56} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={154} w={592} d={48} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />
      <Box x={618} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />

      {/* micro-invoice belt */}
      <Box x={360} y={248} w={262} d={44} h={10} z={8} c={P.ink3} r={4} />
      <Slab ref={belt2} x={364} y={252} w={254} d={36} z={18.5} bg={beltBg} r={3} />
      <Slab x={340} y={206} w={40} d={46} z={8.5} r={4} bg="linear-gradient(160deg,#2e2e2a,#24241f)" />

      {/* scanner gate */}
      <Box x={284} y={134} w={14} d={12} h={74} z={8} c={P.steel} />
      <Box x={284} y={210} w={14} d={12} h={74} z={8} c={P.steel} />
      <Box x={280} y={130} w={22} d={96} h={12} z={82} c={P.signal} r={3} />
      <Box ref={laser} x={290} y={150} w={2} d={56} h={58} z={22}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.65),rgba(242,84,26,.15))' }} />
      <Slab x={286} y={154} w={10} d={48} z={23} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.55),transparent)" />

      {/* risk console */}
      <Box x={176} y={52} w={96} d={50} h={46} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 7px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>RISK SCORE</div>
            <span ref={screenN} style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>--</span>
            <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 2 }}>
              <div ref={screenBar} style={{ height: 3, width: '0%', borderRadius: 2, transition: 'width .4s, background .4s' }} />
            </div>
          </div>
        } />
      <Slab x={222} y={102} w={4} d={48} z={8.5} bg={P.steelDark} />

      {/* approved bin at the end of the main belt */}
      <Box x={566} y={60} w={56} d={70} h={18} z={8} c={P.paper2} r={4}
        top={<div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#cfcfc8' }} />} />

      <OnFrame fn={tick} />
      {SCORES.map((_, i) => <Invoice key={i} i={i} onScan={onScan} />)}

      <Bill x={594} y={95} z={40}><Chip tone="light">approved</Chip></Bill>
      <Bill x={590} y={318} z={10}><Chip tone="signal">micro-invoices</Chip></Bill>
      <Bill x={150} y={92} z={30}><Chip tone="dark">50k+ transactions / month</Chip></Bill>
      <Bill x={200} y={300} z={20}><Chip tone="dark"><span style={{ color: P.signal }}>€2M+</span> recovered</Chip></Bill>
    </Stage>
  );
}
