'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { MotionConfig } from 'motion/react';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

function ResetScrollOnRoute() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    // Hash links (/#portfolio from a project page) land on their section.
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

/**
 * Inertia scrolling on wheel input. Touch stays native. Reduced motion keeps
 * Lenis mounted (so the tree never remounts) but turns smoothing off.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.11,
        smoothWheel: !reduce,
        anchors: reduce ? { immediate: true } : { duration: 1.2 },
        autoResize: true,
      }}
    >
      <ResetScrollOnRoute />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
