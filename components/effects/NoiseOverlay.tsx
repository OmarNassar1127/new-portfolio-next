'use client';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Full-viewport noise texture overlay.
 * Uses an inline SVG filter so no external assets are needed.
 * opacity 0.03 + mix-blend-mode overlay gives a subtle film-grain effect.
 * Disabled on mobile — the SVG feTurbulence filter is GPU-heavy on phones.
 */
export function NoiseOverlay({ className }: { className?: string }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) return null;

  return (
    <>
      {/* SVG filter definition — not rendered visually */}
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
          'pointer-events-none fixed inset-0 z-50',
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
