'use client';

import { cn } from '@/lib/utils';

/**
 * Full-viewport noise texture overlay.
 * Hidden on mobile via CSS (md:block) to avoid GPU-heavy SVG filter on phones.
 */
export function NoiseOverlay({ className }: { className?: string }) {
  return (
    <>
      <svg aria-hidden="true" className="pointer-events-none fixed hidden">
        <defs>
          <filter id="noise-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-0 z-50 hidden md:block',
          className
        )}
        style={{
          filter: 'url(#noise-filter)',
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
}
