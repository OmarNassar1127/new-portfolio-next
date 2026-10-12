'use client';

/**
 * AI website builder: a typed brief drops onto a belt as a blank page. Three
 * gates fill it in (GPT-4 writes the copy, DALL·E 3 paints the image, Next.js
 * lays out the nav), and the finished site lights up on the live screen at the end.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 10; // loop length (s)
const V = 62;
const GATES = [170, 300, 430];

/** page centre-line x along the belt for loop time lt */
const pageX = (lt: number) => 40 + 500 * span(lt, 0.5, 8.4);

const MONO = 'ui-monospace,monospace';

function Page({ refs }: { refs: Record<string, React.RefObject<HTMLDivElement | null>> }) {
  const ghost = 'repeating-linear-gradient(90deg,rgba(20,20,19,.22) 0 3px,transparent 3px 6px)';
  return (
    <Box x={0} y={0} w={64} d={44} h={3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
      top={
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* dashed wireframe shows before the gates fill it in */}
          <div style={{ position: 'absolute', left: 2, top: 2, right: 2, height: 5, background: ghost, opacity: 0.7 }} />
          <div style={{ position: 'absolute', left: 3, top: 10, width: 24, height: 20, border: '1px dashed rgba(20,20,19,.3)' }} />
          <div style={{ position: 'absolute', left: 30, top: 11, width: 30, height: 18, border: '1px dashed rgba(20,20,19,.25)' }} />
          {/* nav (Next.js) */}
          <div ref={refs.nav} style={{ position: 'absolute', left: 2, top: 2, right: 2, height: 5, background: P.ink3, transformOrigin: 'left', transform: 'scaleX(0)' }}>
            <div style={{ position: 'absolute', right: 3, top: 1.5, width: 5, height: 2, background: P.signal }} />
          </div>
          {/* image (DALL·E 3) */}
          <div ref={refs.img} style={{ position: 'absolute', left: 3, top: 10, width: 24, height: 20, clipPath: 'inset(0 0 100% 0)', background: `radial-gradient(circle at 70% 30%,#ffd9a8 0 14%,transparent 15%),linear-gradient(160deg,${P.signal},#6a2a14)` }} />
          {/* copy (GPT-4) */}
          <div ref={refs.txt} style={{ position: 'absolute', left: 30, top: 11, width: 0, height: 18, overflow: 'hidden' }}>
            <div style={{ width: 30, height: 3, background: P.ink, marginBottom: 3 }} />
            {[28, 30, 22, 26].map((w, i) => <div key={i} style={{ width: w, height: 2, background: 'rgba(20,20,19,.45)', marginBottom: 2 }} />)}
          </div>
          <div ref={refs.foot} style={{ position: 'absolute', left: 3, bottom: 3, width: 20, height: 4, background: P.signal, opacity: 0 }} />
        </div>
      } />
  );
}

function Gate({ x, head, glow }: { x: number; head: React.Ref<HTMLDivElement>; glow: React.Ref<HTMLDivElement> }) {
  return (
    <>
      <Box x={x - 8} y={134} w={14} d={12} h={70} z={8} c={P.steel} />
      <Box x={x - 8} y={210} w={14} d={12} h={70} z={8} c={P.steel} />
      <Box x={x - 12} y={130} w={22} d={96} h={12} z={78} c={P.ink3} r={3}
        top={<div style={{ position: 'absolute', left: 8, top: 4, right: 8, bottom: 4, background: P.signal, borderRadius: 2 }} />} />
      <Box ref={head} x={x - 6} y={150} w={12} d={12} h={14} z={64} c={P.paper2} r={2} />
      <Box ref={glow} x={x - 1} y={150} w={2} d={52} h={40} z={23}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.6),rgba(242,84,26,.1))' }} />
    </>
  );
}

function Rig() {
  const belt = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const heads = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const glows = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const live = useRef<HTMLDivElement>(null);
  const liveDot = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    const lt = t % T;
    const x = pageX(lt);
    const moving = lt > 0.5 && lt < 8.4;
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;

    // page: drops from the tray, rides the belt, lifts away at the live screen
    const drop = ease(span(lt, 0, 0.6));
    const gone = span(lt, 8.6, 9.3);
    page.current!.style.transform = `translate3d(${x - 32}px,${lerp(120, 156, drop)}px,${lerp(34, 23, drop) + 14 * ease(gone)}px)`;
    page.current!.style.opacity = String(Math.min(drop * 1.4, 1) * (1 - gone));

    const txtP = ease(span(x, GATES[0] - 14, GATES[0] + 36));
    const imgP = ease(span(x, GATES[1] - 14, GATES[1] + 36));
    const navP = ease(span(x, GATES[2] - 14, GATES[2] + 30));
    txt.current!.style.width = `${30 * txtP}px`;
    img.current!.style.clipPath = `inset(0 0 ${100 - imgP * 100}% 0)`;
    nav.current!.style.transform = `scaleX(${navP})`;
    foot.current!.style.opacity = String(navP);

    // gate heads sweep across the belt while a page is under them
    GATES.forEach((gx, i) => {
      const near = 1 - Math.min(1, Math.abs(x - gx) / 46);
      const act = moving ? near : 0;
      const sweep = 0.5 + 0.5 * Math.sin(t * 7 + i);
      heads[i].current!.style.transform = `translate3d(0,${lerp(0, 36, sweep) * act}px,0)`;
      glows[i].current!.style.opacity = String(0.1 + 0.9 * act);
    });

    // live screen: the built site appears, then dims for the next loop
    const on = ease(span(lt, 8.6, 9.3)) * (1 - ease(span(lt, 9.6, 10)));
    live.current!.style.opacity = String(on);
    liveDot.current!.style.opacity = String(on * (0.6 + 0.4 * Math.sin(t * 6)));
    bar.current!.style.width = `${Math.min(100, (lt / 8.8) * 100)}%`;
    sheet.current!.style.opacity = String(1 - drop * 0.0);
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const mini = (
    <div ref={live} style={{ position: 'absolute', inset: 4, borderRadius: 2, background: P.paper, opacity: 0 }}>
      <div style={{ position: 'absolute', left: 3, top: 3, right: 3, height: 6, background: P.ink3 }}>
        <div style={{ position: 'absolute', right: 4, top: 2, width: 12, height: 2, background: P.signal }} />
      </div>
      <div style={{ position: 'absolute', left: 4, top: 14, width: 30, height: 26, background: `radial-gradient(circle at 70% 30%,#ffd9a8 0 14%,transparent 15%),linear-gradient(160deg,${P.signal},#6a2a14)` }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', left: 40, top: 15 + i * 6, width: i === 0 ? 34 : 28, height: i === 0 ? 4 : 2, background: i === 0 ? P.ink : 'rgba(20,20,19,.45)' }} />)}
      <div ref={liveDot} style={{ position: 'absolute', right: 4, bottom: 4, width: 6, height: 6, borderRadius: 3, background: P.green }} />
    </div>
  );

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* belt */}
      <Box x={18} y={150} w={604} d={56} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={154} w={592} d={48} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />
      <Box x={618} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />

      {/* brief tray: the typed brief that starts the run */}
      <Box x={22} y={96} w={66} d={46} h={8} z={8} c={P.paper2} r={4} />
      <Box ref={sheet} x={28} y={101} w={52} d={36} h={5} z={16} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
        top={<div style={{ position: 'absolute', inset: '5px 6px', background: 'repeating-linear-gradient(180deg,rgba(20,20,19,.5) 0 2px,transparent 2px 6px)' }} />} />

      {/* cables from the console to each gate */}
      <Slab x={110} y={112} w={330} d={3} z={8.5} bg={P.steelDark} />
      {GATES.map((gx) => <Slab key={gx} x={gx - 1} y={112} w={3} d={20} z={8.5} bg={P.steelDark} />)}

      {/* console: run progress */}
      <Box x={104} y={52} w={104} d={44} h={44} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 7px', fontFamily: MONO, color: '#f2f2ee' }}>
            <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>BRIEF TO LIVE</div>
            <div style={{ fontSize: 9, margin: '3px 0 4px', opacity: 0.9 }}>&lt;10 min</div>
            <div style={{ height: 3, background: '#2a2a27', borderRadius: 2 }}>
              <div ref={bar} style={{ height: 3, width: '0%', borderRadius: 2, background: P.signal }} />
            </div>
          </div>
        } />
      <Slab x={152} y={96} w={4} d={34} z={8.5} bg={P.steelDark} />

      {/* the three gates */}
      <Gate x={GATES[0]} head={heads[0]} glow={glows[0]} />
      <Gate x={GATES[1]} head={heads[1]} glow={glows[1]} />
      <Gate x={GATES[2]} head={heads[2]} glow={glows[2]} />

      {/* live screen at the end of the belt */}
      <Box x={520} y={70} w={96} d={14} h={62} z={8} c={P.ink3} r={3}
        front={<div style={{ position: 'absolute', inset: 4, borderRadius: 2, background: '#0d0d0c' }}>{mini}</div>} />
      <Box x={554} y={84} w={28} d={10} h={6} z={8} c={P.steelDark} r={2} />
      <Slab x={528} y={112} w={80} d={30} z={8.5} r={4} bg="linear-gradient(160deg,#2e2e2a,#24241f)" />

      {/* the moving page */}
      <Group ref={page}>
        <Page refs={{ nav, img, txt, foot }} />
      </Group>

      <Bill x={GATES[0]} y={178} z={100}><Chip tone="dark">GPT-4</Chip></Bill>
      <Bill x={GATES[1]} y={178} z={100}><Chip tone="signal">DALL·E 3</Chip></Bill>
      <Bill x={GATES[2] - 20} y={200} z={100}><Chip tone="dark">Next.js</Chip></Bill>
      <Bill x={380} y={318} z={14}><Chip tone="dark"><span style={{ color: P.signal }}>5+</span> client sites shipped</Chip></Bill>
    </>
  );
}

export default function AiWebsiteBuilderScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.9} offset={[0, -2]} stillAt={9}
      label="An isometric build line: a typed brief drops onto a belt as a blank page; three gates add GPT-4 copy, a DALL·E 3 image and the Next.js layout, and the finished site lights up on a live screen."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Rig />
    </Stage>
  );
}
