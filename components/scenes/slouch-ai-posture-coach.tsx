'use client';

/**
 * Slouch: a desk worker is watched by a webcam. A tracker skeleton rides on the
 * torso; when the lean crosses the calibrated line and stays there past the
 * delay bar, the speaker rings once and the worker sits back up. The server
 * rack behind is unplugged on purpose: everything runs in the browser.
 */
import { useRef } from 'react';
import type { Project } from '@/data/projects';
import { Bill, Box, Chip, Group, P, Slab, Stage, ease, span, useFrame } from './kit';

const T = 10;
const SKIN = '#d9b99b';
const SHIRT = '#2e2e2a';
const GLOW = 'rgba(242,84,26,.55)';

function pill(on: boolean) {
  return {
    padding: '1px 4px', borderRadius: 3, fontSize: 6.5, letterSpacing: '.04em',
    background: on ? P.signal : 'transparent', color: on ? '#0f0f0e' : '#9a9a93',
    border: on ? 'none' : '1px solid #3a3a36',
  } as const;
}

function Machine() {
  const torso = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cone = useRef<HTMLDivElement>(null);
  const rings = useRef<(HTMLDivElement | null)[]>([]);
  const nudge = useRef<HTMLDivElement>(null);
  const state = useRef<HTMLSpanElement>(null);
  const barTilt = useRef<HTMLDivElement>(null);
  const barDelay = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLDivElement | null)[]>([]);
  const lastBad = useRef(false);

  useFrame((t) => {
    const lt = t % T;
    const k = ease(span(lt, 2, 4.6)) * (1 - ease(span(lt, 7.5, 8.9)));
    const bad = k > 0.5;
    torso.current!.style.transform = `rotateY(${22 * k}deg)`;
    head.current!.style.transform = `rotateY(${16 * k}deg)`;

    ring.current!.style.borderColor = bad ? P.signal : P.green;
    ring.current!.style.background = bad ? 'rgba(242,84,26,.12)' : 'rgba(63,166,107,.1)';
    dots.current.forEach((d) => { if (d) d.style.background = bad ? P.signal : P.green; });
    cone.current!.style.opacity = String(0.5 + 0.3 * Math.sin(t * 3));

    const delay = lt > 4.6 && lt < 7.5 ? span(lt, 4.6, 7) : 0;
    barDelay.current!.style.width = delay * 100 + '%';
    barTilt.current!.style.width = 12 + k * 78 + '%';
    barTilt.current!.style.background = bad ? P.signal : P.green;
    if (lastBad.current !== bad) {
      lastBad.current = bad;
      state.current!.textContent = bad ? 'SLOUCH' : 'GOOD';
      state.current!.style.color = bad ? P.signal : '#7fd3a2';
    }

    rings.current.forEach((r, i) => {
      if (!r) return;
      const p = span(lt, 7 + i * 0.28, 8.3 + i * 0.28);
      r.style.opacity = p > 0 && p < 1 ? String((1 - p) * 0.9) : '0';
      r.style.transform = `translateZ(63px) scale(${0.25 + p * 0.85})`;
    });
    nudge.current!.style.opacity = lt > 7 && lt < 8.6 ? '1' : '0';
  });

  const stroke = 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px) 0 0/24px 24px';
  return (
    <>
      {/* base plate */}
      <Box x={0} y={0} w={600} d={360} h={8} r={18} c={{ top: '#d9d9d3', s: '#9d9d97', w: '#b4b4ae' }}
        top={<div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: stroke.replace(/255,255,255/g, '0,0,0') }} />} />
      {/* posture status ring */}
      <Slab ref={ring} x={176} y={112} w={126} d={126} z={8.6} r={63} bg="transparent" style={{ border: `3px solid ${P.green}` }} />

      {/* webcam field of view */}
      <Slab ref={cone} x={214} y={118} w={142} d={114} z={8.8}
        bg={`linear-gradient(270deg,${GLOW},transparent)`} style={{ clipPath: 'polygon(100% 50%,0 0,0 100%)' }} />

      {/* chair */}
      <Box x={222} y={170} w={6} d={8} h={26} z={8} c={P.steelDark} />
      <Box x={196} y={172} w={80} d={5} h={4} z={8} c={P.steelDark} r={2} />
      <Box x={234} y={136} w={5} d={80} h={4} z={8} c={P.steelDark} r={2} />
      <Box x={204} y={140} w={72} d={70} h={8} z={34} c={P.ink3} r={5} />
      <Box x={202} y={142} w={9} d={66} h={64} z={42} c={P.ink3} r={5} />

      {/* legs, feet */}
      <Box x={224} y={154} w={76} d={17} h={14} z={42} c="#3a3a35" r={4} />
      <Box x={224} y={179} w={76} d={17} h={14} z={42} c="#3a3a35" r={4} />
      <Box x={286} y={154} w={13} d={17} h={34} z={14} c="#3a3a35" r={3} />
      <Box x={286} y={179} w={13} d={17} h={34} z={14} c="#3a3a35" r={3} />
      <Box x={284} y={152} w={30} d={19} h={6} z={8} c={P.ink} r={3} />
      <Box x={284} y={177} w={30} d={19} h={6} z={8} c={P.ink} r={3} />

      {/* forearms resting on the keyboard (static) */}
      <Box x={236} y={145} w={70} d={8} h={7} z={66} c={SHIRT} r={3} />
      <Box x={236} y={197} w={70} d={8} h={7} z={66} c={SHIRT} r={3} />
      <Box x={304} y={145} w={14} d={8} h={5} z={66} c={SKIN} r={2} />
      <Box x={304} y={197} w={14} d={8} h={5} z={66} c={SKIN} r={2} />

      {/* torso, skeleton and head lean together about the hips */}
      <Group ref={torso} style={{ transformOrigin: '234px 175px 58px' }}>
        <Box x={220} y={152} w={30} d={46} h={56} z={58} c={SHIRT} r={5} />
        <Box x={228} y={141} w={9} d={9} h={38} z={76} c={SHIRT} r={3} />
        <Box x={228} y={200} w={9} d={9} h={38} z={76} c={SHIRT} r={3} />
        {/* tracker skeleton: spine, shoulder line, hip line */}
        <Box x={217} y={174} w={3} d={3} h={52} z={60} c={P.paper} />
        <Box x={217} y={152} w={3} d={46} h={2} z={110} c={P.paper} />
        <Box x={217} y={152} w={3} d={46} h={2} z={62} c={P.paper} />
        {[[152, 110], [195, 110], [152, 62], [195, 62], [174, 86]].map(([y, z], i) => (
          <Box key={i} ref={(el) => { dots.current[i] = el; }} x={215} y={y - 2} w={7} d={7} h={7} z={z - 3} r={3.5} c={P.green} />
        ))}
        <Box x={233} y={171} w={8} d={8} h={7} z={114} c={SKIN} />
        <Group ref={head} style={{ transformOrigin: '234px 175px 114px' }}>
          <Box x={224} y={162} w={26} d={26} h={26} z={120} c={SKIN} r={11} />
          <Box x={222} y={161} w={16} d={28} h={14} z={133} c={P.ink} r={8} />
        </Group>
      </Group>

      {/* desk */}
      {[[304, 124], [440, 124], [304, 220], [440, 220]].map(([x, y], i) => (
        <Box key={i} x={x} y={y} w={7} d={7} h={48} z={8} c={P.steelDark} />
      ))}
      <Box x={300} y={120} w={152} d={114} h={6} z={56} c={P.paper} r={4} />

      {/* keyboard, monitor, webcam */}
      <Box x={320} y={148} w={24} d={46} h={3} z={62} c={P.ink3} r={2} />
      <Box x={352} y={160} w={22} d={26} h={2} z={62} c={P.steel} r={2} />
      <Box x={358} y={168} w={7} d={12} h={12} z={64} c={P.steelDark} />
      <Box x={354} y={128} w={8} d={86} h={54} z={76} c={{ top: P.ink, s: P.ink, w: `radial-gradient(circle at 50% 38%,${GLOW} 0 6%,transparent 7%),linear-gradient(90deg,transparent 46%,rgba(255,255,255,.2) 46% 48%,transparent 48%) 0 0/100% 100%,linear-gradient(180deg,#26302c,#101513)` }} r={3} style={{ pointerEvents: 'none' }} />
      <Box x={356} y={165} w={9} d={14} h={8} z={130} c={P.steel} r={2}
        front={<div style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, marginLeft: -2.5, marginTop: -2.5, borderRadius: 3, background: P.signal }} />} />

      {/* speaker */}
      <Box x={410} y={140} w={26} d={26} h={30} z={62} c={P.ink3} r={5}
        front={<div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'radial-gradient(circle,#0d0d0c 0 22%,#3a3a35 24% 100%)' }} />} />
      {[0, 1, 2].map((i) => (
        <Slab key={i} ref={(el) => { rings.current[i] = el; }} x={393} y={123} w={60} d={60} z={0} r={30} bg="transparent"
          style={{ border: `2px solid ${P.signal}`, opacity: 0 }} />
      ))}

      {/* unplugged server rack: nothing leaves the browser */}
      <Box x={480} y={36} w={66} d={50} h={88} z={8} c={P.ink3} r={4}
        front={
          <div style={{ position: 'absolute', inset: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, background: '#1a1a18', borderRadius: 2, display: 'flex', alignItems: 'center', padding: '0 4px', gap: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: '#3a3a35' }} />
                <div style={{ flex: 1, height: 2, background: '#2a2a27' }} />
              </div>
            ))}
          </div>
        } />
      <Slab x={486} y={92} w={3} d={30} z={8.6} bg={P.ink} r={1} />
      <Slab x={366} y={224} w={86} d={3} z={8.6} bg={P.ink} r={1} />
      <Box x={455} y={221} w={12} d={9} h={6} z={8} c={P.steel} r={2} />

      {/* live readout console */}
      <Box x={392} y={256} w={150} d={30} h={40} z={8} c={P.ink3} r={4}
        front={
          <div style={{ position: 'absolute', inset: 4, borderRadius: 3, background: '#0d0d0c', padding: '4px 7px', fontFamily: 'ui-monospace,monospace', color: '#f2f2ee', display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 7, letterSpacing: '.12em', opacity: 0.6 }}>POSTURE <span ref={state} style={{ color: '#7fd3a2' }}>GOOD</span></div>
              <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 4 }}><div ref={barTilt} style={{ height: 3, width: '12%', borderRadius: 2, background: P.green }} /></div>
              <div style={{ fontSize: 6, opacity: 0.5, marginTop: 3 }}>DELAY</div>
              <div style={{ height: 3, background: '#2a2a27', borderRadius: 2, marginTop: 1 }}><div ref={barDelay} style={{ height: 3, width: '0%', borderRadius: 2, background: P.steel }} /></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
              <span style={pill(false)}>Easy</span><span style={pill(true)}>Medium</span><span style={pill(false)}>Hard</span>
            </div>
          </div>
        } />

      <Bill x={120} y={66} z={20}><Chip tone="dark"><span style={{ color: P.signal }}>100%</span> in the browser</Chip></Bill>
      <Bill x={358} y={170} z={146}><Chip tone="light">MediaPipe Pose</Chip></Bill>
      <Bill x={513} y={60} z={100}><Chip tone="dark">no server</Chip></Bill>
      <Bill ref={nudge} x={423} y={153} z={100} style={{ opacity: 0, transition: 'opacity .25s' }}><Chip tone="signal">nudge</Chip></Bill>
    </>
  );
}

export default function SlouchScene({ project, className }: { project: Project; className?: string }) {
  return (
    <Stage w={600} d={360} tone={project.cover.tone} className={className} zoom={0.97} offset={[0, 8]} stillAt={6.4}
      label="An isometric desk: a webcam watches a worker whose posture skeleton turns orange as they slouch; a speaker rings once and they sit back up. A server rack stands unplugged because everything runs in the browser."
      subject={project.cover.subject} flow={project.cover.flow}>
      <Machine />
    </Stage>
  );
}
