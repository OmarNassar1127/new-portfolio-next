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
      setVisible(false); // fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length);
        setVisible(true); // fade in with new text
      }, 300);
    }, 3000);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <div className="flex h-[38px] items-center justify-center sm:h-[44px]">
      <span
        className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent-cyan)] to-[var(--primary)] bg-clip-text text-lg font-semibold text-transparent sm:text-xl transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {roles[index]}
      </span>
    </div>
  );
}

/* ─── Hero Section — NO Framer Motion ─────────────────────────────────── */
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4 pb-24 pt-24 sm:px-6"
    >
      {/* Background — pure CSS, no JS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 right-[5%] h-[480px] w-[480px] rounded-full bg-[var(--primary)] opacity-[0.13] blur-[120px]" />
        <div className="absolute top-[35%] -left-24 h-[380px] w-[380px] rounded-full bg-[var(--accent-cyan)] opacity-[0.09] blur-[110px]" />
        <div className="hidden md:block absolute bottom-16 right-[15%] h-[320px] w-[320px] rounded-full bg-[var(--accent-pink)] opacity-[0.08] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Content — CSS staggered entrance */}
      <div className="relative z-10 mx-auto w-full max-w-5xl hero-stagger">
        {/* Greeting */}
        <p className="mb-5 text-center font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {lang === 'en' ? "Hello, I'm" : 'Hallo, ik ben'}
        </p>

        {/* Name */}
        <h1
          className="text-center font-sans font-bold leading-[0.95] tracking-tight text-[var(--text)]"
          style={{ fontSize: 'clamp(3rem, 10vw, 120px)', letterSpacing: '-0.02em' }}
        >
          Omar <span className="gradient-text-static">Nassar</span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-center text-xl font-medium text-[var(--text-muted)] md:text-2xl">
          {personal.tagline[lang]}
        </p>

        {/* Role cycler */}
        <div className="mt-4">
          <RoleCycler roles={roles} />
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {personal.stats.map((stat) => (
            <div
              key={stat.value}
              className={cn(
                'glass flex flex-col items-center gap-1 rounded-2xl p-4 text-center sm:p-5',
                'border border-[var(--border)]',
              )}
            >
              <span className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
                <AnimatedCounter value={stat.value} />
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
                {stat.label[lang]}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
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
        </div>

        {/* Social links */}
        <div className="mt-10 flex items-center justify-center gap-5">
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
        </div>
      </div>

      {/* Scroll indicator — pure CSS animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 floating" aria-hidden="true">
        <i className="ri-arrow-down-line text-2xl text-[var(--text-muted)]" />
      </div>
    </section>
  );
}
