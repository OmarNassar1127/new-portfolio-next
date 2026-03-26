import { useEffect, useState } from 'react';

/**
 * Returns true when the given media query matches the current viewport.
 *
 * Initialises to the LIVE match result on the client (via lazy useState),
 * so the first render already reflects the real viewport and there is no
 * hydration flash.  Falls back to `false` during SSR (no `window`).
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // During SSR there is no window — return false so it matches the
    // server-rendered HTML and avoids a hydration mismatch.
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    // Sync immediately in case the query changed between renders
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
