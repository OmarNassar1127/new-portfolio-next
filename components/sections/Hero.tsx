'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

/* ─── AnimatedCounter ─────────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix }: { value: string; suffix?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? '';
  const extractedSuffix = suffix ?? value.replace(/[0-9.]/g, '').replace(prefix, '');

  return (
    <span ref={ref}>
      {prefix}
      {inView ? (
        <CountUp end={numeric} duration={2} separator="," />
      ) : (
        '0'
      )}
      {extractedSuffix}
    </span>
  );
}

/* ─── Blob background ─────────────────────────────────────────────────── */
function BackgroundBlobs() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Primary purple blob — static on mobile to avoid animation jank */}
      <div
        className="absolute -top-32 right-[5%] h-[480px] w-[480px] rounded-full bg-[var(--primary)] opacity-[0.13] blur-[120px]"
        style={isMobile ? undefined : { animation: 'blob 14s ease-in-out infinite' }}
      />
      {/* Cyan blob */}
      <div
        className="absolute top-[35%] -left-24 h-[380px] w-[380px] rounded-full bg-[var(--accent-cyan)] opacity-[0.09] blur-[110px]"
        style={isMobile ? undefined : { animation: 'blob 18s ease-in-out infinite', animationDelay: '3s' }}
      />
      {/* Pink blob — hidden on mobile to reduce paint cost */}
      {!isMobile && (
        <div
          className="absolute bottom-16 right-[15%] h-[320px] w-[320px] rounded-full bg-[var(--accent-pink)] opacity-[0.08] blur-[100px]"
          style={{ animation: 'blob 22s ease-in-out infinite', animationDelay: '6s' }}
        />
      )}
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}

/* ─── Role cycling text ───────────────────────────────────────────────── */
function RoleCycler({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Slower cycle on mobile to reduce re-render pressure
    const interval = isMobile ? 4000 : 3000;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, interval);
    return () => clearInterval(id);
  }, [roles.length, isMobile]);

  return (
    <div className="relative flex h-[38px] items-center justify-center overflow-hidden sm:h-[44px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={isMobile ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={isMobile ? { duration: 0.3 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          className="absolute bg-gradient-to-r from-[var(--primary)] via-[var(--accent-cyan)] to-[var(--primary)] bg-clip-text text-lg font-semibold text-transparent sm:text-xl"
          style={{ backgroundSize: '200% 100%' }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ─── Stat card ───────────────────────────────────────────────────────── */
function StatCard({ stat, lang }: { stat: (typeof personal.stats)[number]; lang: 'en' | 'nl' }) {
  return (
    <div
      className={cn(
        'glass flex flex-col items-center gap-1 rounded-2xl p-4 text-center sm:p-5',
        'border border-[var(--border)] transition-all duration-300',
        'hover:border-[rgba(136,115,239,0.35)] hover:shadow-[0_0_28px_-6px_rgba(136,115,239,0.2)]',
      )}
    >
      <span className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
        <AnimatedCounter value={stat.value} />
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
        {stat.label[lang]}
      </span>
    </div>
  );
}

/* ─── Scroll chevron ──────────────────────────────────────────────────── */
function ScrollChevron() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={isMobile ? {} : { y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <i className="ri-arrow-down-line text-2xl text-[var(--text-muted)]" />
    </motion.div>
  );
}

/* ─── Hero Section ────────────────────────────────────────────────────── */
export default function Hero() {
  const { language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const roles = personal.roles[lang];
  const isMobile = useMediaQuery('(max-width: 768px)');

  const socialLinks = [
    { href: personal.github, icon: 'ri-github-fill', label: 'GitHub' },
    { href: personal.linkedin, icon: 'ri-linkedin-fill', label: 'LinkedIn' },
    { href: personal.twitter, icon: 'ri-twitter-fill', label: 'Twitter' },
    { href: `mailto:${personal.email}`, icon: 'ri-mail-line', label: 'Email' },
  ];

  /* stagger helpers — on mobile, fade only with no y offset and no stagger delay */
  const fadeUp = (delay: number) => ({
    initial: isMobile ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: isMobile ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: isMobile
      ? { duration: 0.3 }
      : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: isMobile ? { duration: 0.3 } : { duration: 0.6, delay },
  });

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4 pb-24 pt-24 sm:px-6"
    >
      <BackgroundBlobs />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Greeting label */}
        <motion.p
          {...fadeUp(0)}
          className="mb-5 text-center font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]"
        >
          {lang === 'en' ? 'Hello, I\'m' : 'Hallo, ik ben'}
        </motion.p>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-center font-sans font-bold leading-[0.95] tracking-tight text-[var(--text)]"
          style={{
            fontSize: 'clamp(3rem, 10vw, 120px)',
            letterSpacing: '-0.02em',
          }}
        >
          Omar{' '}
          <span className="gradient-text">Nassar</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-center text-xl font-medium text-[var(--text-muted)] md:text-2xl"
        >
          {personal.tagline[lang]}
        </motion.p>

        {/* Role cycler */}
        <motion.div {...fadeUp(0.3)} className="mt-4">
          <RoleCycler roles={roles} />
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
        >
          {personal.stats.map((stat) => (
            <StatCard key={stat.value} stat={stat} lang={lang} />
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          {/* Primary: View My Work */}
          <a
            href="#portfolio"
            className={cn(
              'group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5',
              'bg-[var(--primary)] font-semibold text-white text-sm sm:w-auto',
              'shadow-[0_0_24px_-4px_rgba(136,115,239,0.5)]',
              'transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_-4px_rgba(136,115,239,0.7)]',
              'active:scale-[0.98]',
            )}
          >
            <i className="ri-briefcase-4-line text-base" />
            {lang === 'en' ? 'View My Work' : 'Bekijk Mijn Werk'}
          </a>

          {/* Secondary: Get In Touch */}
          <a
            href="#contact"
            className={cn(
              'group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-7 py-3.5',
              'bg-transparent font-semibold text-[var(--text)] text-sm sm:w-auto',
              'transition-all duration-300 hover:border-[var(--primary)] hover:bg-[rgba(136,115,239,0.07)]',
              'active:scale-[0.98]',
            )}
          >
            <i className="ri-send-plane-line text-base" />
            {lang === 'en' ? 'Get In Touch' : 'Neem Contact Op'}
          </a>

          {/* Tertiary: Download CV */}
          <a
            href="/cv/Omar-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group relative inline-flex items-center gap-2 px-4 py-2',
              'font-medium text-sm text-[var(--text-muted)]',
              'transition-colors duration-300 hover:text-[var(--text)]',
            )}
          >
            <span
              className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
            {/* <i className="ri-download-2-line text-base transition-transform duration-300 group-hover:-translate-y-0.5" />
            Download CV
            <i className="ri-arrow-right-up-line text-xs opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> */}
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          {...fadeIn(0.7)}
          className="mt-10 flex items-center justify-center gap-5"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                'border border-[var(--border)] text-[var(--text-muted)]',
                'transition-all duration-300',
                'hover:border-[rgba(136,115,239,0.4)] hover:text-[var(--primary)] hover:shadow-[0_0_14px_-3px_rgba(136,115,239,0.35)]',
              )}
            >
              <i className={cn(social.icon, 'text-lg')} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollChevron />
    </section>
  );
}
