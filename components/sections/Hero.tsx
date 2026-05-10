'use client';

import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

/* ─── Hero — slim, hiring-manager-first ───────────────────────────────── */
export default function Hero() {
  const { language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';

  const socialLinks = [
    { href: personal.github, icon: 'ri-github-fill', label: 'GitHub' },
    { href: personal.linkedin, icon: 'ri-linkedin-fill', label: 'LinkedIn' },
    { href: personal.twitter, icon: 'ri-twitter-fill', label: 'Twitter' },
    { href: `mailto:${personal.email}`, icon: 'ri-mail-line', label: 'Email' },
  ];

  return (
    <section
      id="about"
      className="relative flex min-h-dvh-screen flex-col overflow-hidden bg-[var(--bg)] pt-20 lg:pt-24"
    >
      {/* Background — single soft orb + grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 grid-backdrop" />
        <div
          className="absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.20] blur-[140px]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, var(--primary) 0%, transparent 45%), radial-gradient(circle at 70% 70%, var(--accent) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Editorial filing strip — top */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-end justify-between gap-4 px-4 pt-2 sm:px-6 lg:pt-4">
        <div className="flex flex-col gap-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--text-subtle)]">
          <span className="hidden sm:inline">File / Portfolio</span>
          <span>{lang === 'en' ? 'Edition 2026 · No. 01' : 'Editie 2026 · Nr. 01'}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em]">
          <span className="hidden text-[var(--text-subtle)] sm:inline">Amsterdam · NL</span>
          <span className="hidden h-3 w-px bg-[var(--rule)] sm:inline-block" />
          <span className="flex items-center gap-1.5 text-[var(--signal-emerald)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal-emerald)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal-emerald)]" />
            </span>
            {lang === 'en' ? 'Available' : 'Beschikbaar'}
          </span>
        </div>
      </div>

      <span className="relative z-10 mx-auto mt-3 block h-px w-[calc(100%-2rem)] max-w-[1400px] bg-[var(--rule)] sm:w-[calc(100%-3rem)]" aria-hidden="true" />

      {/* Content area — sits right under the divider */}
      <div className="relative z-10 flex flex-1 items-start justify-center px-4 pb-12 pt-6 sm:px-6 sm:pt-4 lg:pt-6">
        <div className="hero-stagger relative mx-auto flex w-full max-w-[900px] flex-col items-center gap-8 text-center sm:gap-6">
          {/* Viewfinder marks */}
          <span className="viewfinder tl hidden lg:block" />
          <span className="viewfinder tr hidden lg:block" />
          <span className="viewfinder bl hidden lg:block" />
          <span className="viewfinder br hidden lg:block" />

          {/* Eyebrow */}
          <span className="eyebrow eyebrow-centered">
            <span className="text-[var(--accent)]">01</span>
            <span>{lang === 'en' ? 'Engineer · Founder' : 'Ingenieur · Oprichter'}</span>
          </span>

          {/* Nameplate */}
          <h1
            className="font-bold leading-[0.88] tracking-tight text-[var(--text)]"
            style={{
              fontSize: 'clamp(3rem, 11vw, 8rem)',
              letterSpacing: '-0.04em',
            }}
          >
            <span className="block">Omar</span>
            <span
              className="display-serif-italic block font-medium ink-flush"
              style={{ fontWeight: 500, marginTop: '-0.05em' }}
            >
              Nassar.
            </span>
          </h1>

          {/* Tagline — single line, says everything */}
          <p className="max-w-2xl text-balance text-lg leading-snug text-[var(--text-muted)] sm:text-xl">
            {lang === 'en' ? (
              <>
                Full-stack developer and <span className="font-medium text-[var(--text)]">AI engineer</span> at{' '}
                <a
                  href="https://vloto.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--text)] underline decoration-[var(--rule)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                >
                  Vloto
                </a>{' '}
                and{' '}
                <a
                  href={personal.virelio.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display-serif-italic font-medium text-[var(--accent-deep)] underline decoration-[var(--accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                >
                  Virelio
                </a>
                .
              </>
            ) : (
              <>
                Full-stack developer en <span className="font-medium text-[var(--text)]">AI engineer</span> bij{' '}
                <a
                  href="https://vloto.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--text)] underline decoration-[var(--rule)] underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                >
                  Vloto
                </a>{' '}
                en{' '}
                <a
                  href={personal.virelio.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display-serif-italic font-medium text-[var(--accent-deep)] underline decoration-[var(--accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                >
                  Virelio
                </a>
                .
              </>
            )}
          </p>

          {/* Quick proof — stacks on mobile, inline on sm+ */}
          <div className="flex flex-col items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-subtle)] sm:flex-row sm:gap-0">
            {lang === 'en' ? (
              <>
                <span className="whitespace-nowrap">
                  <span className="text-[var(--text)]">7+</span> years engineering
                </span>
                <span className="hidden opacity-50 sm:mx-2 sm:inline">·</span>
                <span className="whitespace-nowrap">
                  <span className="text-[var(--text)]">50+</span> systems shipped
                </span>
                <span className="hidden opacity-50 sm:mx-2 sm:inline">·</span>
                <span className="whitespace-nowrap">
                  <span className="text-[var(--text)]">80K+</span> users served
                </span>
              </>
            ) : (
              <>
                <span className="whitespace-nowrap">
                  <span className="text-[var(--text)]">7+</span> jaar engineering
                </span>
                <span className="hidden opacity-50 sm:mx-2 sm:inline">·</span>
                <span className="whitespace-nowrap">
                  <span className="text-[var(--text)]">50+</span> systemen
                </span>
                <span className="hidden opacity-50 sm:mx-2 sm:inline">·</span>
                <span className="whitespace-nowrap">
                  <span className="text-[var(--text)]">80K+</span> gebruikers
                </span>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-2 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <a
              href="#portfolio"
              className={cn(
                'group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3',
                'bg-[var(--text)] font-semibold text-[var(--bg)] text-sm',
                'shadow-[0_8px_24px_-8px_rgba(10,11,17,0.45)]',
                'transition-all duration-300',
                'hover:bg-[var(--primary)] hover:text-white',
                'hover:shadow-[0_10px_28px_-6px_rgba(124,92,252,0.5)]',
                'active:scale-[0.98]',
              )}
            >
              <i className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-0.5" />
              {lang === 'en' ? 'See the work' : 'Bekijk het werk'}
            </a>

            <a
              href={`mailto:${personal.email}`}
              className={cn(
                'group inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3',
                'border-[var(--border-strong)] bg-transparent font-semibold text-[var(--text)] text-sm',
                'transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent-deep)]',
                'active:scale-[0.98]',
              )}
            >
              <i className="ri-mail-line text-base" />
              {lang === 'en' ? 'Get in touch' : 'Contact'}
            </a>
          </div>

          {/* Social row */}
          <div className="mt-2 flex items-center justify-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full',
                  'border border-[var(--border)] text-[var(--text-muted)]',
                  'transition-all duration-300',
                  'hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]',
                )}
              >
                <i className={cn(social.icon, 'text-[15px]')} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
