'use client';

import { ReactLenis } from 'lenis/react';

type SmoothScrollProps = {
  children: React.ReactNode;
};

/**
 * Wraps the application in Lenis smooth scroll.
 * lerp 0.1 + duration 1.2 gives a natural, non-over-damped feel.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
