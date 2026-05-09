'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Renders a subtle radial gradient that follows the cursor on desktop.
 * Updates are applied directly to CSS custom properties so no React
 * re-render is triggered on every mouse move.
 */
export function CursorSpotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.setProperty('--x', `${e.clientX}px`);
      el.style.setProperty('--y', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        // Hidden on mobile, visible on desktop
        'pointer-events-none fixed inset-0 z-30 hidden md:block',
        className
      )}
      style={
        {
          '--x': '-9999px',
          '--y': '-9999px',
          background:
            'radial-gradient(420px circle at var(--x) var(--y), rgba(124,92,252,0.08), rgba(245,121,59,0.04) 40%, transparent 80%)',
        } as React.CSSProperties
      }
    />
  );
}
