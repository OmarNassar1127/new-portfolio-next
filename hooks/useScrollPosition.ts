import { useEffect, useState } from 'react';

type ScrollPosition = {
  scrollY: number;
  /** 0 at the top, 1 at the bottom of the page */
  scrollProgress: number;
};

const THROTTLE_MS = 16; // ~60fps

/**
 * Returns the current scroll Y position and a 0–1 progress value.
 * Both values are 0 during SSR.
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    scrollY: 0,
    scrollProgress: 0,
  });

  useEffect(() => {
    let rafId: number | null = null;
    let lastCall = 0;

    const update = () => {
      const y = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;
      setPosition({ scrollY: y, scrollProgress: progress });
      rafId = null;
    };

    const onScroll = () => {
      const now = Date.now();
      if (rafId !== null) return; // already queued
      if (now - lastCall < THROTTLE_MS) {
        // Defer to next available frame after the throttle window
        rafId = window.requestAnimationFrame(() => {
          lastCall = Date.now();
          update();
        });
      } else {
        lastCall = now;
        update();
      }
    };

    // Set initial values
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}
