'use client';

/**
 * CSS-3D isometric kit for the project case-study scenes.
 * One floor plane tilted by the camera; solids are six-face boxes, labels are
 * billboards that undo the camera so they face the viewer. No WebGL, so the
 * scene is crisp at any size and cheap on phones.
 *
 * World units: px on the floor. x right, y down (toward the viewer), z up.
 */
import {
  Children,
  createContext,
  isValidElement,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import type { CoverTone } from '@/data/projects';
import { cn } from '@/lib/utils';

export const RX = 58;
export const RZ = -38;
/** Undo the camera so a child faces the viewer. */
export const BILLBOARD = `rotateZ(${-RZ}deg) rotateX(${-RX}deg)`;

/** Palette shared by every scene, matched to the site tokens. */
export const P = {
  signal: '#f2541a',
  signalDark: '#c2410c',
  ink: '#141413',
  ink2: '#22221f',
  ink3: '#2e2e2a',
  paper: '#f2f2ee',
  paper2: '#e4e4df',
  steel: '#9a9a93',
  steelDark: '#6f6f6a',
  glass: '#b9c7d6',
  green: '#3fa66b',
};

export type Shade = { top: string; s: string; w: string; n?: string; e?: string };
/** Four-tone shading from one base colour: lit top, darker faces by facing. */
export function shade(c: string, k = 1): Shade {
  return {
    top: c,
    s: `color-mix(in oklab, ${c} ${100 - 22 * k}%, black)`,
    w: `color-mix(in oklab, ${c} ${100 - 12 * k}%, black)`,
  };
}

const F: CSSProperties = { position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' };

type BoxProps = {
  x: number; y: number; w: number; d: number; h: number; z?: number;
  c: Shade | string; r?: number;
  /** extra paint on the south (front) face, e.g. a screen or label */
  front?: ReactNode;
  top?: ReactNode;
  style?: CSSProperties; className?: string;
};
/** A solid box standing on the floor at (x,y). */
export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  { x, y, w, d, h, z = 0, c, r = 0, front, top, style, className }, ref,
) {
  const s = typeof c === 'string' ? shade(c) : c;
  return (
    <div ref={ref} className={className} style={{ ...F, left: x, top: y, width: w, height: d, transform: `translateZ(${z}px)`, ...style }}>
      <div style={{ ...F, width: w, height: d, transform: `translateZ(${h}px)`, background: s.top, borderRadius: r }}>{top}</div>
      {/* front face stands up from the south edge and faces the viewer, so content reads upright */}
      <div style={{ ...F, top: d - h, width: w, height: h, transformOrigin: 'bottom', transform: 'rotateX(-90deg)', background: s.s, overflow: 'hidden' }}>
        {front}
      </div>
      <div style={{ ...F, width: w, height: h, transformOrigin: 'top', transform: 'rotateX(90deg)', background: s.n ?? s.s }} />
      <div style={{ ...F, width: h, height: d, transformOrigin: 'left', transform: 'rotateY(-90deg)', background: s.w }} />
      <div style={{ ...F, left: w, width: h, height: d, transformOrigin: 'left', transform: 'rotateY(-90deg)', background: s.e ?? s.w }} />
    </div>
  );
});

/** A flat painted area lying on the floor (or lifted by z). */
export const Slab = forwardRef<HTMLDivElement, { x: number; y: number; w: number; d: number; z?: number; bg: string; r?: number; style?: CSSProperties; children?: ReactNode; className?: string }>(
  function Slab({ x, y, w, d, z = 0, bg, r = 0, style, children, className }, ref) {
    return (
      <div ref={ref} className={className} style={{ ...F, left: x, top: y, width: w, height: d, background: bg, borderRadius: r, transform: `translateZ(${z}px)`, ...style }}>
        {children}
      </div>
    );
  },
);

/** A group that can be moved as one (set style.transform from an animation). */
export const Group = forwardRef<HTMLDivElement, { children: ReactNode; style?: CSSProperties }>(function Group({ children, style }, ref) {
  return <div ref={ref} style={{ ...F, ...style }}>{children}</div>;
});

/** A label or icon standing at (x,y,z) and always facing the viewer. */
/** True when a Chip sits anywhere in this subtree. */
function hasChip(node: ReactNode): boolean {
  let found = false;
  Children.forEach(node, (c) => {
    if (found || !isValidElement(c)) return;
    if (c.type === Chip) found = true;
    else found = hasChip((c.props as { children?: ReactNode }).children);
  });
  return found;
}

/**
 * Labels (anything holding a Chip) are pulled toward the camera so they always
 * draw on top: never sliced by the floor, never hidden behind a part.
 * Icons, people and trees keep their true depth.
 */
const LABEL_LIFT = 220;

export const Bill = forwardRef<HTMLDivElement, { x: number; y: number; z?: number; children: ReactNode; style?: CSSProperties; front?: boolean }>(
  function Bill({ x, y, z = 0, children, style, front }, ref) {
    const lift = front ?? hasChip(children) ? LABEL_LIFT : 0;
    return (
      <div style={{ ...F, left: x, top: y, width: 0, height: 0, transform: `translateZ(${z}px)` }}>
        <div ref={ref} style={{ position: 'absolute', left: 0, bottom: 0, width: 'max-content', transformOrigin: '50% 100%', transform: `${BILLBOARD} translateZ(${lift}px) translateX(-50%)`, ...style }}>
          {children}
        </div>
      </div>
    );
  },
);

/** Small mono chip used for in-scene labels. */
export function Chip({ children, tone = 'light', className }: { children: ReactNode; tone?: 'light' | 'dark' | 'signal'; className?: string }) {
  const t = {
    light: 'bg-[#f7f7f4] text-[#141413] border-black/10',
    dark: 'bg-[#1c1c1a] text-[#f2f2ee] border-white/15',
    signal: 'bg-[#f2541a] text-[#0f0f0e] border-black/10',
  }[tone];
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none shadow-[0_8px_18px_-8px_rgba(0,0,0,.45)]', t, className)}>
      {children}
    </span>
  );
}

// ---------- time ----------
type Clock = { subscribe: (fn: (t: number) => void) => () => void; still: boolean };
const ClockCtx = createContext<Clock | null>(null);

/** Run fn(t seconds) every frame while the scene is on screen. Reduced motion: one frame at `stillAt`. */
export function useFrame(fn: (t: number) => void) {
  const clock = useContext(ClockCtx);
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => clock?.subscribe((t) => ref.current(t)), [clock]);
}

// Scenes sit straight on the page (no tone card behind them), so the caption
// uses the page ink for every tone.
/** Run fn every frame from inside a Stage (use when the scene's top level holds the refs). */
export function OnFrame({ fn }: { fn: (t: number) => void }) {
  useFrame(fn);
  return null;
}

const TONES: Record<CoverTone, { bg: string; text: string; chip: string }> = {
  ink: { bg: 'bg-transparent', text: 'text-ink', chip: 'border-hairline-strong text-body' },
  signal: { bg: 'bg-transparent', text: 'text-ink', chip: 'border-hairline-strong text-body' },
  paper: { bg: 'bg-transparent', text: 'text-ink', chip: 'border-hairline-strong text-body' },
};
/** Overall scene size inside its frame. */
const SCENE_SCALE = 0.85;

type StageProps = {
  /** floor size in world px */
  w: number; d: number;
  tone: CoverTone;
  label: string;
  flow?: string[];
  subject?: string;
  /** time (s) of the frame shown under reduced motion */
  stillAt?: number;
  /** extra zoom on top of the fit */
  zoom?: number;
  /** shift the floor on screen, in % of the frame */
  offset?: [number, number];
  floorStyle?: CSSProperties;
  overlay?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * The frame: fits the floor into the card, tilts it with the camera, adds a
 * little pointer parallax, pauses when off screen, and goes still under
 * reduced motion. The cover's subject and flow stay as a caption.
 */
export function Stage({ w, d, tone, label, flow, subject, stillAt = 4, zoom = 1, offset = [0, 4], floorStyle, overlay, className, children }: StageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const subs = useRef(new Set<(t: number) => void>());
  const still = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = useRef<Clock>({
    still,
    subscribe: (fn) => { subs.current.add(fn); return () => { subs.current.delete(fn); }; },
  });

  useEffect(() => {
    const el = frame.current!, st = stage.current!, fl = floor.current!;
    const diag = Math.hypot(w, d);
    const fit = () => {
      const s = Math.min(el.clientWidth / (diag * 1.02), el.clientHeight / (diag * 0.62)) * zoom * SCENE_SCALE;
      st.style.transform = `translate(${offset[0]}%, ${offset[1]}%) scale(${s})`;
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    if (still) { subs.current.forEach((f) => f(stillAt)); return () => ro.disconnect(); }

    let visible = true, raf = 0, px = 0, py = 0, tx = 0, ty = 0;
    const t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); });
    io.observe(el);
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 6; ty = ((e.clientY - r.top) / r.height - 0.5) * 4; };
    const leave = () => { tx = 0; ty = 0; };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    function loop(now: number) {
      if (!visible) { raf = 0; return; }
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      fl.style.transform = `rotateX(${RX - py}deg) rotateZ(${RZ + px}deg)`;
      const t = (now - t0) / 1000;
      subs.current.forEach((f) => f(t));
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [w, d, zoom, offset, still, stillAt]);

  const tn = TONES[tone];
  return (
    <ClockCtx.Provider value={clock.current}>
      <div ref={frame} role="img" aria-label={label} className={cn('@container relative isolate overflow-hidden', tn.bg, tn.text, className)}>
        <div ref={stage} className="absolute left-1/2 top-1/2 h-0 w-0" style={{ perspective: 2600 }}>
          <div
            ref={floor}
            style={{ ...F, width: w, height: d, left: -w / 2, top: -d / 2, transform: `rotateX(${RX}deg) rotateZ(${RZ}deg)`, ...floorStyle }}
          >
            {children}
          </div>
        </div>
        {overlay}
        {(subject || flow) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-[min(4.5cqw,2rem)]">
            {subject && <span className="mr-2 text-[max(13px,min(2.6cqw,1.15rem))] font-semibold tracking-[-0.01em]">{subject}</span>}
            {flow?.map((s, i) => (
              <span key={s} className="hidden items-center gap-2 @sm:flex">
                {i > 0 && <ArrowRight weight="bold" aria-hidden="true" className="size-3 opacity-50" />}
                <span translate="no" className={cn('whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px]', tn.chip)}>{s}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </ClockCtx.Provider>
  );
}

// ---------- small maths ----------
export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
export const ease = (t: number) => { t = clamp01(t); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0..1 progress of t inside [a,b] */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
