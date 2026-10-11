'use client';

import { useEffect, useRef } from 'react';

/** The agents that hop out of the laptop: real projects, each one a link. */
const AGENTS = [
  { name: 'WhatsApp agent', slug: 'whatsapp-ai-business-agent' },
  { name: 'RAG platform', slug: 'enterprise-rag-platform' },
  { name: 'Research agent', slug: 'autonomous-research-agent' },
  { name: 'Posture coach', slug: 'slouch-ai-posture-coach' },
  { name: 'Meeting assistant', slug: 'ai-meeting-assistant-voice-automation' },
];

/**
 * Omar at his laptop, building agents. three.js loads only once the stage is
 * near the viewport, the loop pauses offscreen, and reduced motion gets one
 * still frame with every agent in place.
 */
export default function OmarLab({ className = '' }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current;
    if (!stage || !canvas) return;
    let dispose: (() => void) | null = null, cancelled = false;

    const start = async () => {
      const [THREE, { createOmarLab }] = await Promise.all([import('three'), import('@/lib/omar-lab')]);
      if (cancelled) return;
      const lab = createOmarLab(THREE, canvas, {
        me: '/images/me2.png',
        meWave: '/images/me.png',
        agents: AGENTS,
        onLabels: (labels) => labels.forEach((l, i) => {
          const tag = tagRefs.current[i];
          if (!tag) return;
          const w = tag.offsetWidth, x = Math.max(4, Math.min(canvas.clientWidth - w - 4, l.x - w / 2));
          tag.style.opacity = String(l.alpha);
          tag.style.transform = `translate(${x}px, ${l.y}px)`;
          tag.tabIndex = l.alpha > 0.5 ? 0 : -1;
        }),
      });
      const fit = () => lab.size(canvas.clientWidth, canvas.clientHeight);
      fit();
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let frame = 0, visible = true, t0 = performance.now();
      const loop = (now: number) => { lab.renderAt((now - t0) / 1000); frame = visible ? requestAnimationFrame(loop) : 0; };
      if (still) setTimeout(() => lab.renderAt(4.6), 400);
      else frame = requestAnimationFrame(loop);
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !frame && !still) { t0 = performance.now() - 4600; frame = requestAnimationFrame(loop); }
      });
      io.observe(stage);
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        lab.pointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      };
      const onClick = () => lab.wave();
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('resize', fit);
      canvas.addEventListener('click', onClick);
      dispose = () => {
        cancelAnimationFrame(frame);
        io.disconnect();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('resize', fit);
        canvas.removeEventListener('click', onClick);
        lab.dispose();
      };
    };

    // Load three only when the stage is about to be seen.
    const gate = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      gate.disconnect();
      start();
    }, { rootMargin: '200px' });
    gate.observe(stage);
    return () => { cancelled = true; gate.disconnect(); dispose?.(); };
  }, []);

  return (
    <div ref={stageRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Omar's Memoji at his laptop; the agents he builds hop out of it"
        className="block size-full cursor-pointer touch-pan-y"
      />
      {AGENTS.map((a, i) => (
        <a
          key={a.slug}
          ref={(el) => { tagRefs.current[i] = el; }}
          href={`/projects/${a.slug}`}
          tabIndex={-1}
          style={{ opacity: 0 }}
          className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-hairline bg-surface px-2.5 py-1 font-mono text-[11px] text-ink transition-colors duration-150 hover:border-signal hover:text-signal-ink focus-visible:outline-2 focus-visible:outline-signal"
        >
          {a.name}
        </a>
      ))}
    </div>
  );
}
