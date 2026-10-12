'use client';

/**
 * Sliced Marketplace: a real-world asset (a house) rides a belt through a scanner,
 * a blade cuts it into slices, and each slice flies to a slot in the ledger rack
 * where it turns into a token and is filed into the database.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, clamp01, ease, lerp, span, useFrame } from './kit';

const T = 10; // loop length
const V = 64; // belt speed px/s
const HOLD_A = 3.4; // belt pauses under the blade
const HOLD_B = 4.8;
const N = 4;
const SW = 12; // slice width
const SLOT_X = 502;
const slotY = (k: number) => 84 + k * 56;

const lines = 'repeating-linear-gradient(180deg,transparent 0 5px,rgba(20,20,19,.2) 5px 6px)';

function houseFront(k: number) {
  return (
    <div style={{ marginLeft: -k * SW, width: 48, height: 26 }}>
      <svg width={48} height={26} viewBox="0 0 48 26" style={{ maxWidth: 'none', display: 'block' }}>
        <rect width="48" height="26" fill="#e9e8e1" />
        <rect y="22" width="48" height="4" fill="#cfcfc8" />
        <rect x="19" y="8" width="10" height="18" fill={P.ink3} />
        <rect x="26" y="16" width="1.6" height="1.6" fill={P.signal} />
        <rect x="5" y="7" width="9" height="8" fill={P.glass} />
        <rect x="34" y="7" width="9" height="8" fill={P.glass} />
        <path d="M9.5 7v8M5 11h9M38.5 7v8M34 11h9" stroke="#6f6f6a" strokeWidth=".8" />
      </svg>
    </div>
  );
}

const ax = (lt: number) => 30 + V * (Math.min(lt, HOLD_B) - clamp01((lt - HOLD_A) / (HOLD_B - HOLD_A)) * (HOLD_B - HOLD_A));

function Slice({ k, leds }: { k: number; leds: React.RefObject<(HTMLDivElement | null)[]> }) {
  const g = useRef<HTMLDivElement>(null);
  const tok = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    const lt = t % T;
    const spread = ease(span(lt, 4.5, 5.2));
    let x = ax(lt) + k * SW + spread * k * 9;
    let y = 154, z = 23;
    let show = true;
    const d0 = 5.4 + k * 0.25;
    const fly = ease(span(lt, d0, d0 + 1.5));
    if (fly > 0) {
      x = lerp(x, SLOT_X, fly);
      y = lerp(y, slotY(k) + 2, fly);
      z = lerp(23, 25, fly) + 34 * Math.sin(Math.PI * fly);
    }
    // arriving from above at the very start of the loop
    const drop = 1 - ease(span(lt, 0, 0.7));
    z += 34 * drop;
    const swap = 7.5 + k * 0.25;
    if (lt > swap) show = false;
    g.current!.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    g.current!.style.visibility = show ? 'visible' : 'hidden';

    // token: rises out of the slice, then is filed into the rack
    const born = ease(span(lt, swap, swap + 0.5));
    const filed = ease(span(lt, 9.2, 9.8));
    const tz = lerp(0, 9, born) * (1 - filed) - 12 * filed;
    tok.current!.style.transform = `translate3d(0,0,${tz}px)`;
    tok.current!.style.visibility = lt > swap && lt < 9.8 ? 'visible' : 'hidden';
    const led = leds.current?.[k];
    if (led) led.style.background = lt > swap && lt < 9.2 ? '#7fd3a2' : '#3a3a36';
  });

  return (
    <>
      <Group ref={g}>
        <Box x={0} y={0} w={SW} d={48} h={26} c={{ top: P.paper, s: P.paper2, w: '#cfcfc8' }} front={houseFront(k)} />
        <Box x={0} y={-2} w={SW} d={52} h={5} z={26} c={P.ink3} />
      </Group>
      <Group ref={tok} style={{ left: SLOT_X - 33 + 6, top: slotY(k) + 4, visibility: 'hidden' }}>
        <Box x={0} y={0} w={66} d={40} h={4} z={24.5} r={6} c={{ top: P.paper, s: P.steel, w: P.paper2 }}
          top={<div style={{ position: 'absolute', inset: 4, borderRadius: 4, background: `radial-gradient(circle at 20% 50%,${P.signal} 0 8px,transparent 9px),${lines}` }} />} />
      </Group>
    </>
  );
}

export default function SlicedMarketplaceScene({ project, className }: { project: Project; className?: string }) {
  const belt = useRef<HTMLDivElement>(null);
  const blade = useRef<HTMLDivElement>(null);
  const laser = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const leds = useRef<(HTMLDivElement | null)[]>([]);
  const last = useRef('');

  useFrame((t) => {
    const lt = t % T;
    const hold = clamp01((lt - HOLD_A) / (HOLD_B - HOLD_A)) * (HOLD_B - HOLD_A);
    belt.current!.style.backgroundPosition = `${(V * (lt - hold)) % 16}px 0`;
    const dz = -28 * (ease(span(lt, 3.6, 4.0)) - ease(span(lt, 4.3, 4.9)));
    blade.current!.style.transform = `translate3d(0,0,${dz}px)`;
    const scan = span(lt, 1.2, 2.6);
    laser.current!.style.opacity = String(0.3 + 0.5 * Math.sin(Math.PI * scan) + 0.05 * Math.sin(t * 9));
    const s = lt < 1.2 ? 'ASSET' : lt < 3.4 ? 'SCANNING' : lt < 7.4 ? 'SLICING' : 'MINTED';
    if (s !== last.current) { last.current = s; status.current!.textContent = s; }
    const pct = lt < 1.2 ? 0.05 : lt < 2.6 ? 0.05 + 0.3 * scan : lt < 5.4 ? 0.35 + 0.35 * span(lt, 3.4, 5.4) : 0.7 + 0.3 * span(lt, 5.4, 8.2);
    bar.current!.style.width = (lt > 9.4 ? 0 : pct * 100) + '%';
  });

  const beltBg = 'repeating-linear-gradient(90deg,#2a2a27 0 14px,#33332f 14px 16px)';
  const ledRow = (
    <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
      {[0, 1, 2, 3].map((k) => <div key={k} ref={(el) => { leds.current[k] = el; }} style={{ width: 10, height: 5, borderRadius: 1, background: '#3a3a36' }} />)}
    </div>
  );

  return (
    <Stage w={620} d={360} tone={project.cover.tone} className={className} zoom={0.92} offset={[0, -2]} stillAt={8.8}
      label="An isometric machine: a real-world house rides a belt through a scanner, a blade slices it, and each slice flies into a ledger rack where it becomes an NFT token filed into a database."
      subject={project.cover.subject} flow={project.cover.flow}>
      {/* base plate */}
      <Box x={0} y={0} w={620} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* belt */}
      <Box x={18} y={150} w={316} d={56} h={14} z={8} c={P.ink3} r={4} />
      <Slab ref={belt} x={24} y={154} w={304} d={48} z={22.5} bg={beltBg} r={3} />
      <Box x={12} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />
      <Box x={330} y={147} w={10} d={62} h={22} z={8} c={P.steelDark} r={5} />
      {[40, 150, 260].map((x) => <Box key={x} x={x} y={208} w={10} d={8} h={8} z={0.5} c={P.steelDark} />)}

      {/* scanner gate */}
      <Box x={130} y={138} w={12} d={10} h={66} z={8} c={P.steel} />
      <Box x={130} y={212} w={12} d={10} h={66} z={8} c={P.steel} />
      <Box x={126} y={134} w={20} d={92} h={10} z={74} c={P.paper2} r={3} />
      <Box x={134} y={150} w={4} d={56} h={14} z={74} c={P.steelDark} />
      <Box ref={laser} x={135} y={154} w={2} d={48} h={50} z={22.5}
        c={{ top: 'transparent', s: 'rgba(255,255,255,.35)', w: 'linear-gradient(rgba(255,255,255,.7),rgba(255,255,255,.15))' }} />
      <Slab x={131} y={154} w={10} d={48} z={23} bg="linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)" />

      {/* blade gantry */}
      <Box x={262} y={134} w={14} d={10} h={72} z={8} c={P.steel} />
      <Box x={262} y={216} w={14} d={10} h={72} z={8} c={P.steel} />
      <Box x={258} y={130} w={22} d={100} h={10} z={80} c={P.paper2} r={3} />
      <Group ref={blade}>
        <Box x={269} y={146} w={4} d={62} h={30} z={50} c={P.paper} />
        <Box x={269} y={146} w={4} d={62} h={4} z={50} c={P.signalDark} />
      </Group>

      {/* console */}
      <Box x={40} y={56} w={100} d={46} h={46} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, borderRadius: 3, background: '#0d0d0c', padding: '5px 7px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee' }}>
            <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>ASSET TO TOKEN</div>
            <span ref={status} style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>ASSET</span>
            <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 2 }}>
              <div ref={bar} style={{ height: 3, width: '5%', borderRadius: 2, background: P.signal }} />
            </div>
            {ledRow}
          </div>
        } />
      <Slab x={88} y={102} w={4} d={34} z={8.5} bg={P.steelDark} />
      <Slab x={88} y={136} w={46} d={4} z={8.5} bg={P.steelDark} />
      <Slab x={134} y={136} w={4} d={6} z={8.5} bg={P.steelDark} />
      <Slab x={150} y={72} w={118} d={4} z={8.5} bg={P.steelDark} />
      <Slab x={264} y={72} w={4} d={64} z={8.5} bg={P.steelDark} />

      {/* ledger rack with four slots */}
      <Box x={470} y={70} w={112} d={240} h={16} z={8} c={P.ink3} r={5} />
      {[0, 1, 2, 3].map((k) => (
        <Slab key={k} x={478} y={slotY(k)} w={96} d={48} z={24.5} r={4} bg="linear-gradient(160deg,#171715,#0f0f0e)" />
      ))}

      {/* database stack behind the rack */}
      {[0, 1, 2].map((i) => (
        <Box key={i} x={500} y={14} w={64} d={44} h={9} z={8 + i * 11} r={22} c={i % 2 ? P.steel : P.paper2} />
      ))}

      {/* the asset: four slices that start abutting */}
      {[0, 1, 2, 3].map((k) => <Slice key={k} k={k} leds={leds} />)}

      <Bill x={70} y={282} z={6}><Chip tone="light">real-world asset</Chip></Bill>
      <Bill x={430} y={318} z={14}><Chip tone="signal">NFT</Chip></Bill>
      <Bill x={532} y={34} z={50}><Chip tone="dark">MongoDB</Chip></Bill>
      <Bill x={130} y={50} z={64}><Chip tone="dark">team of four</Chip></Bill>
    </Stage>
  );
}
