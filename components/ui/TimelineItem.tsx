'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import type { ExperienceEntry } from '@/data/experience';

interface TimelineItemProps {
  entry: ExperienceEntry;
  index: number;
  isLast: boolean;
}

export function TimelineItem({ entry, index, isLast }: TimelineItemProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: '-8% 0px',
  });

  // On desktop, alternate left/right. On mobile always slide from left.
  const slideX = index % 2 === 0 ? -32 : 32;

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-8">
      {/* ── Vertical connector line ──────────────────────────── */}
      {!isLast && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-[23px] top-12 bottom-0 w-px',
            entry.current
              ? 'bg-gradient-to-b from-[var(--primary)] to-[var(--primary)]/20'
              : 'border-l border-dashed border-[var(--border)]'
          )}
        />
      )}

      {/* ── Year badge + icon ────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
        {/* Circular icon */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'border-2 border-[var(--border)] bg-[var(--card)]',
            'shadow-[0_0_0_4px_var(--bg)]',
            entry.current && 'border-[var(--primary)] shadow-[0_0_0_4px_var(--bg),0_0_16px_var(--primary-glow)]'
          )}
        >
          <Image
            src={entry.icon}
            alt={entry.subtitle}
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
        </div>

        {/* Year label */}
        <span className="whitespace-nowrap rounded-full bg-[var(--card)] px-2 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-muted)] border border-[var(--border)]">
          {entry.year}
        </span>
      </div>

      {/* ── Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: slideX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideX }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.05 }}
        className={cn(
          'mb-10 flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)]',
          'p-5 transition-[border-color,box-shadow] duration-300',
          'hover:border-[rgba(136,115,239,0.30)] hover:shadow-[0_4px_24px_-8px_var(--primary-glow)]'
        )}
      >
        {/* Header row */}
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            {/* "Current" badge */}
            {entry.current && (
              <span className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
                  aria-hidden="true"
                />
                {t('Current', 'Huidig')}
              </span>
            )}

            <h3 className="text-base font-semibold text-[var(--text)]">
              {t(entry.title.en, entry.title.nl)}
            </h3>
            <p className="text-sm font-medium text-[var(--primary)]">
              {t(entry.company.en, entry.company.nl)}
            </p>
          </div>

          {/* Period */}
          <span className="shrink-0 rounded-lg bg-[var(--card-hover)] px-2.5 py-1 text-xs font-mono text-[var(--text-muted)] border border-[var(--border)]">
            {t(entry.period.en, entry.period.nl)}
          </span>
        </div>

        {/* Subtitle */}
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {entry.subtitle}
        </p>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">
          {t(entry.description.en, entry.description.nl)}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {entry.technologies.map((tech) => (
            <span
              key={tech}
              className={cn(
                'rounded-md px-2 py-0.5 text-xs',
                'bg-[var(--card-hover)] text-[var(--text-muted)]',
                'border border-[var(--border)]'
              )}
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
