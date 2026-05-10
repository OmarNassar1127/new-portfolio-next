'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useSectionInView } from '@/hooks/useSectionInView';
import { experienceData } from '@/data/experience';

export default function Experience() {
  const { t } = useLanguage();

  // Newest first — career ledger reads top → down through time
  const reversed = [...experienceData].reverse();
  const timelineRef = useSectionInView<HTMLOListElement>();

  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      {/* Subtle warm wash (no rainbow blobs) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(245,121,59,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ════ Editorial header ════════════════════════════════════════ */}
        <header className="mb-14 lg:mb-20">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">
              <span className="text-[var(--accent)]">04</span>
              <span>{t('Career Ledger', 'Carrière Logboek')}</span>
            </span>
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline-flex">
              <span>
                {t(
                  `${experienceData.length} entries · 2017—Present`,
                  `${experienceData.length} regels · 2017—Heden`,
                )}
              </span>
              <span className="opacity-50">·</span>
              <span className="flex items-center gap-1.5 text-[var(--signal-emerald)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal-emerald)] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal-emerald)]" />
                </span>
                {t('Open to full-time', 'Open voor full-time')}
              </span>
            </span>
          </div>
          <h2 className="max-w-5xl text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            {t('From ', 'Van ')}
            <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
              {t('student', 'student')}
            </span>
            {t('. To engineer at ', '. Tot engineer bij ')}
            <a
              href="https://vloto.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="display-serif-italic font-medium text-[var(--accent-deep)] underline decoration-[var(--accent)]/30 underline-offset-[6px] transition-colors hover:decoration-[var(--accent)]"
            >
              Vloto
            </a>
            {t('. To founder of ', '. Tot oprichter van ')}
            <a
              href="https://virelio.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="display-serif-italic font-medium text-[var(--accent-deep)] underline decoration-[var(--accent)]/30 underline-offset-[6px] transition-colors hover:decoration-[var(--accent)]"
            >
              Virelio
            </a>
            {t('. The journey, by year.', '. De reis, per jaar.')}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            <span className="display-serif-italic text-[var(--text)]">
              {t('Open to the right full-time role.', 'Open voor de juiste full-time rol.')}
            </span>
          </p>
          <span className="mt-6 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        </header>

        {/* ════ Career ledger — 12-col rows ═════════════════════════════ */}
        <ol ref={timelineRef} className="section-stagger" role="list">
          {reversed.map((entry, idx) => {
            const title = t(entry.title.en, entry.title.nl);
            const company = t(entry.company.en, entry.company.nl);
            const period = t(entry.period.en, entry.period.nl);
            const description = t(entry.description.en, entry.description.nl);
            const isLast = idx === reversed.length - 1;

            return (
              <li
                key={entry.id}
                className={cn(
                  'group relative grid grid-cols-1 gap-x-8 gap-y-3 py-8 transition-colors duration-300 lg:grid-cols-12 lg:gap-x-10 lg:py-12',
                  !isLast && 'border-b border-[var(--rule)]',
                  entry.current &&
                    'before:absolute before:left-[-1rem] before:top-8 before:h-12 before:w-0.5 before:bg-[var(--accent)] lg:before:left-[-1.25rem] lg:before:top-12',
                )}
              >
                {/* ═══ COL 1-3: Year stamp ════════════════════════════ */}
                <div className="lg:col-span-3">
                  <div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-1">
                    <span
                      className="display-serif font-semibold leading-none text-[var(--text)]"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', letterSpacing: '-0.03em' }}
                    >
                      {period.split('-')[0].replace('Present', 'Now').replace('Nu', 'Nu').trim()}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      —{' '}
                      {period.includes('-')
                        ? period.split('-')[1].trim()
                        : t('single year', 'jaar')}
                    </span>
                  </div>

                  {entry.current && (
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--signal-emerald)]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal-emerald)] opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal-emerald)]" />
                      </span>
                      {t('On duty', 'Actief')}
                    </span>
                  )}
                </div>

                {/* ═══ COL 4-12: Entry body ═══════════════════════════ */}
                <div className="flex flex-col gap-4 lg:col-span-9">
                  {/* Title row */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                      {entry.subtitle}
                    </span>
                    <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-3xl lg:text-[34px]">
                      {title}
                      <span className="text-[var(--text-muted)]">
                        {' '}·{' '}
                        {entry.companyUrl ? (
                          <a
                            href={entry.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="display-serif-italic font-medium text-[var(--accent-deep)] underline decoration-[var(--accent)]/30 underline-offset-4 transition-colors duration-200 hover:decoration-[var(--accent)]"
                          >
                            {company}
                          </a>
                        ) : (
                          <span className="display-serif-italic font-medium text-[var(--text)]">
                            {company}
                          </span>
                        )}
                      </span>
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-base">
                    {description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                      {t('Stack', 'Stack')} ·
                    </span>
                    {entry.technologies.map((tech, i) => (
                      <span key={tech} className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-medium text-[var(--text)]">
                          {tech}
                        </span>
                        {i < entry.technologies.length - 1 && (
                          <span className="font-mono text-[10px] text-[var(--text-subtle)]">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* ════ Editorial footer summary — centered ════════════════════ */}
        <footer className="mt-16 grid grid-cols-3 border-t border-[var(--rule)] pt-10">
          {[
            { value: '7+', label: t('Years in tech', 'Jaar in tech') },
            { value: '3', label: t('Companies built at', 'Bedrijven') },
            { value: '50+', label: t('Projects shipped', 'Projecten opgeleverd') },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                'flex flex-col items-center gap-1.5 text-center',
                i > 0 && 'border-l border-[var(--rule)]',
              )}
            >
              <span className="display-serif text-4xl font-semibold leading-none text-[var(--text)] sm:text-5xl lg:text-6xl">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {stat.label}
              </span>
            </div>
          ))}
        </footer>
      </div>
    </section>
  );
}
