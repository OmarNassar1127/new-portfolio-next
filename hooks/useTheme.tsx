'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

/** Must match --canvas in app/globals.css */
export const THEME_COLORS = { light: '#f4f4f2', dark: '#0e0e0d' } as const;

type ThemeContextValue = {
  isDarkMode: boolean;
  /** Pass the click point to wipe the new theme in from there. */
  toggleTheme: (origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// The class on <html> is the source of truth. An inline script in the
// layout sets it before first paint, so there is no flash of light mode.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => document.documentElement.classList.contains('dark');
const getServerSnapshot = () => false;

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    // Private mode: the toggle still works for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const next = !getSnapshot();
    const commit = () => flushSync(() => applyTheme(next));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!origin || reduceMotion || !document.startViewTransition) {
      commit();
      return;
    }

    const { x, y } = origin;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(commit);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 640,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
