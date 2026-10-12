'use client';

/**
 * Autonomous research agent: a gantry crane runs along a rail above web pages and
 * academic papers, picks one sheet at a time, and carries it to a tray where the
 * sheets stack up into a 10-page cited report. A cover drops on, the report
 * slides to the output tray (Markdown and PDF), and the next topic starts.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 12; // loop length (s)
const PAGES = 10;
const SRC = [110, 190, 270, 350, 430]; // source centres (x): 2 web, 3 paper stacks
const ORDER = [0, 2, 1, 3, 4, 2, 0, 3, 1, 4];
const TRAY = 545;
const CY = 150; // rail y
const REACH = 95; // arm reach toward the sources/tray row (y = 55)
const UP = 54;
const HOOK = 84; // rod top, under the arm
const OUT_DY = 195; // tray row -> output tray

const SHEET = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };
const lines = 'repeating-linear-gradient(180deg,transparent 0 4px,rgba(20,20,19,.2) 4px 5px)';
const sheetTop = (
  <div style={{ position: 'absolute', inset: '3px 4px', background: `linear-gradient(90deg,${P.signal} 0 6px,transparent 6px) 0 0/100% 3px no-repeat,${lines}` }} />
);

function WebSource({ cx }: { cx: number }) {
  return (
    <>
      <Box x={cx - 28} y={35} w={56} d={40} h={20} z={8} c={P.ink3} r={3}
        top={
          <div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: '#e8ecf1', overflow: 'hidden' }}>
            <div style={{ height: 7, background: '#c5ccd6', display: 'flex', gap: 2, padding: '2px 3px' }}>
              <i style={{ width: 3, height: 3, borderRadius: 3, background: P.signal }} />
              <i style={{ width: 3, height: 3, borderRadius: 3, background: P.steel }} />
              <i style={{ width: 22, height: 3, borderRadius: 2, background: '#f7f9fb', marginLeft: 3 }} />
            </div>
            <div style={{ position: 'absolute', inset: '10px 4px 3px', background: `linear-gradient(90deg,#9fb2c6 0 14px,transparent 14px) 0 0/100% 8px no-repeat,${lines}` }} />
          </div>
        }
        front={<div style={{ position: 'absolute', left: 5, top: 7, width: 20, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.35)' }} />} />
    </>
  );
}

function PaperSource({ cx, k }: { cx: number; k: number }) {
  const cols = [P.paper2, P.paper, P.steel];
  return (
    <>
      <Box x={cx - 27 + (k % 2)} y={36} w={54} d={38} h={8} z={8} c={{ top: cols[k % 3], s: '#a9a9a2', w: '#bdbdb6' }} />
      <Box x={cx - 25 - (k % 2)} y={37} w={52} d={36} h={6} z={16} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }} top={sheetTop} />
      <Box x={cx - 26} y={38} w={50} d={34} h={6} z={22} c={{ top: P.paper2, s: '#c3c3bc', w: '#d0d0c9' }}
        top={<div style={{ position: 'absolute', inset: '4px 5px', background: lines }} />} />
      <Slab x={cx + 14} y={38} w={10} d={6} z={28.5} bg={P.signal} />
    </>
  );
}

function Rig() {
  const carriage = useRef<HTMLDivElement>(null);
  const arm = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const rod = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const pages = useRef<(HTMLDivElement | null)[]>([]);
  const report = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const screenN = useRef<HTMLSpanElement>(null);
  const screenBar = useRef<HTMLDivElement>(null);
  const shown = useRef(-1);

  useFrame((tt) => {
    const lt = tt % T;
    let cx = SRC[ORDER[0]], ext = 0, zb = UP, carrying = false;
    if (lt < PAGES) {
      const n = Math.floor(lt), u = lt - n;
      const sx = SRC[ORDER[n]], nx = SRC[ORDER[(n + 1) % PAGES]];
      cx = u < 0.3 ? sx : u < 0.6 ? lerp(sx, TRAY, ease(span(u, 0.3, 0.6))) : u < 0.88 ? TRAY : lerp(TRAY, nx, ease(span(u, 0.88, 1)));
      ext = ease(span(u, 0, 0.12)) - ease(span(u, 0.28, 0.38)) + ease(span(u, 0.55, 0.66)) - ease(span(u, 0.84, 0.92));
      const f1 = ease(span(u, 0.12, 0.2)) - ease(span(u, 0.2, 0.28));
      const f2 = ease(span(u, 0.66, 0.74)) - ease(span(u, 0.77, 0.84));
      zb = UP - (UP - 30.5) * f1 - (UP - (16 + 2.4 * n)) * f2;
      carrying = u >= 0.2 && u < 0.77;
    }
    carriage.current!.style.transform = `translate3d(${cx}px,${CY}px,0)`;
    arm.current!.style.transform = `scaleY(${Math.max(ext, 0.001)})`;
    head.current!.style.transform = `translate3d(0,${-REACH * ext}px,0)`;
    rod.current!.style.transform = `translateZ(${zb}px) scaleZ(${(HOOK - zb) / 60})`;
    foot.current!.style.transform = `translateZ(${zb}px)`;
    sheet.current!.style.visibility = carrying ? 'visible' : 'hidden';

    // pages land as the hook lets go; the report ends with a cover and slides out
    const placed = lt >= PAGES ? PAGES : Math.floor(lt) + (lt - Math.floor(lt) >= 0.77 ? 1 : 0);
    const gone = lt >= 11.88;
    pages.current.forEach((p, k) => { if (p) p.style.visibility = k < placed && !gone ? 'visible' : 'hidden'; });
    const cz = lerp(96, 14 + PAGES * 2.4 + 0.2, ease(span(lt, 10, 10.7)));
    cover.current!.style.transform = `translateZ(${cz - 38.2}px)`;
    cover.current!.style.visibility = lt >= 10 && !gone ? 'visible' : 'hidden';
    report.current!.style.transform = `translate3d(0,${OUT_DY * ease(span(lt, 11, 11.85))}px,0)`;

    pulse.current!.style.transform = `translateY(${((tt * 40) % 30)}px)`;
    if (shown.current !== placed) {
      shown.current = placed;
      screenN.current!.textContent = `${placed}/${PAGES}`;
      screenBar.current!.style.width = `${placed * 10}%`;
    }
  });

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* sources: two web pages, three paper stacks */}
      <WebSource cx={SRC[0]} />
      <WebSource cx={SRC[1]} />
      <PaperSource cx={SRC[2]} k={0} />
      <PaperSource cx={SRC[3]} k={1} />
      <PaperSource cx={SRC[4]} k={2} />

      {/* pickup tray and output tray */}
      <Box x={TRAY - 32} y={38} w={64} d={34} h={6} z={8} c={P.steel} r={3}
        top={<div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: '#7d7d77' }} />} />
      <Box x={TRAY - 40} y={222} w={80} d={56} h={6} z={8} c={P.steel} r={3}
        top={<div style={{ position: 'absolute', inset: 4, borderRadius: 2, background: '#7d7d77' }} />} />
      <Slab x={TRAY - 8} y={166} w={16} d={52} z={8.5} r={2} bg="repeating-linear-gradient(180deg,rgba(242,84,26,.5) 0 6px,transparent 6px 14px)" />

      {/* the report: pages, then a cover */}
      <Group ref={report}>
        {Array.from({ length: PAGES }, (_, k) => (
          <Box key={k} ref={(el) => { pages.current[k] = el; }} x={TRAY - 16} y={43} w={32} d={24} h={2} z={14 + 2.4 * k}
            c={SHEET} top={sheetTop} style={{ visibility: 'hidden' }} />
        ))}
        <Group ref={cover} style={{ visibility: 'hidden' }}>
          <Box x={TRAY - 19} y={40} w={38} d={30} h={3} z={38.2} c={P.signal} r={1}
            top={<div style={{ position: 'absolute', left: 5, top: 5, width: 14, height: 3, background: P.ink, opacity: 0.8 }} />} />
        </Group>
      </Group>

      {/* gantry rail */}
      <Box x={50} y={139} w={24} d={22} h={3} z={8} c={P.steelDark} r={3} />
      <Box x={582} y={139} w={24} d={22} h={3} z={8} c={P.steelDark} r={3} />
      <Box x={56} y={143} w={12} d={14} h={65} z={11} c={P.steel} />
      <Box x={588} y={143} w={12} d={14} h={65} z={11} c={P.steel} />
      <Box x={56} y={146} w={544} d={8} h={8} z={76} c={P.steel} />
      <Slab x={70} y={147} w={516} d={2} z={84.5} bg="rgba(255,255,255,.45)" />

      {/* carriage, arm, hook */}
      <Group ref={carriage}>
        <Box x={-11} y={-9} w={22} d={18} h={14} z={76} c={P.signal} r={2} />
        <Group ref={arm}>
          <Box x={-2} y={-REACH} w={4} d={REACH} h={6} z={84} c={P.steelDark} />
        </Group>
        <Group ref={head}>
          <Group ref={rod}>
            <Box x={-2} y={-2} w={4} d={4} h={60} z={0} c={P.steelDark} />
          </Group>
          <Group ref={foot}>
            <Box x={-9} y={-7} w={18} d={14} h={3} z={0} c={P.ink3} r={2} />
            <Group ref={sheet}>
              <Box x={-16} y={-12} w={32} d={24} h={1.6} z={-2} c={SHEET} top={sheetTop} />
            </Group>
          </Group>
        </Group>
      </Group>

      {/* topic console, wired to the rail */}
      <Slab x={59} y={160} w={3} d={40} z={8.5} bg={P.steelDark} />
      <Slab ref={pulse} x={58} y={160} w={5} d={12} z={9} r={2} bg={P.signal} />
      <Box x={36} y={198} w={104} d={46} h={44} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 7px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>TOPIC</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span ref={screenN} style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>0/{PAGES}</span>
              <span style={{ fontSize: 7, opacity: 0.6 }}>pages</span>
            </div>
            <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 2 }}>
              <div ref={screenBar} style={{ height: 3, width: '0%', borderRadius: 2, background: P.signal }} />
            </div>
          </div>
        } />
      <Box x={52} y={250} w={72} d={16} h={3} z={8} c={P.ink3} r={2}
        top={<div style={{ position: 'absolute', inset: 2, background: 'repeating-linear-gradient(90deg,#44443f 0 6px,transparent 6px 8px)' }} />} />

      <Bill x={150} y={22} z={30}><Chip tone="light">web search</Chip></Bill>
      <Bill x={350} y={22} z={34}><Chip tone="dark">academic papers</Chip></Bill>
      <Bill x={612} y={34} z={26}><Chip tone="signal">10-page report</Chip></Bill>
      <Bill x={TRAY} y={302} z={4}><Chip tone="light">Markdown · PDF</Chip></Bill>
    </>
  );
}

export default function AutonomousResearchAgentScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.02} offset={[0, 0]} stillAt={10.6}
      label="An isometric research desk: a gantry crane picks single sheets from web pages and paper stacks and carries them to a tray, where they build up into a 10-page cited report that slides out as Markdown and PDF."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Rig />
    </Stage>
  );
}
