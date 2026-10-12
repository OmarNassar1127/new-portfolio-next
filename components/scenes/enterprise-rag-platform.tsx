'use client';

/**
 * Enterprise RAG platform: PDFs drop from source bins onto a belt, get cut into
 * chunks by a gate and are filed into a shelf of vector cells (Qdrant). A
 * question then lights the nearest cells, the hits ride to an on-premise Llama 3
 * rack inside a fence, and the answer sheet comes out of its tray.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 11;
const V = 90; // belt speed px/s
const DOCS = 4;
const COLS = 6;
const ROWS = 4;
const HITS = [4, 9, 14, 19];
const BIN_X = [30, 80, 130, 180];
const SHEET = { top: P.paper, s: '#cfcfc8', w: '#dcdcd5' };
const DIM = '#3a3a35';
const lines = 'repeating-linear-gradient(180deg,transparent 0 4px,rgba(20,20,19,.18) 4px 5px)';
const BELT = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';

const x0Of = (i: number) => BIN_X[i] + 6;
const startOf = (i: number) => 0.2 + i * 0.8;
const arriveOf = (i: number) => startOf(i) + 0.7 + (346 - x0Of(i)) / V;

function Machine() {
  const belt = useRef<HTMLDivElement>(null);
  const docs = useRef<(HTMLDivElement | null)[]>([]);
  const docBody = useRef<(HTMLDivElement | null)[]>([]);
  const chunks = useRef<(HTMLDivElement | null)[]>([]);
  const cells = useRef<(HTMLDivElement | null)[]>([]);
  const glow = useRef<HTMLDivElement>(null);
  const token = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const answer = useRef<HTMLDivElement>(null);
  const answerChip = useRef<HTMLDivElement>(null);
  const leds = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((t) => {
    const tm = t % T;
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;

    // documents: drop from the bin, ride, get chunked at the gate
    for (let i = 0; i < DOCS; i++) {
      const u = tm - startOf(i);
      const g = docs.current[i]!;
      const x0 = x0Of(i);
      let x = x0, y = 82, z = 28, op = 1;
      if (u < 0) op = 0;
      else if (u < 0.7) {
        const k = ease(u / 0.7);
        y = lerp(82, 162, k); z = lerp(28, 21.5, k); op = Math.min(1, u / 0.25);
      } else {
        x = x0 + V * (u - 0.7); y = 162; z = 21.5;
      }
      const arrive = arriveOf(i);
      if (tm > arrive + 0.5) op = 0;
      else if (tm > arrive) op = 1 - (tm - arrive) / 0.5;
      g.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
      g.style.opacity = String(op);
      const chunked = x + 10 > 246;
      docBody.current[i]!.style.opacity = chunked ? '0' : '1';
      chunks.current[i]!.style.opacity = chunked ? '1' : '0';
    }

    // vector cells fill as chunks arrive, then light on retrieval
    const clear = 1 - span(tm, 10.2, 10.9);
    const q = ease(span(tm, 6.9, 7.3)) * (1 - ease(span(tm, 9.0, 9.6)));
    for (let k = 0; k < COLS * ROWS; k++) {
      const a = arriveOf(k % DOCS);
      const f = ease(span(tm, a, a + 0.5)) * clear;
      const hit = HITS.includes(k) ? q : 0;
      cells.current[k]!.style.background =
        `color-mix(in oklab, ${P.signal} ${hit * 100}%, color-mix(in oklab, ${P.paper} ${f * 100}%, ${DIM}))`;
    }

    // chunker glow flashes as documents pass
    let near = 0;
    for (let i = 0; i < DOCS; i++) near = Math.max(near, 1 - Math.min(1, Math.abs(tm - (arriveOf(i) - 1.2)) / 0.5));
    glow.current!.style.opacity = String(0.3 + 0.7 * near);

    // question token from the terminal to the shelf
    const tk = ease(span(tm, 6.0, 6.9));
    token.current!.style.transform = `translate3d(404px,${lerp(284, 222, tk)}px,16px)`;
    token.current!.style.opacity = String(span(tm, 5.9, 6.1) * (1 - span(tm, 6.9, 7.1)));

    // hits ride to the Llama rack
    const pk = ease(span(tm, 7.4, 8.2));
    pulse.current!.style.transform = `translate3d(${lerp(474, 504, pk)}px,168px,22px)`;
    pulse.current!.style.opacity = String(span(tm, 7.4, 7.5) * (1 - span(tm, 8.2, 8.3)));

    // racks blink while it thinks
    const busy = span(tm, 8.0, 8.4) * (1 - span(tm, 9.2, 9.6));
    leds.current.forEach((l, k) => {
      if (l) l.style.opacity = String(0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (4 + k) + k)) * (0.4 + 0.6 * busy));
    });

    // answer sheet slides out of the tray
    const ak = ease(span(tm, 8.4, 9.2));
    answer.current!.style.transform = `translate3d(${lerp(0, 0, ak)}px,${lerp(-6, 16, ak)}px,${lerp(0, 4, ak)}px)`;
    answer.current!.style.opacity = String(span(tm, 8.4, 8.6) * (1 - span(tm, 10.4, 10.9)));
    answerChip.current!.style.opacity = String(span(tm, 9.0, 9.4) * (1 - span(tm, 10.4, 10.9)));
  }, );

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* source bins with document stacks */}
      {BIN_X.map((bx, i) => (
        <Group key={bx}>
          <Box x={bx} y={44} w={36} d={36} h={16} z={8} c={i % 2 ? P.paper2 : P.steel} r={3}
            front={<div style={{ position: 'absolute', left: 6, right: 6, top: 5, height: 3, background: P.ink3, opacity: 0.5, borderRadius: 2 }} />} />
          <Box x={bx + 5} y={49} w={26} d={20} h={3} z={24} c={SHEET} />
          <Box x={bx + 7} y={51} w={26} d={20} h={3} z={27} c={SHEET}
            top={<div style={{ position: 'absolute', inset: '3px 4px', background: lines }} />} />
        </Group>
      ))}
      <Slab x={24} y={100} w={196} d={4} z={8.5} bg={P.steelDark} r={2} />

      {/* ingest belt */}
      <Box x={16} y={148} w={334} d={44} h={12} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={20} y={152} w={326} d={36} z={20.5} bg={BELT} r={3} />
      <Box x={10} y={146} w={10} d={48} h={18} z={8} c={P.steelDark} r={5} />

      {/* chunking gate */}
      <Box x={236} y={140} w={20} d={10} h={44} z={8} c={P.steel} />
      <Box x={236} y={190} w={20} d={10} h={44} z={8} c={P.steel} />
      <Box x={232} y={136} w={28} d={68} h={10} z={52} c={P.signal} r={3} />
      <Box ref={glow} x={244} y={152} w={4} d={36} h={30} z={21}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.4)', w: 'linear-gradient(rgba(242,84,26,.7),rgba(242,84,26,.15))' }} />

      {/* vector shelf (Qdrant) */}
      <Box x={350} y={124} w={124} d={96} h={10} z={8} c={P.ink3} r={4}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: 'linear-gradient(135deg,#34342f,#2a2a26)' }} />} />
      {Array.from({ length: COLS * ROWS }, (_, k) => {
        const cx = 360 + (k % COLS) * 19, cy = 132 + Math.floor(k / COLS) * 21;
        return (
          <Group key={k}>
            <Box x={cx} y={cy} w={15} d={16} h={5} z={18} c={P.ink} r={2} />
            <Slab ref={(el) => { cells.current[k] = el; }} x={cx + 1.5} y={cy + 1.5} w={12} d={13} z={23.5} r={2} bg={DIM} />
          </Group>
        );
      })}
      <Slab x={346} y={152} w={8} d={36} z={18.5} bg={P.steelDark} />

      {/* query terminal */}
      <Box x={372} y={262} w={72} d={30} h={30} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 5, borderRadius: 3, background: '#0d0d0c', padding: '5px 6px' }}>
            <div style={{ height: 3, width: '70%', background: P.paper, opacity: 0.8, borderRadius: 2 }} />
            <div style={{ height: 3, width: '45%', background: P.paper, opacity: 0.45, borderRadius: 2, marginTop: 4 }} />
            <div style={{ height: 3, width: '8px', background: P.signal, borderRadius: 2, marginTop: 4 }} />
          </div>
        } />
      <Slab x={400} y={232} w={8} d={30} z={8.5} bg={P.steelDark} r={2} />
      <Group ref={token}>
        <Box x={0} y={0} w={9} d={9} h={6} c={P.signal} r={2} />
      </Group>

      {/* on-premise fence */}
      <Slab x={486} y={96} w={140} d={178} z={8.5} r={8} bg="rgba(255,255,255,.04)"
        style={{ border: '2px dashed #6f6f6a', boxSizing: 'border-box' }} />
      {[[482, 92], [622, 92], [482, 270], [622, 270]].map(([px, py]) => (
        <Box key={`${px}-${py}`} x={px} y={py} w={8} d={8} h={20} z={8} c={P.steel} r={2} />
      ))}
      <Group ref={pulse}>
        <Box x={0} y={0} w={8} d={8} h={6} c={P.signal} r={2} />
      </Group>

      {/* Llama 3 racks */}
      {[0, 1, 2].map((k) => (
        <Box key={k} x={510 + k * 36} y={116} w={30} d={44} h={58} z={8} c={P.ink} r={3}
          front={
            <div style={{ position: 'absolute', inset: 4, borderRadius: 2, background: '#1b1b19' }}>
              {[0, 1, 2, 3].map((r) => (
                <div key={r} style={{ position: 'absolute', left: 3, right: 3, top: 4 + r * 11, height: 7, background: '#2e2e2a', borderRadius: 1 }}>
                  <div ref={(el) => { leds.current[k * 4 + r] = el; }}
                    style={{ position: 'absolute', right: 2, top: 2, width: 3, height: 3, borderRadius: 2, background: r === 0 ? P.signal : '#7fd3a2' }} />
                </div>
              ))}
            </div>
          } />
      ))}

      {/* answer tray */}
      <Box x={524} y={190} w={80} d={44} h={5} z={8} c={P.steel} r={3} />
      <Group ref={answer} style={{ opacity: 0 }}>
        <Box x={540} y={198} w={44} d={30} h={3} z={13.5} c={SHEET}
          top={<div style={{ position: 'absolute', inset: '5px 6px', background: `linear-gradient(90deg,${P.signal} 0 10px,transparent 10px) 0 0/100% 4px no-repeat,${lines}` }} />} />
      </Group>
      <Bill x={560} y={252} z={12} ref={answerChip} style={{ opacity: 0 }}><Chip tone="light"><span style={{ color: P.signalDark }}>95%</span> retrieval accuracy</Chip></Bill>

      {/* ingest documents */}
      {Array.from({ length: DOCS }, (_, i) => (
        <Group key={i} ref={(el) => { docs.current[i] = el; }}>
          <div ref={(el) => { docBody.current[i] = el; }} style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
            <Box x={0} y={0} w={22} d={16} h={3} c={SHEET}
              top={<div style={{ position: 'absolute', inset: '3px', background: `linear-gradient(90deg,${P.signal} 0 5px,transparent 5px) 0 0/100% 3px no-repeat,${lines}` }} />} />
          </div>
          <div ref={(el) => { chunks.current[i] = el; }} style={{ position: 'absolute', transformStyle: 'preserve-3d', opacity: 0 }}>
            {[0, 1, 2].map((k) => <Box key={k} x={12 - k * 11} y={4} w={8} d={8} h={3} c={SHEET} />)}
          </div>
        </Group>
      ))}

      {/* labels */}
      <Bill x={105} y={40} z={48}><Chip tone="dark">10k+ PDFs</Chip></Bill>
      <Bill x={412} y={124} z={40}><Chip tone="light">Qdrant</Chip></Bill>
      <Bill x={558} y={100} z={80}><Chip tone="signal">Llama 3 on-prem · &lt;1 s</Chip></Bill>
    </>
  );
}

export default function EnterpriseRagScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.9} offset={[0, -2]} stillAt={9.3}
      label="An isometric knowledge archive: PDFs from source bins ride a belt through a chunking gate into a shelf of vector cells; a question lights the nearest cells and an on-premise Llama 3 rack, inside a fence, prints the answer."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Machine />
    </Stage>
  );
}
