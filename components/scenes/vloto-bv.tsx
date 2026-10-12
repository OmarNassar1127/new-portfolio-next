'use client';

/**
 * Vloto B.V.: a luxury car-sharing depot. A car laps the loop road; every time it
 * clears the Laravel API gate a data packet runs down the cable to the admin
 * dashboard (booking appears on the screen) and to the AI tower, where the
 * WhatsApp agent answers and the fraud check lights up.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, span, useFrame } from './kit';

const T = 10; // lap length (s)
const R = 30, X0 = 40, X1 = 400, Y0 = 200, Y1 = 320;
const GATE_X = 221;
const T_GATE = (GATE_X - (X0 + R)) / 90; // car speed is L / T ≈ 90 px/s
const STRAIGHT_H = X1 - X0 - 2 * R, STRAIGHT_V = Y1 - Y0 - 2 * R, ARC = (Math.PI / 2) * R;
const LOOP = 2 * (STRAIGHT_H + STRAIGHT_V) + 4 * ARC;

/** Position and heading (deg) of the car along the rounded-rectangle road. */
function onRoad(s0: number) {
  let s = ((s0 % LOOP) + LOOP) % LOOP;
  const arc = (cx: number, cy: number, start: number) => {
    const f = ((start + (s / R) * (180 / Math.PI)) * Math.PI) / 180;
    return { x: cx + R * Math.cos(f), y: cy + R * Math.sin(f), a: (f * 180) / Math.PI + 90 };
  };
  if (s < STRAIGHT_H) return { x: X0 + R + s, y: Y0, a: 0 };
  s -= STRAIGHT_H;
  if (s < ARC) return arc(X1 - R, Y0 + R, -90);
  s -= ARC;
  if (s < STRAIGHT_V) return { x: X1, y: Y0 + R + s, a: 90 };
  s -= STRAIGHT_V;
  if (s < ARC) return arc(X1 - R, Y1 - R, 0);
  s -= ARC;
  if (s < STRAIGHT_H) return { x: X1 - R - s, y: Y1, a: 180 };
  s -= STRAIGHT_H;
  if (s < ARC) return arc(X0 + R, Y1 - R, 90);
  s -= ARC;
  if (s < STRAIGHT_V) return { x: X0, y: Y1 - R - s, a: 270 };
  s -= STRAIGHT_V;
  return arc(X0 + R, Y0 + R, 180);
}

/** Walk a polyline at distance d. */
function along(pts: [number, number][], d: number) {
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const l = Math.hypot(bx - ax, by - ay);
    if (d <= l) return [ax + ((bx - ax) * d) / l, ay + ((by - ay) * d) / l] as const;
    d -= l;
  }
  const e = pts[pts.length - 1];
  return [e[0], e[1]] as const;
}
const plen = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

const PATH_ADMIN: [number, number][] = [[GATE_X, 168], [GATE_X, 128], [106, 128], [106, 106]];
const PATH_AI: [number, number][] = [[GATE_X, 168], [GATE_X, 128], [552, 128], [552, 86]];
const PKT_SPEED = 120;

function Car({ c, glass = '#1b1d20' }: { c: string; glass?: string }) {
  const body = { top: c, s: `color-mix(in oklab, ${c} 78%, black)`, w: `color-mix(in oklab, ${c} 88%, black)` };
  return (
    <>
      <Slab x={-26} y={-14} w={52} d={28} z={0.2} bg="rgba(0,0,0,.4)" r={9} />
      {[-17, 7].map((wx) => [-13, 9].map((wy) => (
        <Box key={`${wx}${wy}`} x={wx} y={wy} w={10} d={4} h={8} z={0} c="#0c0c0b" r={2} />
      )))}
      <Box x={-23} y={-11} w={46} d={22} h={7} z={3} c={body} r={3} />
      <Box x={-9} y={-9} w={22} d={18} h={7} z={10} c={{ top: c, s: glass, w: '#202327', n: glass, e: '#2a2d31' }} r={2} />
      <Slab x={14} y={-2} w={9} d={4} z={10.3} bg={P.signal} />
      <Box x={22} y={-9} w={2} d={5} h={2} z={6} c="#ffe9a8" />
      <Box x={22} y={4} w={2} d={5} h={2} z={6} c="#ffe9a8" />
      <Box x={-24} y={-9} w={2} d={5} h={2} z={6} c={P.signal} />
      <Box x={-24} y={4} w={2} d={5} h={2} z={6} c={P.signal} />
    </>
  );
}

const SCREEN = { position: 'absolute', inset: 3, borderRadius: 2, background: '#0d0d0c', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee', overflow: 'hidden' } as const;
const BOOKINGS = ['new booking', 'family sharing', 'coupon applied'];

function Depot() {
  const car = useRef<HTMLDivElement>(null);
  const laser = useRef<HTMLDivElement>(null);
  const p1 = useRef<HTMLDivElement>(null);
  const p2 = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  const line = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const typing = useRef<HTMLDivElement>(null);
  const led = useRef<HTMLDivElement>(null);
  const shown = useRef('');

  useFrame((t) => {
    const p = onRoad(((t % T) / T) * LOOP);
    car.current!.style.transform = `translate3d(${p.x}px,${p.y}px,8.5px) rotateZ(${p.a}deg)`;

    const lap = Math.floor((t - T_GATE) / T);
    const tg = t - T_GATE - lap * T; // seconds since the car cleared the gate
    laser.current!.style.opacity = String(0.3 + 0.7 * Math.max(0, 1 - tg / 0.6) + 0.06 * Math.sin(t * 9));

    const pk = (el: HTMLDivElement, path: [number, number][]) => {
      const d = (tg - 0.2) * PKT_SPEED;
      const on = d >= 0 && d <= plen(path);
      el.style.opacity = on ? '1' : '0';
      if (on) { const [x, y] = along(path, d); el.style.transform = `translate3d(${x - 3}px,${y - 3}px,10px)`; }
    };
    pk(p1.current!, PATH_ADMIN);
    pk(p2.current!, PATH_AI);

    // dashboard: booking line lands when the first packet arrives
    const key = tg > 1.5 ? BOOKINGS[((lap % 3) + 3) % 3] : shown.current || BOOKINGS[2];
    if (key !== shown.current) {
      shown.current = key;
      line.current!.textContent = key;
      dot.current!.style.background = P.green;
    }
    dot.current!.style.opacity = String(tg > 1.5 && tg < 4 ? 1 : 0.35);
    bars.current.forEach((b, i) => {
      if (b) b.style.height = `${50 + 40 * Math.sin(t * 0.9 + i * 1.3)}%`;
    });

    // AI tower: typing bubble, then fraud LED
    const a = ease(span(tg, 3.4, 3.9)) * (1 - ease(span(tg, 7.5, 8.5)));
    typing.current!.style.opacity = String(a);
    typing.current!.style.transform = `translateY(${(1 - a) * 8}px)`;
    led.current!.style.opacity = String(tg > 3.4 && tg < 6 ? 1 : 0.3);
  });

  const road = '#2a2a27';
  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* loop road */}
      <Slab x={18} y={178} w={404} d={164} z={8.4} bg={road} r={52} />
      <Slab x={40} y={200} w={360} d={120} z={8.6} bg="transparent" r={30}
        style={{ boxSizing: 'border-box', border: '2px dashed rgba(242,242,238,.22)' }} />
      <Box x={62} y={222} w={316} d={76} h={5} z={8} r={26} c={{ top: '#1b1b19', s: '#0c0c0b', w: '#121211' }} />
      {/* charging posts on the island */}
      {[130, 210, 290].map((x) => (
        <Group key={x}>
          <Box x={x} y={246} w={22} d={4} h={2} z={13} c={P.steelDark} />
          <Box x={x + 8} y={254} w={6} d={6} h={22} z={13} c={P.steel} r={2}
            front={<div style={{ position: 'absolute', left: 1, top: 3, width: 4, height: 3, background: P.green }} />} />
        </Group>
      ))}

      {/* parking bays */}
      <Slab x={446} y={192} w={176} d={134} z={8.4} bg="#232321" r={6}
        style={{ backgroundImage: 'repeating-linear-gradient(180deg,transparent 0 43px,rgba(242,242,238,.22) 43px 45px)' }} />
      <Group style={{ transform: 'translate3d(540px,216px,8.5px) rotateZ(180deg)' }}><Car c={P.steel} /></Group>
      <Group style={{ transform: 'translate3d(540px,304px,8.5px) rotateZ(180deg)' }}><Car c={P.signalDark} /></Group>
      <Box x={608} y={248} w={8} d={8} h={26} z={8} c={P.steel} r={2}
        front={<div style={{ position: 'absolute', left: 2, top: 4, width: 4, height: 3, background: P.green }} />} />

      {/* cables */}
      <Slab x={GATE_X - 1.5} y={128} w={3} d={42} z={8.6} bg={P.steelDark} />
      <Slab x={106 - 1.5} y={126.5} w={448} d={3} z={8.6} bg={P.steelDark} />
      <Slab x={106 - 1.5} y={106} w={3} d={22} z={8.6} bg={P.steelDark} />
      <Slab x={552 - 1.5} y={86} w={3} d={42} z={8.6} bg={P.steelDark} />
      <Box ref={p1} x={0} y={0} w={6} d={6} h={3} z={0} c={P.signal} style={{ opacity: 0 }} />
      <Box ref={p2} x={0} y={0} w={6} d={6} h={3} z={0} c={P.signal} style={{ opacity: 0 }} />

      {/* Laravel API gate */}
      <Box x={GATE_X - 7} y={170} w={14} d={10} h={50} z={8} c={P.steel} />
      <Box x={GATE_X - 7} y={220} w={14} d={10} h={50} z={8} c={P.steel} />
      <Box x={GATE_X - 10} y={166} w={20} d={68} h={10} z={58} c={P.signal} r={3} />
      <Box ref={laser} x={GATE_X - 1} y={180} w={2} d={40} h={48} z={9}
        c={{ top: 'transparent', s: 'rgba(242,84,26,.35)', w: 'linear-gradient(rgba(242,84,26,.65),rgba(242,84,26,.15))' }} />
      <Slab x={GATE_X - 5} y={180} w={10} d={40} z={8.8} bg="linear-gradient(90deg,transparent,rgba(242,84,26,.5),transparent)" />

      {/* admin dashboard desk */}
      <Box x={36} y={56} w={140} d={50} h={16} z={8} c={P.ink3} r={3} />
      <Box x={66} y={64} w={12} d={5} h={4} z={24} c={P.steelDark} />
      <Box x={134} y={64} w={12} d={5} h={4} z={24} c={P.steelDark} />
      <Box x={44} y={62} w={56} d={5} h={32} z={28} c={P.ink} r={2}
        front={
          <div style={SCREEN}>
            <div style={{ position: 'absolute', inset: '5px 5px 3px', display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} ref={(el) => { bars.current[i] = el; }} style={{ flex: 1, height: '50%', background: i === 3 ? P.signal : '#5b5b55', borderRadius: 1 }} />
              ))}
            </div>
          </div>
        } />
      <Box x={108} y={62} w={56} d={5} h={32} z={28} c={P.ink} r={2}
        front={
          <div style={{ ...SCREEN, padding: '4px 5px', fontSize: 6.5 }}>
            <div style={{ letterSpacing: '.12em', opacity: 0.55, fontSize: 5.5 }}>ADMIN</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
              <div ref={dot} style={{ width: 5, height: 5, borderRadius: 3, background: P.green, opacity: 0.35 }} />
              <span ref={line} style={{ fontWeight: 700 }}>coupon applied</span>
            </div>
            <div style={{ height: 2, background: '#2a2a27', marginTop: 4 }} />
            <div style={{ height: 2, background: '#2a2a27', marginTop: 3, width: '60%' }} />
          </div>
        } />
      <Box x={150} y={92} w={18} d={8} h={2} z={24} c={P.paper2} />

      {/* AI tower */}
      <Box x={520} y={36} w={64} d={48} h={40} z={8} c={P.ink3} r={3}
        front={
          <div style={{ position: 'absolute', inset: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 6, borderRadius: 2, background: '#1a1a18', position: 'relative' }}>
                <div style={{ position: 'absolute', right: 4, top: 2, width: 4, height: 2, background: i === 1 ? P.signal : '#5b5b55' }} />
              </div>
            ))}
          </div>
        } />
      <Box x={526} y={42} w={52} d={36} h={26} z={48} c={P.steel} r={3}
        front={
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <svg width={14} height={17} viewBox="0 0 14 17" style={{ maxWidth: 'none' }}>
              <path d="M7 1 L13 3.5 V8.5 C13 12.5 10.5 15 7 16 C3.5 15 1 12.5 1 8.5 V3.5 Z" fill={P.ink2} />
              <path d="M4 8.5 L6.3 10.8 L10.2 6" stroke={P.green} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div ref={led} style={{ width: 5, height: 5, borderRadius: 3, background: P.green, opacity: 0.3 }} />
          </div>
        } />
      <Box x={550} y={58} w={3} d={3} h={22} z={74} c={P.steelDark} />
      <Bill x={552} y={60} z={80}>
        <div ref={typing} style={{ opacity: 0, display: 'flex', gap: 3, padding: '5px 8px', borderRadius: 12, background: P.green }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#0f0f0e' }} />)}
        </div>
      </Bill>

      {/* the car */}
      <Group ref={car}>
        <Car c={P.paper} />
      </Group>

      {/* labels */}
      <Bill x={106} y={52} z={70}><Chip tone="dark">Admin dashboard</Chip></Bill>
      <Bill x={GATE_X} y={170} z={78}><Chip tone="signal">Laravel API</Chip></Bill>
      <Bill x={552} y={60} z={102}><Chip tone="light"><span style={{ color: P.green }}>●</span> WhatsApp agent</Chip></Bill>
      <Bill x={430} y={96} z={26}><Chip tone="dark">Fraud prevention</Chip></Bill>
    </>
  );
}

export default function VlotoScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={0.92} offset={[0, 4]} stillAt={5.4}
      label="An isometric car-sharing depot: a car laps a loop road and passes a Laravel API gate; data packets run to an admin dashboard and to an AI tower with a WhatsApp agent and a fraud check."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Depot />
    </Stage>
  );
}
