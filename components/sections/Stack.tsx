'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useSectionInView } from '@/hooks/useSectionInView';
import { stackData, stackSignature } from '@/data/stack';

/* ─── Section: Stack — editorial categorized kit ──────────────────────── */
export default function Stack() {
  const { t } = useLanguage();
  const ref = useSectionInView<HTMLOListElement>();

  const totalSkills = stackData.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <section
      id="stack"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      {/* Quiet amber wash from the right */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 45% 45% at 100% 50%, rgba(245,121,59,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ════ Editorial header ════════════════════════════════════════ */}
        <header className="mb-10 lg:mb-14">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">
              <span className="text-[var(--accent)]">·</span>
              <span>{t('Stack', 'Stack')}</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline">
              {t(
                `${stackData.length} disciplines · ${totalSkills} tools · 7+ years`,
                `${stackData.length} disciplines · ${totalSkills} tools · 7+ jaar`,
              )}
            </span>
          </div>

          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            {t('The kit, ', 'Het gereedschap, ')}
            <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
              {t('seven years deep.', 'zeven jaar diep.')}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {t(
              'No tribal loyalties. Pick the right tool, ship the thing, move on. Some of these I reach for daily, others sit quietly until the right job. Italic ones are the daily five.',
              'Geen stammenstrijd. Pak het juiste gereedschap, lever het werk op, ga door. Sommige pak ik dagelijks, andere liggen klaar tot het juiste werk. Schuingedrukt zijn de dagelijkse vijf.',
            )}
          </p>
          <span className="mt-8 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        </header>

        {/* ════ Stack rows — 12-col editorial ledger ═══════════════════ */}
        <ol ref={ref} role="list" className="section-stagger">
          {stackData.map((group, idx) => {
            const isLast = idx === stackData.length - 1;
            return (
              <li
                key={group.id}
                className={cn(
                  'grid grid-cols-1 gap-x-8 gap-y-3 py-7 lg:grid-cols-12 lg:gap-x-10 lg:py-8',
                  !isLast && 'border-b border-[var(--rule)]',
                )}
              >
                {/* COL 1-4: Category label + sublabel */}
                <div className="lg:col-span-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text)]">
                      {t(group.label.en, group.label.nl)}
                    </h3>
                  </div>
                  <p className="mt-2 display-serif-italic text-base text-[var(--text-muted)] sm:text-lg">
                    {t(group.sublabel.en, group.sublabel.nl)}
                  </p>
                </div>

                {/* COL 5-12: Skill list, inline with middot separators */}
                <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2 lg:col-span-8">
                  {group.skills.map((skill, j) => (
                    <span key={skill.name} className="flex items-baseline">
                      <span
                        className={cn(
                          skill.highlight
                            ? 'display-serif-italic font-medium text-[var(--accent-deep)]'
                            : 'font-medium text-[var(--text)]',
                          'text-lg sm:text-xl',
                        )}
                      >
                        {skill.name}
                      </span>
                      {j < group.skills.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="mx-2.5 text-base text-[var(--text-subtle)] opacity-60"
                        >
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        {/* ════ Signature row — most reached for ═══════════════════════ */}
        <footer className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--rule)] pt-8">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            {t('Most reached for', 'Meest gebruikt')}
          </span>
          <span aria-hidden="true" className="font-mono text-[10px] text-[var(--text-subtle)]">
            ·
          </span>
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
            {stackSignature.map((name, i) => (
              <span key={name} className="flex items-baseline">
                <span className="display-serif-italic text-lg font-medium text-[var(--accent-deep)] sm:text-xl">
                  {name}
                </span>
                {i < stackSignature.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mx-2 text-base text-[var(--text-subtle)] opacity-60"
                  >
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
