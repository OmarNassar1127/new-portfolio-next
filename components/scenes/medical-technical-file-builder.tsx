'use client';

/**
 * Medical technical file builder: regulation binders (FDA, CE, ISO) feed pages
 * onto a belt, an NLP gate reads and tags each one, and the tagged pages stack
 * into one technical file that gets a sign-off stamp. Three months of manual
 * compiling, run through the machine in about a week.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 9; // loop length
const GAP = 1.5; // one page lands every GAP seconds
const V = 70; // belt speed px/s
const BELT_Y = 160;
const GATE_X = 300;
const SRC = [
  { name: 'FDA', c: P.ink3 },
  { name: 'CE', c: P.steelDark },
  { name: 'ISO', c: P.signalDark },
];
const SX = (k: number) => 43 + k * 66;
const DUR = (k: number) => 1.6 + (470 - SX(k)) / V + 0.6;

const PAGE = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };
const LINES = 'repeating-linear-gradient(180deg,transparent 0 5px,rgba(20,20,19,.16) 5px 6px)';

function Page({ p }: { p: number }) {
  const g = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const k = p % 3;
  const dur = DUR(k);
  const start = p * GAP - dur;
  const sheetZ = 28 + p * 3;

  useFrame((t) => {
    const lt = (((t - start) % T) + T) % T;
    const sx = SX(k);
    let x = sx, y = 82, z = 36, o = 1;
    if (lt < 0.8) {
      const e = ease(span(lt, 0, 0.8));
      z = lerp(36, 46, e);
      o = Math.min(1, lt / 0.25);
    } else if (lt < 1.6) {
      const e = ease(span(lt, 0.8, 1.6));
      y = lerp(82, BELT_Y + 6, e);
      z = lerp(46, 23.5, e);
    } else if (lt < dur - 0.6) {
      x = sx + V * (lt - 1.6);
      y = BELT_Y + 6;
      z = 23.5;
    } else {
      const e = ease(span(lt, dur - 0.6, dur));
      x = lerp(470, 530, e);
      y = lerp(BELT_Y + 6, 156, e);
      z = lerp(23.5, sheetZ + 0.5, e);
      o = 1 - span(lt, dur - 0.12, dur);
    }
    if (lt > dur) o = 0;
    g.current!.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    g.current!.style.opacity = String(o);
    tag.current!.style.opacity = x > GATE_X + 4 && lt < dur ? '1' : '0';
  });

  return (
    <Group ref={g}>
      <Box x={0} y={0} w={44} d={30} h={3} c={PAGE}
        top={<div style={{ position: 'absolute', inset: '5px 6px', background: LINES }} />} />
      <Slab ref={tag} x={6} y={5} z={3.4} w={22} d={4} bg={P.signal} style={{ opacity: 0, transition: 'opacity .25s' }} />
      <Slab x={6} y={11} z={3.4} w={14} d={3} bg="rgba(242,84,26,.55)" style={{ opacity: 1 }} />
    </Group>
  );
}

export default function MedicalTechnicalFileBuilderScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const sheets = useRef<(HTMLDivElement | null)[]>([]);
  const press = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    beam.current!.style.opacity = String(0.55 + 0.25 * Math.sin(t * 7));
    const ph = t % T;
    const fill = Math.floor(ph / GAP) + 1;
    sheets.current.forEach((s, i) => { if (s) s.style.opacity = i < fill ? '1' : '0'; });
    bar.current!.style.width = `${Math.min(100, (ph / (T - 0.6)) * 100)}%`;
    // stamp press comes down after the last page lands
    const down = ease(span(ph, 7.9, 8.2)) * (1 - ease(span(ph, 8.5, 8.9)));
    press.current!.style.transform = `translate3d(0,0,${-down * 26}px)`;
    done.current!.style.opacity = String(ph > 8.3 || ph < 0.5 ? 1 : 0);
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.9} offset={[0, -2]} stillAt={5.2}
      label="An isometric document line: regulation binders for FDA, CE and ISO feed pages onto a belt, an NLP gate reads and tags each page, and the pages stack into one technical file that gets a sign-off stamp."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: '#fbfbf8', s: '#b4b4ad', w: '#c4c4bd' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(20,20,19,.05) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(20,20,19,.05) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* regulation shelf: three binder stacks */}
      <Box x={22} y={50} w={206} d={64} h={6} z={8} c={P.steel} r={4} />
      {SRC.map((s, k) => (
        <Box key={s.name} x={SX(k) - 8} y={58} w={60} d={46} h={20} z={14} c={s.c} r={3}
          front={<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'ui-monospace,monospace', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: P.paper }}>{s.name}</div>}
          top={<div style={{ position: 'absolute', inset: 4, borderRadius: 2, background: 'rgba(255,255,255,.08)' }} />} />
      ))}
      {SRC.map((s, k) => (
        <Box key={'p' + s.name} x={SX(k) - 4} y={62} w={52} d={38} h={2} z={34} c={PAGE}
          top={<div style={{ position: 'absolute', inset: '4px 5px', background: LINES }} />} />
      ))}

      {/* belt */}
      <Box x={18} y={BELT_Y - 4} w={478} d={56} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={BELT_Y} w={466} d={48} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={BELT_Y - 7} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />
      {/* legs */}
      <Box x={60} y={BELT_Y + 40} w={8} d={8} h={8} z={0} c={P.steelDark} />
      <Box x={420} y={BELT_Y + 40} w={8} d={8} h={8} z={0} c={P.steelDark} />

      {/* NLP gate */}
      <Box x={GATE_X - 6} y={BELT_Y - 14} w={14} d={12} h={74} z={8} c={P.steel} />
      <Box x={GATE_X - 6} y={BELT_Y + 54} w={14} d={12} h={74} z={8} c={P.steel} />
      <Box x={GATE_X - 10} y={BELT_Y - 18} w={22} d={100} h={12} z={82} c={P.ink3} r={3} />
      <Slab x={GATE_X - 8} y={BELT_Y - 6} w={18} d={4} z={94.5} bg={P.signal} />
      <Box ref={beam} x={GATE_X} y={BELT_Y + 4} w={2} d={48} h={58} z={22}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.65),rgba(242,84,26,.15))' }} />
      <Slab x={GATE_X - 4} y={BELT_Y + 2} w={10} d={48} z={23} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.55),transparent)" />

      {/* progress console behind the belt */}
      <Box x={380} y={50} w={110} d={46} h={50} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 7px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>REQUIREMENTS</div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>5x faster</div>
            <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 3 }}>
              <div ref={bar} style={{ height: 3, width: '0%', borderRadius: 2, background: P.signal }} />
            </div>
          </div>
        } />
      <Slab x={430} y={96} w={4} d={46} z={8.5} bg={P.steelDark} />

      {/* assembly table with the technical file */}
      <Box x={494} y={118} w={128} d={110} h={14} z={8} c={P.paper2} r={4} />
      <Box x={504} y={226} w={8} d={8} h={8} z={0} c={P.steelDark} />
      <Box x={604} y={226} w={8} d={8} h={8} z={0} c={P.steelDark} />
      <Box x={520} y={140} w={64} d={48} h={4} z={22} c={P.ink3} r={2} />
      <Box x={514} y={140} w={8} d={48} h={20} z={22} c={P.signalDark} r={2} />
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} ref={(el) => { sheets.current[i] = el; }} x={525} y={146} w={44} d={30} h={3} z={26 + i * 3} c={PAGE}
          top={<div style={{ position: 'absolute', inset: '5px 6px', background: LINES }} />} />
      ))}

      {/* sign-off stamp press */}
      <Box x={592} y={128} w={10} d={10} h={64} z={22} c={P.steel} />
      <Group ref={press}>
        <Box x={534} y={130} w={68} d={10} h={8} z={78} c={P.steelDark} r={2} />
        <Box x={540} y={156} w={26} d={20} h={8} z={78} c={P.signal} r={2} />
      </Group>

      <Group>
        {Array.from({ length: 6 }, (_, p) => <Page key={p} p={p} />)}
      </Group>

      <Bill x={125} y={40} z={20}><Chip tone="dark">FDA · CE · ISO</Chip></Bill>
      <Bill x={GATE_X} y={BELT_Y + 6} z={104}><Chip tone="signal">NLP</Chip></Bill>
      <Bill x={430} y={330} z={4}><Chip tone="dark"><span style={{ color: P.signal }}>3 months</span> → 1 week</Chip></Bill>
      <Bill x={553} y={150} z={92} ref={done} style={{ transition: 'opacity .3s' }}><Chip tone="light">tech file signed off</Chip></Bill>
    </Stage>
  );
}
