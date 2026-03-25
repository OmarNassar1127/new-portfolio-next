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
  'experience',
  'portfolio',
  'skills',
  'certifications',
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

  // Build nav items from translations
  const navItems: NavItem[] = [
    { id: 'about',          href: '#about',          label: t('About', 'Over mij'),        icon: 'ri-user-line' },
    { id: 'experience',     href: '#experience',     label: t('Experience', 'Ervaring'),   icon: 'ri-road-map-line' },
    { id: 'portfolio',      href: '#portfolio',      label: t('Projects', 'Projecten'),    icon: 'ri-briefcase-line' },
    { id: 'skills',         href: '#skills',         label: t('Skills', 'Vaardigheden'),   icon: 'ri-code-line' },
    { id: 'certifications', href: '#certifications', label: t('Certs', 'Certs'),           icon: 'ri-award-line' },
    { id: 'contact',        href: '#contact',        label: t('Contact', 'Contact'),       icon: 'ri-mail-line' },
  ];

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

      // Show/hide on scroll direction
      if (scrollTop < 60) {
        setIsVisible(true);
      } else if (scrollTop > lastScrollY.current + 8) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else if (scrollTop < lastScrollY.current - 8) {
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
        #8873ef 0deg,
        #00d4ff ${progressDeg * 0.4}deg,
        #4ade80 ${progressDeg * 0.7}deg,
        #ff006e ${progressDeg}deg,
        transparent ${progressDeg}deg
      )`
    : 'none';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Desktop: floating pill ──────────────────────────────────────── */}
      <header
        aria-label="Site navigation"
        className={cn(
          'hidden lg:block fixed top-0 left-0 w-full z-50 pointer-events-none',
          'transition-transform duration-300 ease-out',
          isVisible ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="flex justify-center px-4 pt-5">
          <div
            className={cn(
              'pointer-events-auto relative flex items-center h-14 px-2 gap-2',
              'rounded-full transition-all duration-500',
              'bg-[var(--card)]/80 backdrop-blur-xl',
              'border border-[var(--border)]',
              'shadow-[0_8px_32px_rgba(136,115,239,0.12),0_2px_8px_rgba(0,0,0,0.08)]',
            )}
          >
            {/* Scroll progress conic ring */}
            {hasMounted && scrollProgress > 1 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  padding: '1.5px',
                  background: conicGradient,
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            )}

            {/* Ambient glow on scroll */}
            {hasMounted && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500"
                style={{
                  opacity: Math.min(scrollProgress / 200, 0.35),
                  boxShadow:
                    '0 0 24px rgba(136,115,239,0.3), 0 0 48px rgba(0,212,255,0.15)',
                }}
              />
            )}

            {/* Profile image / logo */}
            <NavLogo onClick={() => isHomePage && scrollToSection('about')} isHomePage={isHomePage} />

            {/* Divider */}
            <span className="h-6 w-px bg-[var(--border)] mx-1" aria-hidden="true" />

            {/* Nav links */}
            <nav aria-label="Main navigation" className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={navHref(item)}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-full text-sm font-medium',
                    'transition-all duration-200',
                    isHomePage && activeSection === item.id
                      ? 'text-white bg-[var(--primary)] shadow-[0_2px_12px_rgba(136,115,239,0.4)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card-hover)]',
                  )}
                  aria-current={isHomePage && activeSection === item.id ? 'location' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <span className="h-6 w-px bg-[var(--border)] mx-1" aria-hidden="true" />

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
        className={cn(
          'lg:hidden fixed top-0 left-0 right-0 z-50',
          'bg-[var(--card)]/90 backdrop-blur-xl border-b border-[var(--border)]',
          'transition-transform duration-300 ease-out',
          isVisible ? 'translate-y-0' : '-translate-y-full',
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
              background: 'linear-gradient(to right, var(--primary), var(--accent-cyan), var(--accent-pink))',
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
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[var(--primary)]/40 flex-shrink-0">
              <Image
                src="/images/me2.png"
                alt="Omar Nassar"
                fill
                className="object-cover"
                sizes="36px"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--bg)] rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Omar Nassar</p>
              <p className="text-xs text-[var(--accent-cyan)]">
                {t('Available for AI projects', 'Beschikbaar voor AI projecten')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label={t('Close menu', 'Menu sluiten')}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Drawer nav */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-3 py-4 pb-32"
        >
          <ul className="space-y-1" role="list">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <Link
                  href={navHref(item)}
                  onClick={(e) => handleNavClick(e, item.id)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'font-medium text-sm transition-all duration-200',
                    isHomePage && activeSection === item.id
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white shadow-lg'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)]',
                  )}
                  aria-current={isHomePage && activeSection === item.id ? 'location' : undefined}
                >
                  <span
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isHomePage && activeSection === item.id
                        ? 'bg-white/20'
                        : 'bg-[var(--card)]',
                    )}
                  >
                    <i className={cn(item.icon, 'text-base',
                      isHomePage && activeSection === item.id
                        ? 'text-white'
                        : 'text-[var(--primary)]',
                    )} />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isHomePage && activeSection === item.id && (
                    <i className="ri-arrow-right-s-line text-white" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Settings */}
          <div className="mt-6 pt-5 border-t border-[var(--border)]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-3">
              {t('Settings', 'Instellingen')}
            </p>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl',
                'text-sm font-medium text-[var(--text-muted)]',
                'hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors',
              )}
            >
              <span className="w-8 h-8 rounded-lg bg-[var(--card)] flex items-center justify-center flex-shrink-0">
                <i className={cn(isDarkMode ? 'ri-sun-line' : 'ri-moon-line', 'text-base text-[var(--primary)]')} />
              </span>
              <span className="flex-1 text-left">
                {isDarkMode
                  ? t('Light Mode', 'Lichte Modus')
                  : t('Dark Mode', 'Donkere Modus')}
              </span>
            </button>

            {/* Language */}
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="w-8 h-8 rounded-lg bg-[var(--card)] flex items-center justify-center flex-shrink-0">
                <i className="ri-global-line text-base text-[var(--primary)]" />
              </span>
              <span className="text-sm font-medium text-[var(--text-muted)] flex-1">
                {t('Language', 'Taal')}
              </span>
              <div className="flex p-0.5 rounded-lg bg-[var(--card)] gap-0.5">
                {(['EN', 'NL'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => language !== lang && toggleLanguage()}
                    className={cn(
                      'px-3 py-1 text-xs font-semibold rounded-md transition-all',
                      language === lang
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Drawer footer CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg)] border-t border-[var(--border)]">
          <a
            href="mailto:omarnassar1127@gmail.com"
            className={cn(
              'flex items-center justify-center gap-2',
              'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)]',
              'text-white text-xs font-semibold px-3 py-2.5 rounded-xl',
              'hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-200',
            )}
          >
            <i className="ri-mail-line" />
            {t('Get in touch', 'Neem contact op')}
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
      <span className="relative block w-8 h-8 rounded-full overflow-hidden ring-2 ring-[var(--primary)]/40 group-hover:ring-[var(--primary)] transition-all duration-300">
        <Image
          src="/images/me2.png"
          alt="Omar Nassar"
          fill
          className="object-cover"
          sizes="32px"
          priority
        />
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--card)] rounded-full" />
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
        'p-2 rounded-full text-[var(--text-muted)]',
        'hover:text-[var(--text)] hover:bg-[var(--card-hover)]',
        'transition-all duration-200',
      )}
    >
      <i className={cn(isDarkMode ? 'ri-sun-line' : 'ri-moon-line', 'text-[18px]')} />
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
      className="flex p-0.5 rounded-full bg-[var(--card-hover)] gap-0.5"
      role="group"
      aria-label="Language selection"
    >
      {(['EN', 'NL'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => language !== lang && onToggle()}
          aria-pressed={language === lang}
          className={cn(
            'px-2.5 py-1 text-[11px] font-bold rounded-full transition-all duration-200',
            language === lang
              ? 'bg-[var(--primary)] text-white shadow-sm'
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
