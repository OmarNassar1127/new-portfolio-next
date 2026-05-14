'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useSectionInView } from '@/hooks/useSectionInView';

/* ─── Teaching — AI ownership + lessons / webinars ────────────────────── */
export default function Teaching() {
  const { t } = useLanguage();
  const ref = useSectionInView<HTMLDivElement>();

  return (
    <section
      id="teaching"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      {/* Subtle violet wash from the right */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 100% 50%, rgba(124,92,252,0.06) 0%, transparent 70%)',
        }}
      />

      <div ref={ref} className="section-stagger relative z-10 mx-auto max-w-[1100px]">
        {/* Editorial header */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <span className="eyebrow">
            <span className="text-[var(--accent)]">·</span>
            <span>{t('Teaching · AI · Workshops', 'Teaching · AI · Workshops')}</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline">
            {t('Practice over slides', 'Praktijk boven slides')}
          </span>
        </div>

        {/* Big editorial line */}
        <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
          {t('Best taught by ', 'Het best geleerd door ')}
          <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
            {t('doing.', 'doen.')}
          </span>
        </h2>

        <span className="mt-8 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />

        {/* Body — two-column on lg, stacked on mobile */}
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
          {/* AI ownership at Vloto */}
          <div className="lg:col-span-7">
            <p className="text-balance text-lg leading-relaxed text-[var(--text)] sm:text-xl">
              {t("I'm the ", 'Ik ben de ')}
              <span className="font-semibold">
                {t('AI go-to engineer', 'AI go-to engineer')}
              </span>
              {t(
                ' at Vloto. The work is half engineering, half teaching: showing the team how to automate their workflows with the techniques and internal tools I build to compress dev time.',
                ' bij Vloto. Het werk is half engineering, half lesgeven: het team laten zien hoe ze hun workflows automatiseren met de technieken en interne tools die ik bouw om ontwikkeltijd in te korten.',
              )}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              {t(
                'Outside the company I run AI lessons and webinars. Same principle: the only way to teach AI is to build it in front of you. No slide decks.',
                'Buiten het bedrijf geef ik AI-lessen en webinars. Zelfde principe: de enige manier om AI te leren is door het voor je ogen te bouwen. Geen slides.',
              )}
            </p>
          </div>

          {/* Outcome stats — three-row editorial list */}
          <ul className="flex flex-col divide-y divide-[var(--rule)] border-t border-[var(--rule)] lg:col-span-5 lg:border-l lg:border-t-0 lg:divide-y lg:pl-8">
            {[
              {
                value: t('AI go-to', 'AI go-to'),
                label: t('Engineer at Vloto', 'Engineer bij Vloto'),
              },
              {
                value: t('Custom tools', 'Eigen tools'),
                label: t('Cutting team dev time', 'Snijden in dev-tijd'),
              },
              {
                value: t('Lessons · Webinars', 'Lessen · Webinars'),
                label: t('Practice-first format', 'Praktijk-eerst opzet'),
              },
            ].map((item, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex flex-1 flex-col items-end gap-0.5 text-right">
                  <span className="display-serif text-xl font-semibold leading-tight text-[var(--text)] sm:text-2xl">
                    {item.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {item.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
