'use client';

/**
 * Outlook Agenda AI: a mail-sorting desk. Envelopes ride a belt through a
 * GPT-4 reader, come out as meeting blocks and fly onto a week board. One of
 * them aims at a taken slot, the board flags the conflict and it slides to a
 * free one, then the attendee pegs light up (reminders).
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 9; // loop per item
const V = 40; // belt speed px/s
const BX = 306, BY = 78, CW = 62, RH = 56; // board grid origin and cell pitch
const cell = (c: number, r: number): [number, number] => [BX + c * CW + 28, BY + r * RH + 24];

const ITEMS = [
  { to: cell(1, 1), via: null as null | [number, number] },
  { to: cell(2, 2), via: cell(2, 0) }, // aims at a taken slot first
  { to: cell(4, 2), via: null as null | [number, number] },
];
const TAKEN: [number, number][] = [[0, 0], [2, 0], [3, 0], [4, 0], [1, 3], [3, 2]];

const flap =
  'linear-gradient(to bottom right,transparent 48%,rgba(20,20,19,.22) 49% 52%,transparent 53%) 0 0/50% 55% no-repeat,' +
  'linear-gradient(to bottom left,transparent 48%,rgba(20,20,19,.22) 49% 52%,transparent 53%) 100% 0/50% 55% no-repeat';

function Item({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const env = useRef<HTMLDivElement>(null);
  const blk = useRef<HTMLDivElement>(null);
  const warn = useRef<HTMLDivElement>(null);
  const peg = useRef<HTMLDivElement>(null);
  const { to, via } = ITEMS[i];
  const first = via ?? to;
  const land = via ? 6.4 : 4.6;

  useFrame((t) => {
    const lt = (t + i * (T / 3)) % T;
    let x = 40, y = 167, z = 24, e = 1, b = 0, w = 0, fade = 1;
    if (lt < 2.6) {
      x = lerp(40, 190, ease(span(lt, 0, 2.6)) * 0.6 + span(lt, 0, 2.6) * 0.4);
      e = span(lt, 0, 0.4);
    } else if (lt < 3.2) {
      x = 190 + span(lt, 2.6, 3.2) * 10;
      e = 1 - ease(span(lt, 2.8, 3.2));
      b = ease(span(lt, 2.8, 3.2));
    } else {
      b = 1; e = 0;
      const k = ease(span(lt, 3.2, 4.6));
      x = lerp(200, first[0], k);
      y = lerp(167, first[1], k);
      z = lerp(24, 26.5, k) + 30 * Math.sin(Math.PI * k);
      if (via && lt > 4.6) {
        const s = ease(span(lt, 5.4, 6.4));
        x = lerp(first[0], to[0], s) + (lt < 5.4 ? Math.sin(lt * 40) * 1.5 : 0);
        y = lerp(first[1], to[1], s);
        z = 26.5 + 6 * Math.sin(Math.PI * s);
        w = span(lt, 4.6, 4.8) * (1 - span(lt, 5.4, 5.7));
      }
    }
    if (lt > 8.2) fade = 1 - span(lt, 8.2, 9);
    g.current!.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    g.current!.style.opacity = String(fade);
    env.current!.style.opacity = String(e);
    blk.current!.style.opacity = String(b);
    warn.current!.style.opacity = String(w);
    const lit = lt > land && lt < 8.6;
    peg.current!.style.background = lit ? P.signal : '#3a3a35';
  });

  const lines = 'repeating-linear-gradient(180deg,transparent 0 6px,rgba(20,20,19,.25) 6px 7px)';
  return (
    <>
      <Group ref={g}>
        <div ref={env} style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
          <Box x={-18} y={-13} w={36} d={26} h={3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
            top={<div style={{ position: 'absolute', inset: 0, background: flap }} />} />
        </div>
        <div ref={blk} style={{ position: 'absolute', transformStyle: 'preserve-3d', opacity: 0 }}>
          <Box x={-27} y={-23} w={54} d={46} h={6} r={2} c={{ top: P.signal, s: P.signalDark, w: '#d9490f' }}
            top={<div style={{ position: 'absolute', inset: '6px 7px', background: `linear-gradient(90deg,rgba(255,255,255,.85) 0 22px,transparent 22px) 0 0/100% 4px no-repeat,${lines}` }} />} />
        </div>
        <div ref={warn} style={{ position: 'absolute', transformStyle: 'preserve-3d', opacity: 0 }}>
          <Bill x={0} y={0} z={20}><Chip tone="dark"><span style={{ color: P.signal }}>conflict</span> rebook</Chip></Bill>
        </div>
      </Group>
      {/* attendee peg: lights up once the slot is booked (reminder sent) */}
      <Box x={BX + 40 + i * 80} y={326} w={14} d={14} h={14} z={8} c={P.ink3} r={7} />
      <Slab ref={peg} x={BX + 43 + i * 80} y={329} w={8} d={8} z={22.5} r={4} bg="#3a3a35" />
    </>
  );
}

export default function OutlookAgendaScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    beam.current!.style.opacity = String(0.55 + 0.35 * Math.sin(t * 7));
    pulse.current!.style.transform = `translate3d(${((t * 70) % 120)}px,0,0)`;
    dots.current.forEach((d, k) => { if (d) d.style.opacity = String(0.35 + 0.65 * Math.max(0, Math.sin(t * 3 - k * 0.9))); });
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#34342f 14px 16px)';
  const gridTop = (
    <div style={{ position: 'absolute', inset: 0, background:
      `linear-gradient(rgba(20,20,19,.14) 1px,transparent 1px) 10px 42px/${CW}px ${RH}px,` +
      `linear-gradient(90deg,rgba(20,20,19,.14) 1px,transparent 1px) 10px 42px/${CW}px ${RH}px` }}>
      {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d, k) => (
        <span key={d} style={{ position: 'absolute', left: 10 + k * CW + 6, top: 14, fontFamily: 'ui-monospace,monospace', fontSize: 9, letterSpacing: '.12em', color: '#141413', opacity: 0.55 }}>{d}</span>
      ))}
    </div>
  );

  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.9} offset={[0, -2]} stillAt={5.2}
      label="An isometric mail-sorting desk: inbox envelopes ride a belt through a GPT-4 reader, turn into meeting blocks and land on a week calendar board; a clashing block is flagged and rebooked into a free slot."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* inbox tray with a stack of envelopes */}
      <Box x={14} y={132} w={46} d={70} h={12} z={8} c={P.steelDark} r={3} />
      <Box x={18} y={136} w={38} d={62} h={9} z={11} c={P.ink} r={2} />
      {[0, 1, 2, 3, 4].map((k) => (
        <Box key={k} x={19 + (k % 2)} y={140 + k * 2} w={36} d={26} h={3} z={20 + k * 3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
          top={<div style={{ position: 'absolute', inset: 0, background: flap }} />} />
      ))}

      {/* belt */}
      <Box x={60} y={150} w={190} d={34} h={10} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={64} y={153} w={182} d={28} z={18.5} bg={beltBg} r={3} />
      <Box x={54} y={147} w={8} d={40} h={16} z={8} c={P.steel} r={4} />
      <Box x={246} y={147} w={8} d={40} h={16} z={8} c={P.steel} r={4} />
      {[80, 150, 220].map((x) => <Box key={x} x={x} y={186} w={8} d={8} h={8} z={0} c={P.steelDark} />)}

      {/* GPT-4 reader gate */}
      <Box x={176} y={132} w={14} d={14} h={62} z={8} c={P.steel} />
      <Box x={176} y={190} w={14} d={14} h={62} z={8} c={P.steel} />
      <Box x={162} y={128} w={38} d={82} h={18} z={70} c={P.ink} r={3}
        front={<div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'ui-monospace,monospace', fontSize: 9, letterSpacing: '.12em', color: '#f2f2ee' }}>GPT-4</div>} />
      <Box x={176} y={146} w={14} d={44} h={6} z={72} c={P.glass} r={2} />
      <Slab ref={beam} x={178} y={152} w={10} d={28} z={19} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.75),transparent)" />

      {/* data cable from reader to board */}
      <Slab x={196} y={163} w={102} d={8} z={8.5} r={4} bg={P.ink3}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 4 }}>
          <div ref={pulse} style={{ position: 'absolute', left: -20, top: 2, width: 18, height: 4, borderRadius: 2, background: P.signal }} />
        </div>
      </Slab>

      {/* week board */}
      <Box x={296} y={36} w={334} d={274} h={6} z={20} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }} r={4} top={gridTop} />
      {TAKEN.map(([c, r]) => (
        <Box key={`${c}${r}`} x={BX + c * CW + 1} y={BY + r * RH + 1} w={54} d={46} h={4} z={26} r={2} c={P.ink3}
          top={<div style={{ position: 'absolute', inset: '6px 7px', background: 'linear-gradient(90deg,rgba(255,255,255,.35) 0 16px,transparent 16px) 0 0/100% 4px no-repeat' }} />} />
      ))}

      {/* attendee pegs (lit by the items) sit under the board */}
      <Slab x={BX + 20} y={322} w={200} d={22} z={8.5} r={11} bg="rgba(255,255,255,.05)" />

      {ITEMS.map((_, i) => <Item key={i} i={i} />)}

      {/* status dots on the reader */}
      {[0, 1, 2].map((k) => (
        <Slab key={k} ref={(el) => { dots.current[k] = el; }} x={174 + k * 9} y={116} w={6} d={6} z={8.5} r={3} bg={P.signal} />
      ))}

      <Bill x={37} y={110} z={30}><Chip tone="dark">Outlook inbox</Chip></Bill>
      <Bill x={183} y={150} z={102}><Chip tone="light">Microsoft Graph</Chip></Bill>
      <Bill x={460} y={22} z={20}><Chip tone="dark"><span style={{ color: P.signal }}>90%</span> of complex scheduling</Chip></Bill>
    </Stage>
  );
}
