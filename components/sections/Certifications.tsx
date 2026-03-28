'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
// motion removed — using CSS animations only
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { certificationsData, type Certification } from '@/data/certifications';

/* ─── Deterministic shuffle (seeded by day so it changes daily) ───────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  const now = new Date();
  let seed = now.getFullYear() * 1000 + Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ─── Card dimensions ─────────────────────────────────────────────────────── */
// Desktop card width. On mobile we use 85vw via CSS — see CertCarouselCard.
const CARD_W_DESKTOP = 340; // px
const CARD_H = 280; // px
const GAP = 24;
const AUTO_SCROLL_SPEED = 4000; // ms between auto-scrolls

/* ─── Inline Google SVG logo ──────────────────────────────────────────────── */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={cn('w-9 h-9', className)} viewBox="0 0 48 48" fill="none">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/* ─── Issuer logo resolver ────────────────────────────────────────────────── */
function IssuerLogo({ cert }: { cert: Certification }) {
  if (cert.logo === 'google') return <GoogleLogo />;
  if (cert.logoPath) {
    return (
      <Image
        src={cert.logoPath}
        alt={cert.issuer}
        width={40}
        height={40}
        className={cn('object-contain', cert.logo === 'anthropic' && 'rounded-lg')}
      />
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-[var(--primary)] to-[var(--accent-cyan)]">
      {cert.issuer.charAt(0)}
    </span>
  );
}

/* ─── Carousel Card ────────────────────────────────────────────────────────── */
function CertCarouselCard({ cert }: { cert: Certification }) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const hasCredential = cert.credentialUrl !== null;

  return (
    <div
      className={cn(
        // On mobile: 85vw wide so one card fills most of the screen with a peek.
        // On sm+ (≥640px): fixed 340px matching the original CARD_W_DESKTOP.
        'group relative flex flex-col overflow-hidden shrink-0 snap-center',
        'rounded-2xl border transition-all duration-300',
        'w-[85vw] sm:w-[340px]',
        isDarkMode
          ? 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-[0_0_30px_-5px_var(--primary-glow)]'
          : 'bg-white border-gray-200 hover:border-[var(--primary)]/30 hover:shadow-xl'
      )}
      style={{ height: CARD_H, minWidth: undefined /* handled by w- classes above */ }}
    >
      {/* Top accent bar */}
      <div className={cn('h-1 w-full bg-gradient-to-r flex-shrink-0', cert.color)} />

      <div className="flex flex-col flex-1 p-5 overflow-hidden">
        {/* Header — fixed height row */}
        <div className="flex items-center justify-between mb-3 h-10">
          <IssuerLogo cert={cert} />
          <span
            className={cn(
              'text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0',
              isDarkMode
                ? 'bg-[var(--card-hover)] text-[var(--text-muted)]'
                : 'bg-gray-100 text-gray-500'
            )}
          >
            {cert.date}
          </span>
        </div>

        {/* Issuer — fixed height */}
        <p className="text-[11px] font-semibold text-[var(--primary)] mb-1 uppercase tracking-wider h-4">
          {cert.issuer}
        </p>

        {/* Title — fixed 2-line height so badges always align */}
        <h3 className="text-sm font-bold text-[var(--text)] leading-snug mb-3 line-clamp-2 h-[2.5rem]">
          {cert.title}
        </h3>

        {/* Skill tags — fixed single row height */}
        {cert.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 overflow-hidden h-[26px]">
            {cert.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap',
                  isDarkMode
                    ? 'bg-[var(--card-hover)] text-[var(--text-muted)]'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {skill}
              </span>
            ))}
            {cert.skills.length > 4 && (
              <span className="text-[10px] text-[var(--text-muted)] self-center">
                +{cert.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Credential link — always at bottom */}
        <div className="mt-auto">
          {hasCredential && (
            <a
              href={cert.credentialUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--primary)] hover:text-[var(--accent-cyan)] transition-colors duration-200 w-fit group/link"
            >
              <i className="ri-external-link-line text-sm group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
              {t('View Credential', 'Toon Certificaat')}
            </a>
          )}
        </div>
      </div>

      {/* Hover glow */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-0',
          'group-hover:opacity-15 transition-opacity duration-500 pointer-events-none',
          'bg-gradient-to-br',
          cert.color
        )}
      />
    </div>
  );
}

/* ─── Main: Certifications Carousel with Auto-Scroll ──────────────────────── */
export default function Certifications() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Shuffle once on mount (stable per day)
  const shuffled = useMemo(() => shuffleArray(certificationsData), []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

    // Update active dot — use actual rendered card width for accuracy
    const cardEl = el.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + GAP : CARD_W_DESKTOP + GAP;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(idx, shuffled.length - 1));
  }, [shuffled.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardEl = el.firstElementChild as HTMLElement | null;
        const cardWidth = cardEl ? cardEl.offsetWidth + GAP : CARD_W_DESKTOP + GAP;
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, AUTO_SCROLL_SPEED);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardEl = el.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + GAP : CARD_W_DESKTOP + GAP;
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  const scrollToCard = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardEl = el.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + GAP : CARD_W_DESKTOP + GAP;
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  return (
    <section id="certifications" className="relative py-20 md:py-28 overflow-hidden bg-[var(--bg)]">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[var(--primary)]/6 rounded-full blur-3xl blob" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--accent-cyan)]/5 rounded-full blur-3xl blob" style={{ animationDelay: '3.5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5',
                  'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white'
                )}
              >
                <i className="ri-award-line" />
                {t('My Achievements', 'Mijn Prestaties')}
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-3">
                <span className="gradient-text-static">{t('Certifications', 'Certificeringen')}</span>
              </h2>

              <p className="text-[var(--text-muted)] max-w-xl text-sm md:text-base leading-relaxed">
                {t(
                  'Professional certifications earned through continuous learning and hands-on practice.',
                  'Professionele certificeringen verdiend door voortdurend leren en hands-on praktijk.'
                )}
              </p>
            </div>

            {/* Carousel arrows — hidden on mobile (swipe instead) */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border',
                  canScrollLeft
                    ? isDarkMode
                      ? 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                    : 'border-transparent opacity-30 cursor-not-allowed'
                )}
              >
                <i className="ri-arrow-left-s-line text-lg" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border',
                  canScrollRight
                    ? isDarkMode
                      ? 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                    : 'border-transparent opacity-30 cursor-not-allowed'
                )}
              >
                <i className="ri-arrow-right-s-line text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          {canScrollLeft && (
            <div
              className={cn(
                'absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 pointer-events-none',
                isDarkMode
                  ? 'bg-gradient-to-r from-[var(--bg)] to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent'
              )}
            />
          )}
          {canScrollRight && (
            <div
              className={cn(
                'absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 pointer-events-none',
                isDarkMode
                  ? 'bg-gradient-to-l from-[var(--bg)] to-transparent'
                  : 'bg-gradient-to-l from-white to-transparent'
              )}
            />
          )}

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mb-4"
            style={{
              gap: GAP,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {shuffled.map((cert) => (
              <CertCarouselCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {shuffled.map((cert, i) => (
            <button
              key={cert.id}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to ${cert.title}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-6 h-2 bg-[var(--primary)]'
                  : cn(
                      'w-2 h-2',
                      isDarkMode
                        ? 'bg-[var(--border)] hover:bg-[var(--primary)]/50'
                        : 'bg-gray-300 hover:bg-[var(--primary)]/50'
                    )
              )}
            />
          ))}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
