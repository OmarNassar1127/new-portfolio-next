'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useLenis } from 'lenis/react';
import { List, Moon, Sun, X } from '@phosphor-icons/react';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { buttonStyles } from '@/components/ui/Button';
import { cn, ease } from '@/lib/utils';

const NAV = [
  { id: 'portfolio', en: 'Work', nl: 'Werk' },
  { id: 'about-me', en: 'About', nl: 'Over' },
  { id: 'journey', en: 'Journey', nl: 'Reis' },
  { id: 'certifications', en: 'Certs', nl: 'Certs' },
  { id: 'tools', en: 'Tools', nl: 'Tools' },
  { id: 'contact', en: 'Contact', nl: 'Contact' },
] as const;

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const lenis = useLenis();

  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Hide while reading down, return on the first scroll up.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 200);
  });

  // Active section = whichever crosses the middle of the viewport.
  useEffect(() => {
    if (!isHome) return;
    const ids = ['about', ...NAV.map((item) => item.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === 'about' ? null : entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // The sheet owns the screen: stop page scroll while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [menuOpen, lenis]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButton.current?.focus();
  };

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-header)] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.div
          data-glass
          animate={{ y: hidden && !menuOpen ? -96 : 0 }}
          transition={{ duration: 0.5, ease }}
          onFocusCapture={() => setHidden(false)}
          className="pointer-events-auto flex h-14 w-full items-center gap-1 rounded-full border border-hairline bg-surface/75 pl-1.5 pr-1.5 shadow-[var(--nav-shadow)] backdrop-blur-xl backdrop-saturate-150 lg:w-auto"
        >
          <HomeLink isHome={isHome} />

          <nav aria-label={t('Main', 'Hoofdmenu')} className="hidden lg:block">
            <ul className="flex items-center">
              {NAV.map((item) => {
                const isActive = active === item.id;
                const label = t(item.en, item.nl);
                const linkClass = cn(
                  'relative flex h-10 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-200',
                  isActive ? 'text-ink' : 'text-body hover:text-ink',
                );
                return (
                  <li key={item.id}>
                    {isHome ? (
                      <a href={href(item.id)} className={linkClass} aria-current={isActive ? 'location' : undefined}>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                            className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                          />
                        )}
                        {label}
                      </a>
                    ) : (
                      <Link href={href(item.id)} className={linkClass}>
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-2 lg:border-l lg:border-hairline lg:pl-2">
            <ThemeToggle />
            <LanguageToggle className="hidden sm:flex" />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('Open menu', 'Menu openen')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2 lg:hidden"
            >
              <List weight="bold" aria-hidden="true" className="size-5" />
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen && <MobileMenu isHome={isHome} href={href} onClose={closeMenu} />}
      </AnimatePresence>
    </>
  );
}

function HomeLink({ isHome }: { isHome: boolean }) {
  const content = (
    <>
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#050505] ring-1 ring-hairline">
        <Image src="/images/me2.webp" alt="" fill sizes="40px" className="object-cover" />
      </span>
      <span className="pr-2 text-[0.9375rem] font-semibold tracking-[-0.02em]">Omar Nassar</span>
    </>
  );
  const className = 'flex h-11 items-center gap-2.5 rounded-full pr-1 transition-colors hover:bg-surface-2';

  return isHome ? (
    <a href="#about" className={className} aria-label="Omar Nassar, back to top">
      {content}
    </a>
  ) : (
    <Link href="/" className={className} aria-label="Omar Nassar, home">
      {content}
    </Link>
  );
}

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={isDarkMode ? t('Switch to light mode', 'Naar lichte modus') : t('Switch to dark mode', 'Naar donkere modus')}
      className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2"
    >
      {isDarkMode ? (
        <Sun weight="bold" aria-hidden="true" className="size-[18px]" />
      ) : (
        <Moon weight="bold" aria-hidden="true" className="size-[18px]" />
      )}
    </button>
  );
}

function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div role="group" aria-label={t('Language', 'Taal')} className={cn('flex h-10 items-center rounded-full bg-surface-2 p-1', className)}>
      {(['EN', 'NL'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => language !== lang && toggleLanguage()}
          aria-pressed={language === lang}
          className={cn(
            'h-8 rounded-full px-3 font-mono text-xs font-medium transition-colors duration-200',
            language === lang ? 'bg-ink text-canvas' : 'text-body hover:text-ink',
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

function MobileMenu({
  isHome,
  href,
  onClose,
}: {
  isHome: boolean;
  href: (id: string) => string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const reduce = usePrefersReducedMotion();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Scrolling is paused while the sheet is open, so in-page jumps restart
  // Lenis first. Cross-page links fall through to Next.
  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    onClose();
    if (!isHome) return;
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    lenis?.start();
    if (lenis) lenis.scrollTo(target, { immediate: !!reduce, force: true });
    else target.scrollIntoView();
  };

  // Focus the close button, close on Escape, keep Tab inside the sheet.
  useEffect(() => {
    const root = panel.current;
    if (!root) return;
    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t('Menu', 'Menu')}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
      className="fixed inset-0 z-[var(--z-overlay)] flex flex-col overflow-y-auto overscroll-contain bg-canvas px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 sm:pt-4 lg:hidden"
    >
      <div className="flex h-14 items-center justify-between rounded-full border border-hairline bg-surface pl-1.5 pr-1.5">
        <Link href={href('about')} onClick={(event) => go(event, 'about')} className="flex h-11 items-center gap-2.5 rounded-full pr-2">
          <span className="relative size-10 overflow-hidden rounded-full bg-[#050505]">
            <Image src="/images/me2.webp" alt="" fill sizes="40px" className="object-cover" />
          </span>
          <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">Omar Nassar</span>
        </Link>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label={t('Close menu', 'Menu sluiten')}
          className="flex size-11 items-center justify-center rounded-full hover:bg-surface-2"
        >
          <X weight="bold" aria-hidden="true" className="size-5" />
        </button>
      </div>

      <nav aria-label={t('Main', 'Hoofdmenu')} className="mt-10 px-2">
        <ul className="flex flex-col">
          {NAV.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 + i * 0.045, ease }}
            >
              <Link
                href={href(item.id)}
                onClick={(event) => go(event, item.id)}
                className="block py-2 text-[clamp(2.5rem,12vw,3.75rem)] type-display transition-colors hover:text-signal-ink"
              >
                {t(item.en, item.nl)}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 px-2 pt-10">
        <a href={`mailto:${personal.email}`} className={buttonStyles('primary')}>
          {t('Email me', 'Mail me')}
        </a>
        <LanguageToggle />
      </div>
    </motion.div>
  );
}
