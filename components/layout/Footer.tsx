'use client';

import { useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { personal } from '@/data/personal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialCard {
  href: string;
  icon: string;
  label: string;
  handle: string;
  colorClass: string;
  glowColor: string;
}

interface NavLink {
  href: string;
  label: string;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  const navLinks: NavLink[] = [
    { href: '#about',          label: t('About',          'Over mij')      },
    { href: '#experience',     label: t('Experience',     'Ervaring')      },
    { href: '#portfolio',      label: t('Projects',       'Projecten')     },
    { href: '#skills',         label: t('Skills',         'Vaardigheden')  },
    { href: '#certifications', label: t('Certifications', 'Certificeringen') },
    { href: '#contact',        label: t('Contact',        'Contact')       },
  ];

  const socialCards: SocialCard[] = [
    {
      href: `mailto:${personal.email}`,
      icon: 'ri-mail-fill',
      label: 'Email',
      handle: personal.email,
      colorClass: 'group-hover:text-[var(--primary)]',
      glowColor: 'rgba(136,115,239,0.25)',
    },
    {
      href: personal.linkedin,
      icon: 'ri-linkedin-box-fill',
      label: 'LinkedIn',
      handle: 'Omar Nassar',
      colorClass: 'group-hover:text-[#0A66C2]',
      glowColor: 'rgba(10,102,194,0.25)',
    },
    {
      href: personal.github,
      icon: 'ri-github-fill',
      label: 'GitHub',
      handle: 'OmarNassar1127',
      colorClass: 'group-hover:text-[var(--text)]',
      glowColor: 'rgba(255,255,255,0.12)',
    },
    {
      href: personal.twitter,
      icon: 'ri-twitter-x-fill',
      label: 'X / Twitter',
      handle: '@GodelTrabuco69',
      colorClass: 'group-hover:text-[var(--text)]',
      glowColor: 'rgba(255,255,255,0.12)',
    },
  ];

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer
      className={cn(
        'relative overflow-hidden',
        'bg-[var(--bg)] border-t border-[var(--border)]',
        'transition-colors duration-300',
      )}
    >
      {/* Ambient gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-48 -left-24 w-96 h-96 rounded-full opacity-[0.04] blur-3xl"
          style={{ background: 'var(--primary)' }}
        />
        <div
          className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-[0.04] blur-3xl"
          style={{ background: 'var(--accent-cyan)' }}
        />
      </div>

      {/* ── Main content grid ──────────────────────────────────────────── */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ── Left column: CTA + badges ────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              {t("Let's work together", 'Laten we samenwerken')}
            </p>

            {/* Headline */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[var(--text)]">
                {t("Let's build something", 'Laten we iets')}{' '}
                <span className="gradient-text">
                  {t('extraordinary', 'buitengewoons')}
                </span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Multi-agent systems, RAG platforms, and custom AI solutions — from concept to production.',
                  'Multi-agent systemen, RAG-platformen en maatwerk AI-oplossingen — van concept tot productie.',
                )}
              </p>
            </div>

            {/* CTA button */}
            <div>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className={cn(
                  'group inline-flex items-center gap-3',
                  'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)]',
                  'text-white font-semibold px-7 py-3.5 rounded-2xl',
                  'hover:shadow-[0_8px_32px_rgba(136,115,239,0.4)]',
                  'hover:-translate-y-0.5 active:translate-y-0',
                  'transition-all duration-300',
                )}
              >
                <i className="ri-chat-3-line text-lg group-hover:scale-110 transition-transform" />
                {t('Start a conversation', 'Start een gesprek')}
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
                  isDarkMode
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-green-50 text-green-700 border border-green-200',
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
                {t('Available for AI projects', 'Beschikbaar voor AI projecten')}
              </span>

              <span
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
                  isDarkMode
                    ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20'
                    : 'bg-blue-50 text-blue-700 border border-blue-200',
                )}
              >
                <i className="ri-map-pin-line text-xs" />
                {t('Based in Amsterdam', 'Gevestigd in Amsterdam')}
              </span>
            </div>

            {/* Virelio mention */}
            <a
              href={personal.virelio.site}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group inline-flex items-center gap-2.5 text-xs',
                'text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200',
              )}
            >
              <span
                className={cn(
                  'w-6 h-6 rounded-md flex items-center justify-center',
                  'bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20 transition-colors',
                )}
              >
                <i className="ri-robot-2-line text-[var(--primary)] text-sm" />
              </span>
              <span>
                {t(
                  'Co-founded Virelio — AI agents on demand',
                  'Mede-opgericht: Virelio — AI agents op aanvraag',
                )}
              </span>
              <i className="ri-external-link-line text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* ── Right column: nav + social ───────────────────────────── */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* Quick links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-5">
                {t('Navigation', 'Navigatie')}
              </h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2" role="list">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                        className={cn(
                          'group inline-flex items-center gap-2 text-sm',
                          'text-[var(--text-muted)] hover:text-[var(--primary)]',
                          'transition-all duration-200',
                        )}
                      >
                        <span
                          className={cn(
                            'block h-px transition-all duration-300',
                            'bg-[var(--primary)] opacity-0 group-hover:opacity-100',
                            'w-0 group-hover:w-4',
                          )}
                        />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Social cards */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-5">
                {t('Connect', 'Verbinden')}
              </h3>
              <div className="space-y-2">
                {socialCards.map((card) => (
                  <SpotlightCard
                    key={card.label}
                    card={card}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer bottom bar ──────────────────────────────────────────── */}
      <div className="relative border-t border-[var(--border)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span>
                {t(
                  `© ${currentYear} Omar Nassar. All rights reserved.`,
                  `© ${currentYear} Omar Nassar. Alle rechten voorbehouden.`,
                )}
              </span>
              <span aria-hidden="true" className="hidden sm:block opacity-30">·</span>
              <span>
                {t('Made with code in Amsterdam', 'Gemaakt met code in Amsterdam')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="hover:text-[var(--primary)] transition-colors"
              >
                {t('All Projects', 'Alle Projecten')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── SpotlightCard ────────────────────────────────────────────────────────────

/**
 * Social link card with a radial spotlight that follows the cursor,
 * inspired by the SpotlightCard pattern popular in Awwwards-level portfolios.
 */
function SpotlightCard({
  card,
  isDarkMode,
}: {
  card: SocialCard;
  isDarkMode: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--spotlight-x', `${x}px`);
    el.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.removeProperty('--spotlight-x');
    el.style.removeProperty('--spotlight-y');
  };

  const isEmail = card.href.startsWith('mailto:');

  return (
    <a
      ref={cardRef}
      href={card.href}
      target={isEmail ? '_self' : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex items-center gap-3.5 px-3.5 py-3',
        'rounded-xl border border-[var(--border)]',
        'bg-[var(--card)] overflow-hidden',
        'transition-all duration-300',
        'hover:border-[var(--primary)]/40',
        'hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]',
        'hover:-translate-y-0.5',
        // spotlight layer via CSS variable
        'before:pointer-events-none before:absolute before:inset-0',
        'before:opacity-0 hover:before:opacity-100',
        'before:transition-opacity before:duration-300',
        'before:rounded-xl',
      )}
      style={{
        ['--spotlight-x' as string]: '-100px',
        ['--spotlight-y' as string]: '-100px',
      }}
    >
      {/* Spotlight radial gradient */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(180px circle at var(--spotlight-x, -100px) var(--spotlight-y, -100px), ${card.glowColor}, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <span
        className={cn(
          'relative z-10 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
          'bg-[var(--card-hover)] border border-[var(--border)]',
          'group-hover:scale-110 group-hover:border-[var(--primary)]/30',
          'transition-all duration-300',
        )}
      >
        <i
          className={cn(
            card.icon,
            'text-base text-[var(--text-muted)]',
            card.colorClass,
            'transition-colors duration-300',
          )}
        />
      </span>

      {/* Text */}
      <span className="relative z-10 flex flex-col gap-0 flex-1 min-w-0">
        <span className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors duration-200">
          {card.label}
        </span>
        <span className="text-[11px] text-[var(--text-muted)] truncate">
          {card.handle}
        </span>
      </span>

      {/* Arrow */}
      <i
        className={cn(
          'relative z-10 ri-arrow-right-up-line text-sm',
          'text-[var(--text-muted)] opacity-0 group-hover:opacity-100',
          'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
          'transition-all duration-300',
        )}
      />
    </a>
  );
}
