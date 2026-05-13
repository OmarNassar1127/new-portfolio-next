'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useSectionInView } from '@/hooks/useSectionInView';
import { cn } from '@/lib/utils';

/* ─── npm wordmark icon (brand red) ────────────────────────────────────── */
function NpmIcon({
  className,
  muted = false,
}: {
  className?: string;
  muted?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 27.23 27.23"
      aria-hidden="true"
      className={cn('h-8 w-8', className)}
    >
      <rect
        width="27.23"
        height="27.23"
        rx="3"
        fill={muted ? 'var(--text-subtle)' : '#CB3837'}
      />
      <polygon
        points="5.8 21.75 13.66 21.75 13.66 9.98 17.59 9.98 17.59 21.75 21.52 21.75 21.52 6.05 5.8 6.05 5.8 21.75"
        fill="#fff"
      />
    </svg>
  );
}

/* ─── Package data ─────────────────────────────────────────────────────── */
interface PackageMeta {
  status: 'live' | 'soon';
  index: string;
  name: string;
  version: string | null;
  downloads: string | null;
  tagline: { en: string; nl: string };
  description: { en: string; nl: string };
  meta: string[];
  install: string;
  npmUrl: string | null;
  ghUrl: string | null;
}

const packages: PackageMeta[] = [
  {
    status: 'live',
    index: '01',
    name: 'skillsync-team',
    version: 'v3.0.0',
    downloads: '2k+',
    tagline: {
      en: 'Git-native skill sharing for AI coding agents.',
      nl: 'Git-native skill-uitwisseling voor AI coding agents.',
    },
    description: {
      en: "Skills you build for your AI coding agent normally die on your laptop. SkillSync turns your team's skill library into something Git-native: push yours to a shared repo, pull what your teammates shipped, stay in sync without anyone copy-pasting markdown around.",
      nl: "Skills die je bouwt voor je AI coding agent blijven normaal op je laptop steken. SkillSync maakt van de skill-bibliotheek van je team iets Git-native: push die van jou naar een gedeelde repo, pull wat je teamgenoten hebben gemaakt, alles in sync zonder dat iemand markdown hoeft te kopiëren.",
    },
    meta: ['MIT', 'ESM', 'Node 18+', 'CLI'],
    install: 'npm i -g skillsync-team',
    npmUrl: 'https://www.npmjs.com/package/skillsync-team',
    ghUrl: 'https://github.com/OmarNassar1127/skillsync-team',
  },
  {
    status: 'soon',
    index: '02',
    name: 'featuresync',
    version: null,
    downloads: null,
    tagline: {
      en: 'Developer handoff, without the rebuild.',
      nl: 'Developer-handoff, zonder opnieuw te bouwen.',
    },
    description: {
      en: "Sister tool to SkillSync, with a much bigger ambition: make handoff between developers stop hurting. Pass the actual work — context, agent state, threads-in-progress — so whoever picks up next picks up where you really were, not where the Git branch left them. Quietly in development.",
      nl: "Zustertool van SkillSync, met een veel grotere ambitie: zorgen dat handoff tussen developers niet meer pijn doet. Geef het echte werk door — context, agent-status, lopende threads — zodat wie het overneemt verdergaat waar jij écht was, niet waar de Git-branch hem achterlaat. Stil in ontwikkeling.",
    },
    meta: ['MIT', 'WIP', 'CLI'],
    install: 'npm i -g featuresync   # soon',
    npmUrl: null,
    ghUrl: null,
  },
];

/* ─── Section: Open Source ─────────────────────────────────────────────── */
export default function OpenSource() {
  const { t } = useLanguage();
  const ref = useSectionInView<HTMLOListElement>();

  return (
    <section
      id="tools"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      {/* Quiet violet wash, top-right */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 45% 45% at 100% 0%, rgba(124,92,252,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ════ Editorial header ════════════════════════════════════════ */}
        <header className="mb-10 lg:mb-14">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">
              <span className="text-[var(--accent)]">06</span>
              <span>{t('Open Source', 'Open Source')}</span>
            </span>
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline-flex">
              <NpmIcon className="h-3.5 w-3.5 rounded-[3px]" />
              <span>
                {t(
                  'Published on npm · MIT licensed',
                  'Gepubliceerd op npm · MIT licentie',
                )}
              </span>
            </span>
          </div>

          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            {t('Tools, ', 'Tools, ')}
            <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
              {t('in the wild.', 'in het wild.')}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {t(
              "Built these because shared knowledge kept leaking. Engineers on the same team rebuilding the same skills, hooks, and prompts because nobody had a way to share them. So I made one. Open source on npm.",
              "Gebouwd omdat gedeelde kennis bleef weglekken. Engineers in hetzelfde team bouwden dezelfde skills, hooks en prompts opnieuw omdat niemand een manier had om ze te delen. Dus heb ik er een gemaakt. Open source op npm.",
            )}
          </p>
          <span className="mt-8 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        </header>

        {/* ════ Package cards ═══════════════════════════════════════════ */}
        <ol
          ref={ref}
          role="list"
          className="section-stagger grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {packages.map((pkg) => {
            const isLive = pkg.status === 'live';
            return (
              <li key={pkg.name}>
                <article
                  className={cn(
                    'group relative flex h-full flex-col gap-6 overflow-hidden rounded-xl border bg-[var(--bg-elevated)] p-6 transition-all duration-300 sm:p-8',
                    isLive
                      ? 'border-[var(--rule)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_16px_40px_-20px_rgba(10,11,17,0.25)]'
                      : 'border-dashed border-[var(--rule)]',
                  )}
                >
                  {/* Hatched sweep on the WIP card */}
                  {!isLive && (
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.05]"
                      aria-hidden="true"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(135deg, transparent 0 14px, var(--text) 14px 15px)',
                      }}
                    />
                  )}

                  {/* Status + downloads + corner number */}
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]',
                          isLive ? 'text-[var(--signal-emerald)]' : 'text-[var(--accent)]',
                        )}
                      >
                        {isLive ? (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal-emerald)] opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal-emerald)]" />
                          </span>
                        ) : (
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        )}
                        {isLive
                          ? t('Live on npm', 'Live op npm')
                          : t('Coming soon', 'Binnenkort')}
                      </span>

                      {pkg.downloads && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text)]">
                          <i className="ri-download-2-line text-[12px] text-[var(--accent)]" />
                          {pkg.downloads}{' '}
                          <span className="text-[var(--text-subtle)]">
                            {t('installs', 'installs')}
                          </span>
                        </span>
                      )}
                    </div>

                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-subtle)]"
                    >
                      {pkg.index}
                    </span>
                  </div>

                  {/* Logo + name */}
                  <div className="relative flex items-center gap-4">
                    <NpmIcon
                      muted={!isLive}
                      className="h-10 w-10 rounded-lg shadow-[0_2px_8px_-4px_rgba(0,0,0,0.18)]"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                        {pkg.version ?? t('Unpublished', 'Niet gepubliceerd')}
                      </span>
                      <h3 className="font-mono text-xl font-semibold leading-none tracking-tight text-[var(--text)] sm:text-2xl">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  {/* Tagline + description */}
                  <div className="relative flex flex-col gap-3">
                    <p className="text-balance text-lg leading-snug sm:text-xl">
                      <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
                        {t(pkg.tagline.en, pkg.tagline.nl)}
                      </span>
                    </p>
                    <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
                      {t(pkg.description.en, pkg.description.nl)}
                    </p>
                  </div>

                  {/* Meta strip */}
                  <div className="relative flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                      {t('Spec', 'Spec')} ·
                    </span>
                    {pkg.meta.map((m, i) => (
                      <span key={m} className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-medium text-[var(--text)]">
                          {m}
                        </span>
                        {i < pkg.meta.length - 1 && (
                          <span className="font-mono text-[10px] text-[var(--text-subtle)]">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Install command */}
                  <div className="relative">
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-lg border px-4 py-3',
                        isLive
                          ? 'border-[var(--rule)] bg-[var(--bg)]'
                          : 'border-dashed border-[var(--rule)] bg-[var(--bg)]/60',
                      )}
                    >
                      <i className="ri-terminal-line text-base text-[var(--text-subtle)]" />
                      <code className="flex-1 truncate font-mono text-[12.5px] text-[var(--text)] sm:text-sm">
                        <span className="text-[var(--text-subtle)]">$ </span>
                        {pkg.install}
                      </code>
                    </div>
                  </div>

                  {/* CTA row */}
                  {isLive ? (
                    <div className="relative flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={pkg.npmUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--bg)] transition-all duration-200 hover:bg-[var(--accent-deep)]"
                      >
                        <NpmIcon className="h-3.5 w-3.5 rounded-[3px]" />
                        {t('View on npm', 'Bekijk op npm')}
                        <i className="ri-arrow-right-up-line text-sm" />
                      </a>
                      <a
                        href={pkg.ghUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--rule)] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text)] transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--card)]"
                      >
                        <i className="ri-github-fill text-base" />
                        {t('Source', 'Source')}
                        <i className="ri-arrow-right-up-line text-sm" />
                      </a>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between gap-2 pt-1">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                        <i className="ri-time-line text-base text-[var(--accent)]" />
                        {t('In development', 'In ontwikkeling')}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                        {t('Ships ', 'Verschijnt ')}
                        <span className="text-[var(--text)]">
                          {t('soon', 'binnenkort')}
                        </span>
                      </span>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ol>

        {/* ════ Editorial footer strip ═════════════════════════════════ */}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <NpmIcon className="h-3.5 w-3.5 rounded-[3px]" />
              <span className="text-[var(--text)]">
                {t('2 packages', '2 packages')}
              </span>
              <span className="text-[var(--text-subtle)]">
                · {t('1 live · 1 in dev', '1 live · 1 in dev')}
              </span>
            </span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span className="inline-flex items-center gap-2">
              <i className="ri-download-2-line text-[12px] text-[var(--accent)]" />
              <span className="text-[var(--text)]">2k+</span>
              <span>{t('installs', 'installs')}</span>
            </span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span>{t('MIT licensed', 'MIT licentie')}</span>
          </div>
          <a
            href="https://github.com/OmarNassar1127"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text)] transition-colors hover:text-[var(--accent-deep)]"
          >
            <i className="ri-github-fill text-base" />
            {t('All repositories', 'Alle repositories')}
            <i className="ri-arrow-right-up-line text-sm transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </footer>
      </div>
    </section>
  );
}
