'use client';

import { ArrowUpRight, GithubLogo, Package } from '@phosphor-icons/react';
import { toolPackages, type ToolPackage } from '@/data/tools';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { CopyButton } from '@/components/ui/CopyButton';
import { Heading, Reveal } from '@/components/ui/Reveal';
import { buttonStyles } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/** Two large cards over three small ones. The last spans both columns on tablet so no cell is empty. */
const CELLS = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-2', 'lg:col-span-2', 'md:col-span-2 lg:col-span-2'];

export default function Tools() {
  const { t } = useLanguage();

  return (
    <section id="tools" className="px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Heading className="type-display text-[clamp(2.75rem,7vw,6rem)]">{t('Tools, in the wild.', 'Tools, in het wild.')}</Heading>
        <Reveal as="p" delay={0.1} className="mt-5 max-w-[54ch] text-lg leading-relaxed text-body md:text-xl">
          {t(
            'Five packages, over 5,000 installs. Some came out of work, two came out of trying to find somewhere to live in the Netherlands.',
            'Vijf packages, ruim 5.000 installs. Sommige komen voort uit werk, twee uit het zoeken naar een woning in Nederland.',
          )}
        </Reveal>

        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-6">
          {toolPackages.map((pkg, i) => (
            <Reveal as="li" key={pkg.name} delay={(i % 3) * 0.06} className={cn('flex', CELLS[i])}>
              <PackageCard pkg={pkg} large={i < 2} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10">
          <a href={personal.github} target="_blank" rel="noopener noreferrer" className={buttonStyles('secondary')}>
            <GithubLogo weight="bold" aria-hidden="true" className="size-4" />
            {t('All repositories', 'Alle repositories')}
            <ArrowUpRight weight="bold" aria-hidden="true" className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function PackageCard({ pkg, large }: { pkg: ToolPackage; large: boolean }) {
  const { t } = useLanguage();
  const live = pkg.status === 'live';

  return (
    <article
      className={cn(
        'flex w-full flex-col rounded-2xl border bg-surface p-6 sm:p-8',
        live ? 'border-hairline' : 'border-dashed border-hairline-strong bg-transparent',
      )}
    >
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <span className="inline-flex items-center gap-2 text-mute">
          <Package weight="bold" aria-hidden="true" className="size-4 text-ink" />
          {pkg.version ?? t('Unpublished', 'Niet gepubliceerd')}
        </span>
        {live ? (
          <span className="text-body">
            {pkg.downloads} {t('installs', 'installs')}
          </span>
        ) : (
          <span className="font-medium text-signal-ink">{t('In development', 'In ontwikkeling')}</span>
        )}
      </div>

      <h3 translate="no" className={cn('mt-6 font-mono font-semibold tracking-[-0.03em]', large ? 'text-3xl' : 'text-2xl')}>
        {pkg.name}
      </h3>
      <p className={cn('mt-3 font-medium leading-snug tracking-[-0.015em] text-ink', large ? 'text-xl' : 'text-lg')}>
        {t(pkg.tagline.en, pkg.tagline.nl)}
      </p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">{t(pkg.description.en, pkg.description.nl)}</p>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-2 rounded-2xl bg-surface-2 py-1 pl-4 pr-1">
          <code translate="no" className="min-w-0 flex-1 truncate font-mono text-sm text-ink">
            <span aria-hidden="true" className="select-none text-mute">$ </span>
            {pkg.install}
          </code>
          {live && <CopyButton value={pkg.install} label={t(`Copy install command for ${pkg.name}`, `Kopieer installatiecommando voor ${pkg.name}`)} />}
        </div>

        {live && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <a
              href={pkg.npmUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline decoration-hairline-strong underline-offset-4 transition-[text-decoration-color] hover:decoration-signal"
            >
              npm
              <ArrowUpRight weight="bold" aria-hidden="true" className="size-3.5" />
            </a>
            <a
              href={pkg.ghUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline decoration-hairline-strong underline-offset-4 transition-[text-decoration-color] hover:decoration-signal"
            >
              {t('Source', 'Broncode')}
              <ArrowUpRight weight="bold" aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
