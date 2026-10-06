import { useCallback, useSyncExternalStore } from 'react';

/**
 * True when the media query matches. Renders `false` on the server and during
 * hydration, then switches to the live value, so markup never mismatches.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Hydration-safe reduced-motion check: false until after hydration, then live.
 * Use it to gate scroll-linked effects and smooth scrolling. One-shot entrance
 * animations are handled by <MotionConfig reducedMotion="user"> instead.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
