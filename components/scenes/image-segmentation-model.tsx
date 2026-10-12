'use client';

/**
 * Image segmentation: raw photos ride a belt from the dataset stack, pass under a
 * U-shaped Keras network (encoder blocks down, decoder blocks up) and leave as
 * flat colour masks, one class colour per region, into the output tray.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, span, useFrame } from './kit';

const T = 10; // loop length per photo
const V = 62; // belt speed px/s
const N = 4;
const GATE = 290; // x of the scanner gate
const CARS = [2, 12, 6, 14]; // car x offset per photo

const SKY = '#b9c7d6';
const ROAD = '#55554f';
const CAR = '#c9682f';
const TREE = '#5f9a6d';

/** One photo: realistic-ish layer under, flat class-colour mask on top. */
function Photo({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const cx = CARS[i];

  useFrame((t) => {
    const lt = (t + i * (T / N)) % T;
    const x = -24 + V * lt;
    let fade = 1;
    if (x > 560) fade = Math.max(0, 1 - (x - 560) / 40);
    if (lt < 0.5) fade = lt / 0.5;
    g.current!.style.transform = `translate3d(${x}px,163px,23px)`;
    g.current!.style.opacity = String(fade);
    mask.current!.style.opacity = String(ease(span(x, GATE - 8, GATE + 40)));
  });

  const layers = (c: { sky: string; road: string; car: string; tree: string }, flat: boolean) => (
    <>
      <div style={{ position: 'absolute', inset: 0, background: c.sky }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: c.road }} />
      <div style={{ position: 'absolute', left: 3, top: '14%', width: 11, height: '44%', borderRadius: flat ? 2 : 5, background: c.tree }} />
      <div style={{ position: 'absolute', left: cx + 12, bottom: '14%', width: 22, height: 11, borderRadius: flat ? 2 : 3, background: c.car }} />
    </>
  );

  return (
    <Group ref={g}>
      <Box x={0} y={0} w={56} d={38} h={3} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
        top={
          <div style={{ position: 'absolute', inset: 3, overflow: 'hidden' }}>
            {layers({ sky: SKY, road: ROAD, car: CAR, tree: TREE }, false)}
            <div ref={mask} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
              {layers({ sky: P.steel, road: P.ink, car: P.signal, tree: P.green }, true)}
            </div>
          </div>
        } />
    </Group>
  );
}

export default function ImageSegmentationScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((t) => {
    belt.current!.style.backgroundPosition = `${(t * V) % 16}px 0`;
    scan.current!.style.opacity = String(0.55 + 0.25 * Math.sin(t * 5));
    // a pulse of activation runs through the network blocks left to right
    blocks.current.forEach((b, k) => {
      if (!b) return;
      const p = Math.max(0, 1 - Math.abs(((t * 1.6) % 4.5) - k * 0.55) * 1.6);
      b.style.opacity = String(0.25 + 0.75 * p);
    });
  });

  const beltBg = 'repeating-linear-gradient(90deg,#d4d4ce 0 14px,#c4c4bd 14px 16px)';
  // U-net: encoder shrinks, bottleneck, decoder grows
  const H = [40, 30, 20, 12, 20, 30, 40];

  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.0} offset={[0, -1]}
      label="An isometric production line: raw photos leave a dataset stack, pass under a U-shaped Keras network and come out as flat colour segmentation masks."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.paper2, s: '#a9a9a3', w: '#bdbdb7' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* belt */}
      <Box x={18} y={150} w={604} d={56} h={14} z={8} c={P.steelDark} r={4} />
      <Slab ref={belt} x={24} y={154} w={592} d={48} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={147} w={10} d={62} h={22} z={8} c={P.ink3} r={5} />
      <Box x={618} y={147} w={10} d={62} h={22} z={8} c={P.ink3} r={5} />

      {/* dataset stack feeding the belt */}
      <Box x={30} y={60} w={56} d={42} h={6} z={8} c={P.ink3} r={3} />
      {[0, 1, 2, 3, 4].map((k) => (
        <Box key={k} x={36 + (k % 2) * 2} y={64 + (k % 3)} w={44} d={30} h={3} z={14 + k * 3.2} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
          top={k === 4 ? (
            <div style={{ position: 'absolute', inset: 3, overflow: 'hidden', background: SKY }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: ROAD }} />
              <div style={{ position: 'absolute', left: 3, top: '14%', width: 9, height: '44%', borderRadius: 5, background: TREE }} />
              <div style={{ position: 'absolute', left: 22, bottom: '14%', width: 18, height: 9, borderRadius: 3, background: CAR }} />
            </div>
          ) : undefined} />
      ))}
      <Slab x={52} y={106} w={8} d={44} z={8.5} bg={P.steelDark} />

      {/* U-shaped network behind the gate */}
      <Box x={170} y={36} w={176} d={40} h={8} z={8} c={P.ink3} r={4} />
      {H.map((h, k) => (
        <Box key={k} ref={(el) => { blocks.current[k] = el; }} x={180 + k * 23} y={44 + (40 - 30) / 2 - (h > 25 ? 3 : 0)} w={14} d={h > 25 ? 24 : 18} h={h + 8} z={16} c={k < 3 ? P.steel : k === 3 ? P.signal : P.ink} r={2} />
      ))}
      {/* skip connections */}
      <Slab x={187} y={52} w={22} d={2} z={16.5} bg={P.signal} />
      <Slab x={302} y={52} w={22} d={2} z={16.5} bg={P.signal} />
      {/* cable from the network down to the gate */}
      <Slab x={316} y={76} w={3} d={58} z={8.5} bg={P.ink3} />

      {/* scanner gate */}
      <Box x={GATE - 6} y={134} w={14} d={12} h={74} z={8} c={P.steel} />
      <Box x={GATE - 6} y={210} w={14} d={12} h={74} z={8} c={P.steel} />
      <Box x={GATE - 10} y={130} w={22} d={96} h={12} z={82} c={P.ink} r={3} />
      <Box ref={scan} x={GATE} y={152} w={2} d={52} h={58} z={22}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.65),rgba(242,84,26,.15))' }} />
      <Slab x={GATE - 4} y={154} w={10} d={48} z={23} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.55),transparent)" />

      {/* output tray with a finished mask */}
      <Box x={560} y={70} w={62} d={50} h={14} z={8} c={P.ink3} r={4} />
      <Box x={566} y={76} w={50} d={36} h={3} z={22} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }}
        top={
          <div style={{ position: 'absolute', inset: 3, overflow: 'hidden', background: P.steel }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: P.ink }} />
            <div style={{ position: 'absolute', left: 3, top: '14%', width: 9, height: '44%', borderRadius: 2, background: P.green }} />
            <div style={{ position: 'absolute', left: 22, bottom: '14%', width: 18, height: 9, borderRadius: 2, background: P.signal }} />
          </div>
        } />

      {Array.from({ length: N }, (_, i) => <Photo key={i} i={i} />)}

      <Bill x={58} y={68} z={44}><Chip tone="dark">Dataset</Chip></Bill>
      <Bill x={258} y={50} z={64}><Chip tone="signal">Keras</Chip></Bill>
      <Bill x={591} y={90} z={36}><Chip tone="dark">Masks</Chip></Bill>
    </Stage>
  );
}
