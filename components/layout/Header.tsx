'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_IDS = [
  'about',
  'portfolio',
  'about-me',
  'journey',
  'certifications',
  'tools',
  'contact',
] as const;

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Build nav items — six-section main page
  const navItems: NavItem[] = [
    { id: 'about',          href: '#about',          label: t('Home',    'Home'),    icon: 'ri-home-line' },
    { id: 'portfolio',      href: '#portfolio',      label: t('Work',    'Werk'),    icon: 'ri-briefcase-line' },
    { id: 'about-me',       href: '#about-me',       label: t('About',   'Over'),    icon: 'ri-user-line' },
    { id: 'journey',        href: '#journey',        label: t('Journey', 'Reis'),    icon: 'ri-road-map-line' },
    { id: 'certifications', href: '#certifications', label: t('Certs',   'Certs'),   icon: 'ri-award-line' },
    { id: 'tools',          href: '#tools',          label: t('Tools',   'Tools'),   icon: 'ri-terminal-box-line' },
    { id: 'contact',        href: '#contact',        label: t('Contact', 'Contact'), icon: 'ri-mail-line' },
  ];

  // Active index for the editorial position indicator (01/07)
  const activeIndex = navItems.findIndex((i) => i.id === activeSection);
  const activeNumber = activeIndex >= 0 ? activeIndex + 1 : 1;

  // ── Scroll handler ─────────────────────────────────────────────────────────

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Show/hide on scroll direction — wider threshold to avoid flicker
      if (scrollTop < 100) {
        setIsVisible(true);
      } else if (scrollTop > lastScrollY.current + 40) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else if (scrollTop < lastScrollY.current - 20) {
        setIsVisible(true);
      }
      lastScrollY.current = scrollTop;

      // Active section detection
      if (isHomePage) {
        let current: string = SECTION_IDS[0];
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120) current = id;
          }
        }
        setActiveSection(current);
      }

      ticking.current = false;
    });
  }, [isHomePage]);

  useEffect(() => {
    setHasMounted(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // ── Navigation helpers ─────────────────────────────────────────────────────

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
    setActiveSection(id);
    setIsMenuOpen(false);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (isHomePage) {
      e.preventDefault();
      scrollToSection(id);
    } else {
      // On project pages, let Next link handle `/#section` navigation
      setIsMenuOpen(false);
    }
  };

  // Build the correct href for any page context
  const navHref = (item: NavItem) =>
    isHomePage ? item.href : `/${item.href}`;

  // ── Conic progress ring ────────────────────────────────────────────────────

  const progressDeg = (scrollProgress / 100) * 360;
  const conicGradient = hasMounted
    ? `conic-gradient(from 0deg,
        var(--accent-deep) 0deg,
        var(--accent-deep) ${progressDeg}deg,
        transparent ${progressDeg}deg
      )`
    : 'none';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Desktop: floating pill ──────────────────────────────────────── */}
      <header
        aria-label="Site navigation"
        suppressHydrationWarning
        className={cn(
          'hidden lg:block fixed top-0 left-0 w-full z-50 pointer-events-none',
          'transition-all duration-300 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
        )}
      >
        <div className="flex justify-center px-4 pt-5">
          <div
            className={cn(
              'pointer-events-auto relative flex items-center h-12 pl-1.5 pr-1.5 gap-1',
              'rounded-full transition-all duration-500',
              'bg-[var(--bg-elevated)]/85 backdrop-blur-xl',
              'border border-[var(--border)]',
              'shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_32px_-8px_rgba(10,11,17,0.18)]',
            )}
          >
            {/* Scroll progress conic ring */}
            {hasMounted && scrollProgress > 1 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  padding: '1px',
                  background: conicGradient,
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            )}

            {/* Profile image / logo */}
            <NavLogo onClick={() => isHomePage && scrollToSection('about')} isHomePage={isHomePage} />

            {/* Editorial position indicator — 0X/07 */}
            {isHomePage && hasMounted && (
              <span
                aria-hidden="true"
                className="hidden xl:inline-flex items-center gap-1 pl-2 pr-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]"
              >
                <span className="text-[var(--accent)]">{String(activeNumber).padStart(2, '0')}</span>
                <span className="opacity-50">/{String(navItems.length).padStart(2, '0')}</span>
              </span>
            )}

            {/* Divider */}
            <span className="h-5 w-px bg-[var(--border)] mx-1.5" aria-hidden="true" />

            {/* Nav links */}
            <nav aria-label="Main navigation" className="flex items-center gap-px">
              {navItems.map((item) => {
                const isActive = isHomePage && activeSection === item.id;
                return (
                  <Link
                    key={item.id}
                    href={navHref(item)}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={cn(
                      'relative inline-flex items-center justify-center',
                      'px-3 py-1.5 rounded-full',
                      'font-mono text-[10px] font-medium uppercase tracking-[0.18em]',
                      'transition-all duration-200',
                      isActive
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                    )}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <span className="h-5 w-px bg-[var(--border)] mx-1.5" aria-hidden="true" />

            {/* Controls */}
            <div className="flex items-center gap-1">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              <LangToggle language={language} onToggle={toggleLanguage} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile: top bar ─────────────────────────────────────────────── */}
      <header
        aria-label="Site navigation"
        suppressHydrationWarning
        className={cn(
          'lg:hidden fixed top-0 left-0 right-0 z-50',
          'bg-transparent backdrop-blur-xl',
          'transition-all duration-300 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none',
        )}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <NavLogo onClick={() => isHomePage && scrollToSection('about')} isHomePage={isHomePage} />

          <div className="flex items-center gap-1">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
            <HamburgerButton isOpen={isMenuOpen} onToggle={() => setIsMenuOpen((v) => !v)} />
          </div>
        </div>

        {/* Mobile scroll progress strip */}
        {hasMounted && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] transition-all duration-150 ease-out"
            style={{
              width: `${scrollProgress}%`,
              background: 'var(--accent-deep)',
            }}
          />
        )}
      </header>

      {/* ── Mobile drawer overlay ────────────────────────────────────────── */}
      <div
        aria-hidden={!isMenuOpen}
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          'transition-opacity duration-300',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* ── Mobile drawer panel ──────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 lg:hidden',
          'w-[75vw] max-w-[300px]',
          'bg-[var(--bg)] border-l border-[var(--border)]',
          'flex flex-col shadow-2xl',
          'transition-transform duration-300 ease-out',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-[var(--border-strong)] flex-shrink-0">
              <Image
                src="/images/me2.png"
                alt="Omar Nassar"
                fill
                className="object-cover"
                sizes="40px"
                loading="eager"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--signal-emerald)] border-2 border-[var(--bg)] rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Omar Nassar</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--signal-emerald)]">
                {t('Available', 'Beschikbaar')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label={t('Close menu', 'Menu sluiten')}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Drawer nav — editorial numbered */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-5 py-5 pb-32"
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            {t(
              `Sections · ${String(navItems.length).padStart(2, '0')}`,
              `Secties · ${String(navItems.length).padStart(2, '0')}`,
            )}
          </p>
          <ul role="list">
            {navItems.map((item, i) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={navHref(item)}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={cn(
                      'group flex items-baseline justify-between gap-4 border-b border-[var(--rule)] py-3.5',
                      'transition-colors duration-200',
                      isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                    )}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className={cn(
                          'font-mono text-[10px] font-medium uppercase tracking-[0.22em]',
                          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-subtle)]',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="display-serif text-2xl font-semibold leading-none">
                        {item.label}
                      </span>
                    </span>
                    <i
                      className={cn(
                        'ri-arrow-right-line text-base transition-transform duration-200',
                        isActive ? 'translate-x-0 text-[var(--accent)]' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Settings */}
          <div className="mt-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
              {t('Controls', 'Bediening')}
            </p>

            <div className="flex flex-col gap-2">
              {/* Theme */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'group flex items-center justify-between gap-3 border border-[var(--rule)] rounded-full px-4 py-2.5',
                  'font-mono text-[11px] uppercase tracking-[0.18em] font-medium text-[var(--text)]',
                  'transition-colors duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--card)]',
                )}
              >
                <span className="flex items-center gap-2">
                  <i className={cn(isDarkMode ? 'ri-sun-line' : 'ri-moon-line', 'text-base')} />
                  {isDarkMode ? t('Light', 'Licht') : t('Dark', 'Donker')}
                </span>
                <i className="ri-arrow-left-right-line text-[var(--text-subtle)] text-sm" />
              </button>

              {/* Language */}
              <div className="flex items-center justify-between gap-3 border border-[var(--rule)] rounded-full px-4 py-2">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] font-medium text-[var(--text)]">
                  <i className="ri-global-line text-base" />
                  {t('Language', 'Taal')}
                </span>
                <div className="flex p-0.5 rounded-full bg-[var(--card)] gap-0.5">
                  {(['EN', 'NL'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => language !== lang && toggleLanguage()}
                      className={cn(
                        'px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] rounded-full transition-all',
                        language === lang
                          ? 'bg-[var(--text)] text-[var(--bg)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Drawer footer CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[var(--bg)] border-t border-[var(--border)]">
          <a
            href="mailto:omarnassar1127@gmail.com"
            className={cn(
              'group flex items-center justify-between gap-2',
              'bg-[var(--text)] text-[var(--bg)] rounded-full px-5 py-3',
              'font-mono text-[11px] uppercase tracking-[0.18em] font-semibold',
              'transition-all duration-300 hover:bg-[var(--primary)] hover:text-white',
              'hover:shadow-[0_10px_24px_-6px_rgba(124,92,252,0.5)]',
            )}
          >
            <span className="flex items-center gap-2">
              <i className="ri-mail-line text-base" />
              {t('Get in touch', 'Contact')}
            </span>
            <i className="ri-arrow-right-line text-base transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLogo({
  onClick,
  isHomePage,
}: {
  onClick: () => void;
  isHomePage: boolean;
}) {
  const inner = (
    <span className="group relative flex-shrink-0 block">
      <span className="relative block w-8 h-8 rounded-full overflow-hidden border border-[var(--rule)] transition-colors duration-300 group-hover:border-[var(--text-muted)]">
        <Image
          src="/images/me2.png"
          alt="Omar Nassar"
          fill
          className="object-cover"
          sizes="32px"
          priority
          loading="eager"
        />
      </span>
      <span className="absolute -bottom-px -right-px h-2 w-2 rounded-full bg-[var(--signal-emerald)] outline outline-2 outline-[var(--bg-elevated)]" />
    </span>
  );

  if (isHomePage) {
    return (
      <button
        onClick={onClick}
        aria-label="Go to top"
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full"
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href="/" aria-label="Home">
      {inner}
    </Link>
  );
}

function ThemeToggle({
  isDarkMode,
  onToggle,
}: {
  isDarkMode: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'h-8 w-8 inline-flex items-center justify-center rounded-full text-[var(--text-muted)]',
        'hover:text-[var(--text)] hover:bg-[var(--card-hover)]',
        'transition-all duration-200',
      )}
    >
      <i className={cn(isDarkMode ? 'ri-sun-line' : 'ri-moon-line', 'text-[16px]')} />
    </button>
  );
}

function LangToggle({
  language,
  onToggle,
}: {
  language: 'EN' | 'NL';
  onToggle: () => void;
}) {
  return (
    <div
      className="flex p-0.5 rounded-full bg-[var(--card)] gap-0.5"
      role="group"
      aria-label="Language selection"
    >
      {(['EN', 'NL'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => language !== lang && onToggle()}
          aria-pressed={language === lang}
          className={cn(
            'px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] rounded-full transition-all duration-200',
            language === lang
              ? 'bg-[var(--text)] text-[var(--bg)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]',
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

function HamburgerButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
    >
      <span className="relative block w-5 h-4">
        <span
          className={cn(
            'absolute left-0 h-0.5 w-full rounded-full bg-current',
            'transition-all duration-300 origin-center',
            isOpen ? 'top-[7px] rotate-45' : 'top-0',
          )}
        />
        <span
          className={cn(
            'absolute left-0 top-[7px] h-0.5 w-full rounded-full bg-current',
            'transition-all duration-200',
            isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100',
          )}
        />
        <span
          className={cn(
            'absolute left-0 h-0.5 w-full rounded-full bg-current',
            'transition-all duration-300 origin-center',
            isOpen ? 'top-[7px] -rotate-45' : 'top-[14px]',
          )}
        />
      </span>
    </button>
  );
}
