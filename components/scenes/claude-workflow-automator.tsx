'use client';

/**
 * Claude Workflow Automator: a prompt factory. A cartridge from the pipeline
 * library feeds a prompt card onto a belt. The card is stamped at the Anthropic
 * API press, plugged into the MCP server rack, then printed into a finished
 * document at the artifact printer. Every delivered document lights one more
 * tile on the process board, the way pipelines went into business processes.
 */
import { useRef, type ReactNode } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 10; // loop per card
const GAP = T / 4; // cards are staggered
const V = 58; // belt speed px/s
const X0 = 22;
const BELT_Y = 170;
const CARD_Y = 179;

const xOf = (t: number, i: number) => {
  const lt = (t + i * GAP) % T;
  return { lt, x: Math.min(X0 + V * lt, 570) };
};

const INK_LINES = 'repeating-linear-gradient(180deg,transparent 0 4px,rgba(20,20,19,.2) 4px 5px)';

function Card({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const small = useRef<HTMLDivElement>(null);
  const doc = useRef<HTMLDivElement>(null);
  const stamp = useRef<HTMLDivElement>(null);
  const plug = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    const { lt, x } = xOf(t, i);
    let z = 21;
    if (lt > 9.3) z = lerp(21, 4, ease(span(lt, 9.3, 9.8)));
    if (lt > 9.8) z = -30;
    g.current!.style.transform = `translate3d(${x}px,${CARD_Y}px,${z}px)`;
    const printed = x >= 460;
    small.current!.style.visibility = printed ? 'hidden' : 'visible';
    doc.current!.style.visibility = printed ? 'visible' : 'hidden';
    stamp.current!.style.opacity = x >= 152 ? '1' : '0';
    plug.current!.style.opacity = x >= 340 ? '1' : '0';
  });

  return (
    <Group ref={g}>
      <div ref={small} style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
        <Box x={0} y={0} w={36} d={26} h={3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
          top={
            <div style={{ position: 'absolute', inset: '4px 5px', background: INK_LINES }}>
              <div ref={stamp} style={{ position: 'absolute', right: 0, top: 0, width: 9, height: 9, borderRadius: 2, background: P.signal, opacity: 0 }} />
              <div ref={plug} style={{ position: 'absolute', left: 0, bottom: 0, width: 8, height: 4, borderRadius: 1, background: P.green, opacity: 0 }} />
            </div>
          } />
      </div>
      <div ref={doc} style={{ position: 'absolute', transformStyle: 'preserve-3d', visibility: 'hidden' }}>
        <Box x={-4} y={-4} w={44} d={34} h={4} c={{ top: '#fbfbf8', s: '#cfcfc8', w: '#dcdcd5' }}
          top={
            <div style={{ position: 'absolute', inset: '4px 5px', background: `linear-gradient(90deg,${P.signal} 0 14px,transparent 14px) 0 0/100% 4px no-repeat,linear-gradient(90deg,#d6d6d0 0 14px,transparent 14px) 0 8px/100% 8px no-repeat,${INK_LINES}` }}>
              <div style={{ position: 'absolute', right: 0, bottom: 0, width: 12, height: 9, background: 'rgba(20,20,19,.22)' }} />
            </div>
          } />
      </div>
    </Group>
  );
}

function Machine() {
  const belt = useRef<HTMLDivElement>(null);
  const ram = useRef<HTMLDivElement>(null);
  const plugHead = useRef<HTMLDivElement>(null);
  const cable = useRef<HTMLDivElement>(null);
  const led = useRef<HTMLDivElement>(null);
  const rackLed = useRef<(HTMLDivElement | null)[]>([]);
  const lit = useRef<(HTMLDivElement | null)[]>([]);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    let press = 0, ext = 0, print = 0;
    for (let i = 0; i < 4; i++) {
      const { lt, x } = xOf(t, i);
      if (lt > 9.3) continue;
      press = Math.max(press, ease(1 - Math.abs(x - 152) / 22));
      ext = Math.max(ext, ease(span(x, 296, 336)) * (1 - ease(span(x, 350, 392))));
      print = Math.max(print, ease(1 - Math.abs(x - 462) / 40));
    }
    ram.current!.style.transform = `translate3d(0,0,${lerp(38, 24.5, press)}px)`;
    plugHead.current!.style.transform = `translate3d(0,${ext * 49}px,0)`;
    cable.current!.style.transform = `translateZ(32.5px) scaleY(${Math.max(0.02, ext * 49 / 56 + 0.02)})`;
    led.current!.style.opacity = String(0.25 + 0.75 * print);
    rackLed.current.forEach((l, k) => { if (l) l.style.opacity = String(0.35 + 0.65 * Math.max(0, Math.sin(t * 5 + k * 2.1))); });

    // the library cartridge that just fed the belt
    const e = Math.floor(t / GAP);
    const active = (e * 7) % 30;
    const pulse = Math.max(0, 1 - (t % GAP) / 1.4);
    lit.current.forEach((l, k) => { if (l) l.style.opacity = k === active ? String(pulse) : '0'; });

    // process board fills one tile per delivered document
    const n = (Math.floor((t + 0.6) / GAP) + 6) % 21;
    tiles.current.forEach((tl, k) => { if (tl) tl.style.background = k < n ? P.signal : '#3a3a35'; });
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const cartridges: ReactNode[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 10; c++) {
      const k = r * 10 + c;
      const h = [26, 18, 10][r];
      const y = [18, 36, 54][r];
      const x = 32 + c * 28;
      cartridges.push(
        <Box key={`c${k}`} x={x} y={y} w={22} d={16} h={h} z={14} c={r === 1 ? P.paper : P.paper2} r={2}
          front={<div style={{ position: 'absolute', left: 4, right: 4, top: 3, height: 2, background: c % 3 === 0 ? P.signalDark : P.steelDark, opacity: 0.8 }} />} />,
        <Slab key={`l${k}`} ref={(el) => { lit.current[k] = el; }} x={x} y={y} w={22} d={16} z={14 + h + 0.5} bg={P.signal} r={2} style={{ opacity: 0 }} />,
      );
    }
  }

  const boardTiles = Array.from({ length: 20 }, (_, k) => (
    <Slab key={k} ref={(el) => { tiles.current[k] = el; }} x={338 + (k % 10) * 25} y={270 + Math.floor(k / 10) * 24} w={19} d={18} z={14.5} bg="#3a3a35" r={2} style={{ transition: 'background .3s' }} />
  ));

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* pipeline library: three tiers of cartridges */}
      <Box x={24} y={10} w={296} d={70} h={6} z={8} c={P.ink3} r={4} />
      {cartridges}
      <Slab x={316} y={44} w={3} d={46} z={8.5} bg={P.steelDark} />

      {/* feed hopper with a stack of raw prompts */}
      <Box x={12} y={166} w={44} d={52} h={34} z={8} c={P.steel} r={3} />
      <Box x={18} y={176} w={32} d={32} h={3} z={42} c={P.paper} />
      <Box x={20} y={178} w={30} d={30} h={3} z={45} c={P.paper2} />
      <Box x={18} y={176} w={32} d={32} h={3} z={48} c={P.paper} />

      {/* belt */}
      <Box x={18} y={BELT_Y} w={526} d={44} h={12} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={176} w={514} d={32} z={20.5} bg={beltBg} r={3} />
      <Box x={18} y={BELT_Y} w={526} d={6} h={14} z={8} c={P.steelDark} />
      <Box x={18} y={208} w={526} d={6} h={14} z={8} c={P.steelDark} />

      {/* Anthropic API press */}
      <Box x={160} y={160} w={20} d={10} h={56} z={8} c={P.steel} r={2} />
      <Box x={160} y={216} w={20} d={10} h={56} z={8} c={P.steel} r={2} />
      <Box x={156} y={158} w={28} d={70} h={10} z={64} c={P.ink} r={3}
        top={<div style={{ position: 'absolute', inset: 4, background: `linear-gradient(90deg,${P.signal} 0 8px,transparent 8px)` }} />} />
      <Group ref={ram}>
        <Box x={162} y={184} w={16} d={16} h={8} c={P.signal} r={2} />
        <Box x={166} y={188} w={8} d={8} h={40} z={8} c={P.steel} />
      </Group>

      {/* MCP server rack */}
      <Box x={332} y={96} w={72} d={34} h={54} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 4, background: 'repeating-linear-gradient(180deg,#1a1a18 0 10px,#0d0d0c 10px 12px)', borderRadius: 2 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} ref={(el) => { rackLed.current[k] = el; }} style={{ position: 'absolute', right: 5, top: 4 + k * 12, width: 4, height: 4, borderRadius: 4, background: k === 1 ? P.signal : '#7fd3a2' }} />
            ))}
          </div>
        } />
      <Box x={356} y={128} w={12} d={4} h={8} z={20} c={P.ink} />
      <Slab ref={cable} x={360} y={134} w={3} d={56} z={32.5} bg={P.signal} style={{ transformOrigin: 'top', transform: 'translateZ(32.5px) scaleY(0.02)' }} />
      <Group ref={plugHead}>
        <Box x={354} y={136} w={16} d={14} h={8} z={24.5} c={P.paper} r={2} />
      </Group>
      <Slab x={346} y={150} w={32} d={3} z={8.5} bg={P.steelDark} />

      {/* artifact printer tunnel */}
      <Box x={448} y={160} w={58} d={8} h={42} z={8} c={P.steel} />
      <Box x={448} y={214} w={58} d={8} h={42} z={8} c={P.steel} />
      <Box x={446} y={158} w={62} d={66} h={8} z={50} c={P.ink} r={3}
        top={<div style={{ position: 'absolute', left: 8, right: 8, top: 8, height: 6, background: '#2a2a27', borderRadius: 2 }} />} />
      <Slab ref={led} x={458} y={166} w={38} d={5} z={58.5} bg={P.signal} r={2} />

      {/* finished-document bin */}
      <Box x={544} y={164} w={78} d={54} h={12} z={8} c={P.paper2} r={4} />
      <Slab x={566} y={176} w={50} d={32} z={20.5} bg={P.ink} r={3} />

      {/* process board: one tile per delivered document */}
      <Box x={326} y={262} w={268} d={62} h={6} z={8} c={P.ink3} r={4} />
      {boardTiles}

      {[0, 1, 2, 3].map((i) => <Card key={i} i={i} />)}

      <Bill x={172} y={10} z={48}><Chip tone="dark"><span style={{ color: P.signal }}>30+</span> pipelines</Chip></Bill>
      <Bill x={210} y={300} z={0}><Chip tone="light">Anthropic API</Chip></Bill>
      <Bill x={368} y={100} z={64}><Chip tone="signal">MCP servers</Chip></Bill>
      <Bill x={330} y={372} z={0}><Chip tone="dark"><span style={{ color: P.signal }}>20+</span> processes</Chip></Bill>
    </>
  );
}

export default function ClaudeWorkflowAutomatorScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.84} offset={[0, -2]} stillAt={5.2}
      label="An isometric prompt factory: a prompt card leaves a pipeline library, is stamped at the Anthropic API press, plugged into an MCP server rack, printed as a finished document, and lights one more tile on a business-process board."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Machine />
    </Stage>
  );
}
