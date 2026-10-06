'use client';

import {
  ArrowRight,
  Article,
  BookOpen,
  Books,
  Browser,
  CalendarCheck,
  Car,
  Cube,
  Database,
  FileText,
  ForkKnife,
  GameController,
  GridNine,
  Headset,
  House,
  Lightning,
  LinkedinLogo,
  LockKey,
  MagicWand,
  Microphone,
  PersonSimple,
  Robot,
  Scan,
  SelectionAll,
  ShieldCheck,
  Ticket,
  UsersThree,
  WhatsappLogo,
  type Icon,
} from '@phosphor-icons/react';
import type { CoverIcon, CoverTone, Project } from '@/data/projects';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

const ICONS: Record<CoverIcon, Icon> = {
  Article,
  BookOpen,
  Books,
  Browser,
  CalendarCheck,
  Car,
  Cube,
  Database,
  FileText,
  ForkKnife,
  GameController,
  GridNine,
  Headset,
  House,
  Lightning,
  LinkedinLogo,
  LockKey,
  MagicWand,
  Microphone,
  PersonSimple,
  Robot,
  Scan,
  SelectionAll,
  ShieldCheck,
  Ticket,
  UsersThree,
  WhatsappLogo,
};

const TONES: Record<CoverTone, { surface: string; accent: string; hero: string }> = {
  ink: { surface: 'bg-[var(--cover-ink)] text-[var(--cover-ink-text)]', accent: 'text-signal', hero: 'text-signal' },
  signal: { surface: 'bg-signal text-on-signal', accent: 'text-on-signal', hero: 'text-on-signal' },
  paper: { surface: 'bg-[var(--cover-paper)] text-ink', accent: 'text-signal-ink', hero: 'text-ink' },
};

/**
 * Editorial project cover: one real number (or a subject), the system flow,
 * and an icon, in one of three tones. Year and client live next to the cover,
 * not on it. Sized with container query units so the
 * same cover works from a 280px hover preview to a full-width banner.
 */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const { t } = useLanguage();
  const { cover } = project;
  const tone = TONES[cover.tone];
  const CoverGlyph = ICONS[cover.icon];

  return (
    <div className={cn('@container relative isolate overflow-hidden', tone.surface, className)}>
      <div className="absolute inset-0 flex flex-col p-[min(7cqw,3.5rem)] transition-transform duration-700 ease-out-expo group-hover:scale-[1.025]">
        <CoverGlyph weight="light" aria-hidden="true" className={cn('size-[min(13cqw,6rem)] shrink-0', tone.accent)} />

        <div className="mt-auto">
          {cover.stat ? (
            <>
              <p className={cn('type-metric text-[min(21cqw,11rem)] leading-[0.82]', tone.hero)}>{cover.stat.value}</p>
              <p className="mt-[min(2.6cqw,1.25rem)] max-w-[75%] text-[max(12px,min(3.5cqw,1.6rem))] font-medium leading-snug tracking-[-0.01em]">
                {t(cover.stat.label.en, cover.stat.label.nl)}
              </p>
            </>
          ) : (
            <p className={cn('type-hero max-w-[90%] text-[min(14cqw,8rem)] leading-[0.9]', tone.hero)}>{cover.subject}</p>
          )}
        </div>

        <ol className="mt-[min(6cqw,2.5rem)] hidden flex-wrap items-center gap-[min(1.4cqw,0.75rem)] @sm:flex" aria-label={t('System flow', 'Systeemflow')}>
          {cover.flow.map((step, i) => (
            <li key={step} className="flex items-center gap-[min(1.4cqw,0.75rem)]">
              {i > 0 && <ArrowRight weight="bold" aria-hidden="true" className="size-[max(10px,min(2.4cqw,1rem))] opacity-60" />}
              <span
                translate="no"
                className="whitespace-nowrap rounded-full border border-current/25 px-[min(2.2cqw,1rem)] py-[min(0.9cqw,0.4rem)] font-mono text-[max(10px,min(2.4cqw,0.95rem))]"
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
