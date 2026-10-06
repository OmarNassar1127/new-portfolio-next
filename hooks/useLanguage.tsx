'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

type Language = 'EN' | 'NL';

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, nl: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const listeners = new Set<() => void>();
let current: Language | null = null;

function readStored(): Language {
  try {
    return localStorage.getItem('language') === 'NL' ? 'NL' : 'EN';
  } catch {
    return 'EN';
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = (): Language => (current ??= readStored());
const getServerSnapshot = (): Language => 'EN';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleLanguage = useCallback(() => {
    current = getSnapshot() === 'EN' ? 'NL' : 'EN';
    document.documentElement.lang = current === 'NL' ? 'nl' : 'en';
    try {
      localStorage.setItem('language', current);
    } catch {
      // Private mode: the toggle still works for this visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback(
    (en: string, nl: string): string => (language === 'NL' ? nl : en),
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
