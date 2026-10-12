'use client';

/**
 * AI Customer Support: a front desk that never closes. Visitors walk up (a voice
 * caller, a chat, a meeting request), the desk answers, and the request rides an
 * automation rail. Only the meeting request reaches the calendar and books a slot.
 * A day/night strip underneath keeps running: 24/7.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, lerp, span, useFrame } from './kit';

const T = 12; // loop
const GAP = 4; // seconds between visitors
const KINDS = ['voice', 'chat', 'meeting'] as const;
const WALK_Y = 250;
const STOP_X = 262;

// automation rail waypoints (floor px) and cumulative distances
const PATH: [number, number][] = [[410, 176], [440, 176], [440, 112], [570, 112], [570, 160]];
const SEG = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
const TOTAL = SEG.reduce((a, b) => a + b, 0);
const NODE_X = [470, 520, 570];
const NODE_D = [124, 174, 224];
const MID = NODE_D[1]; // answered requests stop at the OpenAI node

function at(dist: number): [number, number] {
  let d = dist;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i]) {
      const k = SEG[i] ? d / SEG[i] : 0;
      return [lerp(PATH[i][0], PATH[i + 1][0], k), lerp(PATH[i][1], PATH[i + 1][1], k)];
    }
    d -= SEG[i];
  }
  return PATH[PATH.length - 1];
}

const lt = (t: number, i: number) => (((t - i * GAP) % T) + T) % T;

function BubbleIcon({ kind, tone }: { kind: (typeof KINDS)[number]; tone: 'paper' | 'ink' }) {
  const fg = tone === 'paper' ? P.ink : P.paper;
  return (
    <svg width={30} height={18} viewBox="0 0 30 18" style={{ maxWidth: 'none', display: 'block' }}>
      {kind === 'voice' && [4, 9, 14, 19, 24].map((x, i) => {
        const h = [4, 10, 14, 8, 5][i];
        return <rect key={x} x={x - 1.5} y={9 - h / 2} width={3} height={h} rx={1.5} fill={fg} />;
      })}
      {kind === 'chat' && [9, 15, 21].map((x) => <circle key={x} cx={x} cy={9} r={2.4} fill={fg} />)}
      {kind === 'meeting' && (
        <g fill="none" stroke={fg} strokeWidth={1.6} strokeLinecap="round">
          <rect x={9} y={3.5} width={12} height={11} rx={2} />
          <path d="M9 7.5h12M12.5 2v3M17.5 2v3" />
        </g>
      )}
    </svg>
  );
}

function Visitor({ i }: { i: number }) {
  const g = useRef<HTMLDivElement>(null);
  const ask = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const kind = KINDS[i];

  useFrame((t) => {
    const l = lt(t, i);
    const x = lerp(30, STOP_X, ease(span(l, 0, 1.3))) + 40 * ease(span(l, 3.7, 4.6));
    const y = WALK_Y + 80 * ease(span(l, 3.7, 4.6));
    const o = l > 4.6 ? 0 : Math.min(span(l, 0, 0.4), 1 - span(l, 3.9, 4.6));
    g.current!.style.transform = `translate3d(${x}px,${y}px,0)`;
    body.current!.style.opacity = String(o);
    shadow.current!.style.opacity = String(o);
    ask.current!.style.opacity = String(ease(span(l, 1.3, 1.6)) * (1 - ease(span(l, 2.4, 2.7))));
  });

  return (
    <Group ref={g}>
      <Slab ref={shadow} x={-10} y={-5} w={20} d={10} z={8.6} r={9} bg="rgba(0,0,0,.35)" />
      <Bill x={0} y={0} z={9} ref={body}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div ref={ask} style={{ opacity: 0, marginBottom: 3, background: P.paper, borderRadius: 9, padding: '4px 7px', boxShadow: '0 6px 12px -6px rgba(0,0,0,.5)' }}>
            <BubbleIcon kind={kind} tone="paper" />
          </div>
          <svg width={28} height={51} viewBox="0 0 22 40" style={{ maxWidth: 'none', display: 'block' }}>
            <circle cx={11} cy={7} r={6} fill={P.paper} />
            <path d="M2 38c0-11 2-21 9-21s9 10 9 21z" fill={P.paper2} />
            <path d="M2 38c0-11 2-21 9-21v21z" fill={P.steel} opacity={0.35} />
          </svg>
        </div>
      </Bill>
    </Group>
  );
}

function Desk() {
  const reply = useRef<(HTMLDivElement | null)[]>([]);
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  const rings = useRef<(HTMLDivElement | null)[]>([]);
  const packet = useRef<HTMLDivElement>(null);
  const lamps = useRef<(HTMLDivElement | null)[]>([]);
  const cell = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const led = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    // find who is being served
    let active = -1, al = 0;
    for (let i = 0; i < 3; i++) {
      const l = lt(t, i);
      if (l >= 1.3 && l < 4.6) { active = i; al = l; }
    }
    // reply bubbles
    reply.current.forEach((r, i) => {
      if (!r) return;
      const l = lt(t, i);
      r.style.opacity = String(ease(span(l, 2.5, 2.8)) * (1 - ease(span(l, 3.8, 4.1))));
    });
    // monitor text lines type out while the desk answers
    const typing = active >= 0 ? span(al, 1.6, 3.2) : 0;
    lines.current.forEach((ln, k) => {
      if (ln) ln.style.width = `${Math.max(0, Math.min(1, typing * 3 - k * 0.8)) * 100}%`;
    });
    led.current!.style.opacity = String(active >= 0 && al < 3.4 ? 0.6 + 0.4 * Math.sin(t * 10) : 0.25);
    // voice rings from the speaker for voice + meeting replies
    const speaking = active >= 0 && active !== 1 && al >= 2.4 && al < 3.8;
    rings.current.forEach((r, k) => {
      if (!r) return;
      const ph = ((t * 1.1 + k / 2) % 1);
      r.style.opacity = speaking ? String(0.75 * (1 - ph)) : '0';
      r.style.transform = `scale(${0.4 + ph * 1.6})`;
    });
    // automation packet
    let dist = -1;
    if (active >= 0 && al >= 2.5) {
      const end = active === 2 ? TOTAL : MID;
      dist = end * ease(span(al, 2.5, 4.5));
    }
    if (dist >= 0) {
      const [px, py] = at(dist);
      const fade = active === 2 ? 1 : 1 - span(al, 4.2, 4.6);
      packet.current!.style.transform = `translate3d(${px - 5}px,${py - 5}px,12px)`;
      packet.current!.style.opacity = String(fade);
    } else packet.current!.style.opacity = '0';
    lamps.current.forEach((lp, k) => {
      if (lp) lp.style.opacity = String(dist < 0 ? 0 : Math.max(0, 1 - Math.abs(dist - NODE_D[k]) / 26));
    });
    // calendar slot books for the meeting request and stays until the loop ends
    const l2 = lt(t, 2);
    cell.current!.style.opacity = String(ease(span(l2, 4.5, 4.9)) * (1 - ease(span(l2, 11, 11.9))));
    // day / night strip
    marker.current!.style.transform = `translate3d(${(((t % T) / T) * 196)}px,0,0)`;
  });

  const grid = 'linear-gradient(rgba(20,20,19,.18) 1px,transparent 1px) 0 0/100% 14px,linear-gradient(90deg,rgba(20,20,19,.18) 1px,transparent 1px) 0 0/16px 100%';
  const ink = { top: P.ink3, s: '#161614', w: '#1c1c1a' };
  const line = (k: number, w: string) => (
    <div style={{ height: 3, borderRadius: 2, background: 'rgba(242,242,238,.18)', marginTop: k ? 3 : 0, width: w }}>
      <div ref={(el) => { lines.current[k] = el; }} style={{ height: 3, borderRadius: 2, background: P.paper, width: 0 }} />
    </div>
  );

  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={640} d={360} h={8} r={18} c={{ top: P.ink2, s: '#0c0c0b', w: '#121211' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px' }} />} />

      {/* day / night strip: the desk never closes */}
      <Box x={40} y={50} w={220} d={22} h={6} z={8} c={ink} r={3}
        top={<div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: `repeating-linear-gradient(90deg,transparent 0 7.9px,rgba(255,255,255,.18) 7.9px 8.9px),linear-gradient(90deg,${P.paper2} 0 28%,#5b5b55 40%,#0c0c0b 55% 72%,#5b5b55 84%,${P.paper2} 100%)` }} />} />
      <Group ref={marker}>
        <Box x={42} y={46} w={8} d={30} h={12} z={8} c={P.signal} r={2} />
      </Group>
      <Box x={36} y={46} w={4} d={30} h={4} z={8} c={P.steelDark} />
      <Box x={260} y={46} w={4} d={30} h={4} z={8} c={P.steelDark} />

      {/* walkway */}
      <Slab x={14} y={226} w={330} d={52} z={8.5} r={6} bg="linear-gradient(180deg,#1b1b19,#252522)" />
      <Slab x={22} y={251} w={314} d={2} z={8.7} bg="repeating-linear-gradient(90deg,rgba(242,242,238,.28) 0 12px,transparent 12px 24px)" />

      {/* reception desk */}
      <Box x={290} y={150} w={130} d={56} h={26} z={8} c={ink} r={3}
        front={<div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: P.signal }} />} />
      <Box x={286} y={146} w={138} d={64} h={4} z={34} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }} r={3} />
      {/* monitor */}
      <Box x={326} y={158} w={52} d={5} h={30} z={38.5} c={ink} r={2}
        front={
          <div style={{ position: 'absolute', inset: 3, borderRadius: 2, background: '#0d0d0c', padding: '4px 5px', display: 'flex', gap: 5 }}>
            <div style={{ width: 11, height: 11, borderRadius: 6, background: P.paper, flex: 'none', position: 'relative' }}>
              <div ref={led} style={{ position: 'absolute', right: -1, bottom: -1, width: 4, height: 4, borderRadius: 2, background: P.green }} />
            </div>
            <div style={{ flex: 1, paddingTop: 2 }}>{line(0, '100%')}{line(1, '80%')}{line(2, '55%')}</div>
          </div>
        } />
      <Box x={348} y={160} w={8} d={6} h={6} z={34.5} c={P.steelDark} />
      {/* headset on its stand */}
      <Box x={300} y={176} w={6} d={6} h={14} z={38.5} c={P.steel} r={3} />
      <Box x={296} y={174} w={4} d={10} h={7} z={50} c={P.paper} r={2} />
      <Box x={306} y={174} w={4} d={10} h={7} z={50} c={P.paper} r={2} />
      <Slab x={298} y={177} w={10} d={3} z={56.5} bg={P.paper2} r={2} />
      {/* speaker puck with rings */}
      <Box x={388} y={174} w={22} d={22} h={8} z={38.5} c={P.steelDark} r={11} />
      <Slab x={392} y={178} w={14} d={14} z={46.7} r={7} bg={P.ink} />
      {[0, 1].map((k) => (
        <Slab key={k} ref={(el) => { rings.current[k] = el; }} x={389} y={175} w={20} d={20} z={47.2} r={10}
          style={{ border: `2px solid ${P.paper}`, opacity: 0, boxSizing: 'border-box' }} bg="transparent" />
      ))}

      {/* reply bubbles above the desk */}
      {KINDS.map((k, i) => (
        <Bill key={k} x={352} y={178} z={84}>
          <div ref={(el) => { reply.current[i] = el; }} style={{ opacity: 0, background: P.ink, borderRadius: 9, padding: '4px 7px', boxShadow: '0 6px 12px -6px rgba(0,0,0,.6)', position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)' }}>
            <BubbleIcon kind={k} tone="ink" />
          </div>
        </Bill>
      ))}

      {/* automation rail */}
      <Slab x={410} y={175} w={31} d={3} z={8.6} bg={P.steel} />
      <Slab x={439} y={111} w={3} d={66} z={8.6} bg={P.steel} />
      <Slab x={440} y={111} w={132} d={3} z={8.6} bg={P.steel} />
      <Slab x={569} y={112} w={3} d={50} z={8.6} bg={P.steel} />
      {NODE_X.map((nx, k) => (
        <Box key={nx} x={nx - 15} y={99} w={30} d={26} h={16} z={8} c={ink} r={4}
          top={
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: k === 1 ? 6 : 3, border: `2px solid ${P.paper}`, boxSizing: 'border-box' }} />
            </div>
          } />
      ))}
      {NODE_X.map((nx, k) => (
        <Slab key={nx} ref={(el) => { lamps.current[k] = el; }} x={nx - 15} y={99} w={30} d={26} z={24.5} r={4}
          bg="rgba(242,84,26,.85)" style={{ opacity: 0 }} />
      ))}
      <Slab x={440} y={104} w={0} d={0} z={0} bg="transparent" />
      <Group ref={packet} style={{ opacity: 0 }}>
        <Box x={0} y={0} w={10} d={10} h={6} c={P.signal} r={2} />
      </Group>

      {/* calendar board */}
      <Box x={540} y={156} w={84} d={56} h={8} z={8} c={{ top: P.paper, s: '#cfcfc8', w: '#dcdcd5' }} r={4}
        top={<div style={{ position: 'absolute', inset: 5, background: grid }} />} />
      <Slab ref={cell} x={576} y={170} w={16} d={14} z={16.5} bg={P.signal} />
      <Slab x={545} y={160} w={74} d={8} z={16.4} bg={P.ink} r={2} />

      {KINDS.map((_, i) => <Visitor key={i} i={i} />)}

      {/* labels */}
      <Bill x={352} y={150} z={96}><Chip tone="dark">OpenAI</Chip></Bill>
      <Bill x={412} y={236} z={52}><Chip tone="light">ElevenLabs</Chip></Bill>
      <Bill x={520} y={96} z={34}><Chip tone="signal">n8n</Chip></Bill>
      <Bill x={150} y={36} z={14}><Chip tone="dark">24/7</Chip></Bill>
    </>
  );
}

export default function AiCustomerSupportScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={640} d={360} tone={project.cover.tone} className={className} zoom={1.12} offset={[0, -3]} stillAt={4.4}
      label="An isometric front desk: a voice caller, a chat and a meeting request walk up, the AI desk answers, requests ride an automation rail, and the meeting request books a calendar slot while a day and night strip keeps running."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Desk />
    </Stage>
  );
}
