'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'EN' | 'NL';

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, nl: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null;
    if (stored === 'EN' || stored === 'NL') {
      setLanguage(stored);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === 'EN' ? 'NL' : 'EN';
      localStorage.setItem('language', next);
      return next;
    });
  };

  const t = (en: string, nl: string): string => (language === 'NL' ? nl : en);

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
