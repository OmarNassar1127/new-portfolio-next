'use client';

import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

/* ─── AnimatedCounter ─────────────────────────────────────────────────── */
function AnimatedCounter({ value }: { value: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? '';
  const suffix = value.replace(/[0-9.]/g, '').replace(prefix, '');

  return (
    <span ref={ref}>
      {prefix}
      {inView ? <CountUp end={numeric} duration={2} separator="," /> : String(numeric)}
      {suffix}
    </span>
  );
}

/* ─── Role cycling text ───────────────────────────────────────────────── */
function RoleCycler({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length);
        setVisible(true);
      }, 280);
    }, 3200);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <span
      className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {roles[index]}
    </span>
  );
}

/* ─── Hero — Split-pane editorial, viewport-fitted ────────────────────── */
export default function Hero() {
  const { language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const roles = personal.roles[lang];

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
      {/* Background — single soft orb + masked grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 grid-backdrop" />
        <div
          className="absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.20] blur-[140px]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, var(--primary) 0%, transparent 45%), radial-gradient(circle at 70% 70%, var(--accent) 0%, transparent 50%)',
          }}
        />
        <div className="hidden md:block absolute bottom-10 right-[8%] h-[280px] w-[280px] rounded-full bg-[var(--accent)] opacity-[0.07] blur-[110px]" />
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

      {/* Main content area — fills remaining viewport */}
      <div className="relative z-10 flex flex-1 items-center px-4 py-6 sm:px-6 lg:py-8">
        <div className="hero-stagger relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {/* Viewfinder marks — desktop only, frames the whole content area */}
          <span className="viewfinder tl hidden lg:block" />
          <span className="viewfinder tr hidden lg:block" />
          <span className="viewfinder bl hidden lg:block" />
          <span className="viewfinder br hidden lg:block" />

          {/* ═══ LEFT: Massive editorial nameplate (cols 1-7) ════════════ */}
          <div className="flex flex-col justify-center text-center lg:col-span-7 lg:text-left">
            {/* Eyebrow */}
            <div className="mb-5 flex justify-center lg:justify-start">
              <span className="eyebrow">
                <span className="text-[var(--accent)]">01</span>
                <span>{lang === 'en' ? 'Engineer · Founder' : 'Ingenieur · Oprichter'}</span>
              </span>
            </div>

            {/* Nameplate */}
            <h1
              className="font-bold leading-[0.88] tracking-tight text-[var(--text)]"
              style={{
                fontSize: 'clamp(2.75rem, 11vw, 7.5rem)',
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

            {/* Role cycler — sits right under the nameplate */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <RoleCycler roles={roles} />
            </div>
          </div>

          {/* ═══ RIGHT: Editorial aside column (cols 8-12) ═══════════════ */}
          <aside className="flex flex-col justify-center gap-6 lg:col-span-5">
            {/* Tagline — lead sentence */}
            <p className="text-balance text-center text-base leading-snug text-[var(--text-muted)] sm:text-lg lg:text-left lg:text-xl">
              {lang === 'en' ? (
                <>
                  I build <span className="font-medium text-[var(--text)]">autonomous AI agents</span> and the systems they run on.{' '}
                  <span className="display-serif-italic font-medium text-[var(--text)]">Production grade. Not demos.</span>
                </>
              ) : (
                <>
                  Ik bouw <span className="font-medium text-[var(--text)]">autonome AI-agenten</span> en de systemen waarop ze draaien.{' '}
                  <span className="display-serif-italic font-medium text-[var(--text)]">Productie-niveau. Geen demo&apos;s.</span>
                </>
              )}
            </p>

            {/* Credibility line — full-stack foundation */}
            <div className="flex flex-col gap-2 border-l-2 border-[var(--accent)] pl-4 text-center lg:text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                {lang === 'en' ? 'Foundation' : 'Fundament'}
              </span>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {lang === 'en' ? (
                  <>
                    Production AI built on{' '}
                    <span className="font-semibold text-[var(--text)]">seven years</span> of full-stack engineering. React,
                    Node, Laravel, Python, then LangChain, CrewAI, and on-premise LLMs.{' '}
                    <span className="display-serif-italic font-medium text-[var(--accent-deep)]">Foundation first. Agents on top.</span>
                  </>
                ) : (
                  <>
                    Productie-AI gebouwd op{' '}
                    <span className="font-semibold text-[var(--text)]">zeven jaar</span> full-stack engineering. React,
                    Node, Laravel, Python, en daarna LangChain, CrewAI en on-premise LLM&apos;s.{' '}
                    <span className="display-serif-italic font-medium text-[var(--accent-deep)]">Fundament eerst. Agenten erbovenop.</span>
                  </>
                )}
              </p>
            </div>

            {/* Stats — vertical list, editorial */}
            <ul className="flex flex-col divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {personal.stats.map((stat) => (
                <li key={stat.value} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {stat.label[lang]}
                  </span>
                  <span className="display-serif text-2xl font-semibold leading-none text-[var(--text)] sm:text-[28px]">
                    <AnimatedCounter value={stat.value} />
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <a
                href="#portfolio"
                className={cn(
                  'group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3',
                  'bg-[var(--text)] font-semibold text-[var(--bg)] text-sm',
                  'transition-all duration-300 hover:bg-[var(--primary)] hover:text-white',
                  'hover:shadow-[0_8px_28px_-6px_rgba(124,92,252,0.5)]',
                  'active:scale-[0.98]',
                )}
              >
                <i className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-0.5" />
                {lang === 'en' ? 'Selected Work' : 'Geselecteerd Werk'}
              </a>

              <a
                href="#contact"
                className={cn(
                  'group inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3',
                  'border-[var(--border-strong)] bg-transparent font-semibold text-[var(--text)] text-sm',
                  'transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent-deep)]',
                  'active:scale-[0.98]',
                )}
              >
                <i className="ri-send-plane-line text-base" />
                {lang === 'en' ? 'Get In Touch' : 'Contact'}
              </a>
            </div>

            {/* Social row */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                {lang === 'en' ? 'Find me' : 'Vind me'}
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      'border border-[var(--border)] text-[var(--text-muted)]',
                      'transition-all duration-300',
                      'hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]',
                    )}
                  >
                    <i className={cn(social.icon, 'text-sm')} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom plate — kinetic ticker handoff */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 pb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--text-subtle)] sm:px-6">
        <span>{lang === 'en' ? 'Scroll' : 'Scroll'}</span>
        <i className="ri-arrow-down-line text-sm floating text-[var(--text-muted)]" />
        <span className="hidden sm:inline">{lang === 'en' ? 'Stack ↓' : 'Stack ↓'}</span>
      </div>
    </section>
  );
}
