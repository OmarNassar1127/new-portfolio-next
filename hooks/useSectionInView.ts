'use client';

import { useEffect, useRef } from 'react';

/**
 * Adds 'in-view' class to a container when it enters the viewport.
 * Uses a single IntersectionObserver — no React state updates, no re-renders.
 * Pure DOM mutation for maximum performance.
 */
export function useSectionInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect(); // Once only
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
