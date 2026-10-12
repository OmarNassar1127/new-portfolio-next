'use client';

/**
 * License plate detection: a car rolls up to a parking entrance, stops under a
 * camera gantry, its plate is framed and read, the number lands on the kiosk and
 * the desk log, and the barrier lifts. Two cars alternate on a 12 s loop.
 */
import { useRef, type RefObject } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 12;
const OFF = [0, 6];
const PLATES = ['4821 KBT', '7305 HZM', '1962 LDR', '5547 GWC'];
const CAR_COL = [P.paper2, P.steel];
const STOP = 236; // front of the car at the barrier line
const LEN = 76;

/** Front of car (px along y) over one loop. */
function front(lt: number) {
  if (lt < 4) return -20 + 256 * (1 - (1 - lt / 4) ** 2);
  if (lt < 6.2) return STOP;
  return STOP + 300 * ((lt - 6.2) / 4.2) ** 2;
}
const openOf = (lt: number) => ease(span(lt, 5.4, 6)) * (1 - ease(span(lt, 8.4, 9.1)));

function CarModel({ c, plate, plateRef }: { c: string; plate?: string; plateRef?: RefObject<HTMLSpanElement | null> }) {
  const lamp = (l: number) => <div style={{ position: 'absolute', left: l, top: 3, width: 6, height: 3, background: '#f7f1c8', borderRadius: 1 }} />;
  return (
    <>
      {[[-2, 8], [38, 8], [-2, 56], [38, 56]].map(([x, y]) => (
        <Box key={`${x}${y}`} x={x} y={y} w={4} d={11} h={7} z={9} c={P.ink} r={2} />
      ))}
      <Box x={0} y={0} w={40} d={LEN} h={11} z={12} c={c} r={3}
        front={
          <>
            {lamp(3)}{lamp(31)}
            <div style={{ position: 'absolute', left: 10, top: 2, width: 20, height: 8, background: P.paper, border: '0.5px solid #141413', borderRadius: 1, display: 'grid', placeItems: 'center' }}>
              <span ref={plateRef} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 5.5, fontWeight: 700, color: P.ink, letterSpacing: '.02em', lineHeight: 1 }}>{plate ?? ''}</span>
            </div>
          </>
        } />
      <Box x={5} y={22} w={30} d={34} h={9} z={23} c={{ top: shadeTop(c), s: P.glass, w: '#8ea0b3' }} r={3}
        front={<div style={{ position: 'absolute', inset: '1px 2px 0', background: 'linear-gradient(160deg,#c9d6e3,#8fa3b7)', borderRadius: 2 }} />} />
    </>
  );
}
const shadeTop = (c: string) => `color-mix(in oklab, ${c} 90%, black)`;

function Car({ i, onScan }: { i: number; onScan: (plate: string) => void }) {
  const g = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const last = useRef(-1);

  useFrame((t) => {
    const u = t + OFF[i];
    const cyc = Math.floor(u / T), lt = u % T;
    const f = front(lt);
    const p = PLATES[(cyc * 2 + i) % 4];
    let a = Math.min(1, lt / 0.5);
    if (f > 330) a = Math.max(0, 1 - (f - 330) / 70);
    g.current!.style.transform = `translate3d(280px,${f - LEN}px,0)`;
    g.current!.style.opacity = String(a);
    if (last.current !== cyc && plate.current) { plate.current.textContent = p; last.current = cyc; }
    // plate framed, then read
    const framing = span(lt, 4.1, 4.5) * (1 - span(lt, 6.2, 6.6));
    const reading = lt > 4.1 && lt < 4.8;
    const fr = frame.current!;
    fr.style.opacity = String(framing * (reading ? 0.6 + 0.4 * Math.sin(t * 24) : 1));
    fr.style.borderColor = reading ? P.signal : P.green;
    chip.current!.style.opacity = String(span(lt, 4.8, 5.1) * (1 - span(lt, 7, 7.4)));
    if (lt > 4.8 && lt < 5.2) onScan(p);
  });

  return (
    <Group ref={g} style={{ transform: 'translate3d(280px,-80px,0)', opacity: 0 }}>
      <CarModel c={CAR_COL[i]} plate={PLATES[i]} plateRef={plate} />
      <Bill x={20} y={LEN + 1} z={14}>
        <div ref={frame} style={{ width: 32, height: 15, border: '2px solid', borderRadius: 2, opacity: 0, boxShadow: '0 0 8px rgba(0,0,0,.35)' }} />
      </Bill>
      <Bill x={20} y={LEN} z={36}>
        <div ref={chip} style={{ opacity: 0 }}><Chip tone="light"><span style={{ color: P.green }}>●</span> {'plate'} OK</Chip></div>
      </Bill>
    </Group>
  );
}

export default function LicensePlateScene({ project, className }: { project: Project; className?: string }) {
  const arm = useRef<HTMLDivElement>(null);
  const plateEl = useRef<HTMLSpanElement>(null);
  const statEl = useRef<HTMLSpanElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const laser = useRef<HTMLDivElement>(null);
  const roll = useRef<(HTMLDivElement | null)[]>([]);
  const dash = useRef<HTMLDivElement>(null);
  const shown = useRef('');
  const hist = useRef<string[]>([]);

  const onScan = (p: string) => {
    if (hist.current[0] === p) return;
    hist.current.unshift(p);
    hist.current.length = Math.min(hist.current.length, 3);
    hist.current.forEach((h, k) => { const el = roll.current[k]; if (el) el.textContent = h; });
  };

  useFrame((t) => {
    let open = 0, shownPlate = '--', st = 'WAIT', scanning = 0;
    OFF.forEach((o, i) => {
      const u = t + o, lt = u % T, cyc = Math.floor(u / T);
      open = Math.max(open, openOf(lt));
      if (lt > 4.8 && lt < 8.6) { shownPlate = PLATES[(cyc * 2 + i) % 4]; st = open > 0.5 ? 'OPEN' : 'READ'; }
      else if (lt > 4 && lt <= 4.8) { st = 'SCAN'; scanning = 1; }
    });
    arm.current!.style.transform = `translate3d(244px,248px,30px) rotateY(${-open * 78}deg)`;
    const key = shownPlate + st;
    if (key !== shown.current) {
      shown.current = key;
      plateEl.current!.textContent = shownPlate;
      statEl.current!.textContent = st;
      statEl.current!.style.color = st === 'OPEN' ? '#7fd3a2' : st === 'SCAN' ? P.signal : '#9a9a93';
    }
    lens.current!.style.opacity = String(scanning ? 0.55 + 0.45 * Math.sin(t * 24) : 0.5 + 0.25 * Math.sin(t * 3));
    laser.current!.style.opacity = String(scanning ? 0.9 : 0.25);
    dash.current!.style.backgroundPosition = `0 ${(t * 40) % 40}px`;
  });

  const stripes = 'repeating-linear-gradient(90deg,#f2f2ee 0 12px,#f2541a 12px 24px)';
  return (
    <Stage w={600} d={360} tone={project.cover.tone} className={className} zoom={0.9} offset={[0, -2]}
      label="An isometric parking entrance: a car stops under a camera gantry, its plate is framed and read, the number appears on the kiosk and log, and the barrier lifts."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={600} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* access road */}
      <Slab x={250} y={0} w={100} d={360} z={8.5} bg="#151514" />
      <Slab x={252} y={0} w={2} d={360} z={9} bg="rgba(242,242,238,.55)" />
      <Slab x={346} y={0} w={2} d={360} z={9} bg="rgba(242,242,238,.55)" />
      <Slab ref={dash} x={299} y={0} w={2} d={360} z={9} bg="repeating-linear-gradient(180deg,rgba(242,242,238,.35) 0 14px,transparent 14px 40px)" />
      <Slab x={254} y={240} w={92} d={3} z={9.2} bg={P.paper} />

      {/* parking lot behind the barrier */}
      <Slab x={392} y={238} w={186} d={100} z={8.5} r={4} bg="#1a1a18" />
      <Slab x={392} y={238} w={186} d={100} z={9} r={4} bg="repeating-linear-gradient(90deg,rgba(242,242,238,.4) 0 2px,transparent 2px 62px)" />
      {[398, 460, 522].map((x, k) => (
        <Group key={x} style={{ transform: `translate3d(${x}px,252px,0)` }}>
          <CarModel c={[P.steel, P.paper2, P.steelDark][k]} plate={PLATES[k + 1]} />
        </Group>
      ))}

      {/* camera gantry over the stop position */}
      <Box x={236} y={146} w={12} d={12} h={80} z={8} c={P.steel} r={2} />
      <Box x={352} y={146} w={12} d={12} h={80} z={8} c={P.steel} r={2} />
      <Box x={232} y={144} w={136} d={16} h={10} z={88} c={P.ink3} r={3} />
      <Slab x={240} y={148} w={120} d={3} z={98.5} bg={P.signal} />
      <Box x={290} y={158} w={20} d={14} h={14} z={74} c={P.paper} r={3}
        front={<div ref={lens} style={{ position: 'absolute', left: 6, top: 3, width: 8, height: 8, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%,#f8a07a,${P.signal} 55%,#7a2a0c)`, boxShadow: '0 0 6px rgba(242,84,26,.8)' }} />} />
      <Slab ref={laser} x={252} y={146} w={96} d={2} z={9.4} bg={P.signal} />

      {/* barrier */}
      <Box x={228} y={238} w={16} d={18} h={22} z={8} c={P.paper2} r={2} />
      <Group ref={arm} style={{ transform: 'translate3d(244px,248px,30px)' }}>
        <Box x={0} y={-3} w={112} d={6} h={5} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }} r={1}
          top={<div style={{ position: 'absolute', inset: 0, background: stripes }} />}
          front={<div style={{ position: 'absolute', inset: 0, background: stripes, opacity: 0.8 }} />} />
      </Group>
      <Box x={350} y={242} w={8} d={8} h={16} z={8} c={P.steelDark} r={2} />

      {/* kiosk with the live read-out */}
      <Box x={366} y={226} w={26} d={18} h={46} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: '5px 3px auto', height: 22, borderRadius: 2, background: '#0d0d0c', padding: '3px 3px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee', textAlign: 'center' }}>
            <span ref={plateEl} style={{ display: 'block', fontSize: 5, fontWeight: 700, lineHeight: 1.3 }}>--</span>
            <span ref={statEl} style={{ display: 'block', fontSize: 5.5, letterSpacing: '.1em', color: '#9a9a93', lineHeight: 1.5 }}>WAIT</span>
          </div>
        } />

      {/* parking-management desk, cabled to the gantry */}
      <Slab x={170} y={68} w={72} d={2} z={8.6} bg={P.steelDark} />
      <Slab x={240} y={68} w={2} d={80} z={8.6} bg={P.steelDark} />
      <Box x={48} y={42} w={124} d={46} h={18} z={8} c={P.steel} r={3} />
      <Box x={66} y={52} w={22} d={4} h={4} z={26} c={P.steelDark} />
      <Box x={60} y={44} w={92} d={5} h={36} z={26} c={P.ink3} r={2}
        front={
          <div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: '#0d0d0c', padding: '3px 5px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 5.5, letterSpacing: '.12em', opacity: 0.55 }}>ACCESS LOG</div>
            {[0, 1, 2].map((k) => (
              <div key={k} ref={(el) => { roll.current[k] = el; }} style={{ fontSize: 8, fontWeight: 700, lineHeight: 1.35, opacity: 1 - k * 0.3, color: k === 0 ? '#7fd3a2' : '#f2f2ee' }}>----</div>
            ))}
          </div>
        } />
      <Slab x={72} y={66} w={44} d={14} z={26.5} r={2} bg={P.paper} />

      {/* lamp posts */}
      <Box x={236} y={40} w={5} d={5} h={64} z={8} c={P.steelDark} />
      <Box x={230} y={38} w={17} d={9} h={4} z={72} c={P.paper} r={2} />
      <Box x={358} y={40} w={5} d={5} h={64} z={8} c={P.steelDark} />
      <Box x={352} y={38} w={17} d={9} h={4} z={72} c={P.paper} r={2} />

      <Car i={0} onScan={onScan} />
      <Car i={1} onScan={onScan} />

      <Bill x={300} y={152} z={112}><Chip tone="dark"><span style={{ color: P.signal }}>30</span> FPS</Chip></Bill>
      <Bill x={485} y={236} z={30}><Chip tone="light"><span style={{ color: P.signalDark }}>97.3%</span> accuracy</Chip></Bill>
      <Bill x={110} y={50} z={78}><Chip tone="dark"><span style={{ color: P.signal }}>85%</span> less manual oversight</Chip></Bill>
    </Stage>
  );
}
