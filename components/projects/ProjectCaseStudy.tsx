'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import { categoryLabels, type Project } from '@/data/projects';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { MagneticLink, buttonStyles } from '@/components/ui/Button';
import { Heading, Reveal } from '@/components/ui/Reveal';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { categorizeTechs, parseDescription } from '@/lib/utils';

type Props = {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
};

export default function ProjectCaseStudy({ project, prevProject, nextProject }: Props) {
  const { t, language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const { intro, highlights } = parseDescription(project.description[lang]);
  const showcase = project.showcase;

  // Remaining sentences, three to a paragraph.
  const paragraphs: string[] = [];
  for (let i = 0; i < highlights.length; i += 3) {
    paragraphs.push(highlights.slice(i, i + 3).join('. ') + '.');
  }

  return (
    <article className="px-4 pb-24 pt-28 sm:px-6 md:pt-32 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/projects/"
          className="inline-flex h-11 items-center gap-2 rounded-full pr-3 text-sm font-semibold text-body transition-colors hover:text-ink"
        >
          <ArrowLeft weight="bold" aria-hidden="true" className="size-4" />
          {t('All projects', 'Alle projecten')}
        </Link>

        <header className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-mute">
              <span>{project.year}</span>
              <span>{t(categoryLabels[project.category].en, categoryLabels[project.category].nl)}</span>
              {showcase && <span>{showcase.client}</span>}
            </p>
            <Heading as="h1" className="mt-5 type-display text-[clamp(2.75rem,7vw,6rem)]">
              {project.title}
            </Heading>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-[46ch] text-xl leading-snug text-body md:text-2xl">
              {showcase ? t(showcase.summary.en, showcase.summary.nl) : intro}
            </Reveal>
          </div>
          {project.siteUrl && (
            <Reveal delay={0.15} className="lg:col-span-3 lg:justify-self-end">
              <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles('primary')}>
                {t('Visit the live site', 'Bekijk de live site')}
                <ArrowUpRight weight="bold" aria-hidden="true" className="size-4" />
              </a>
            </Reveal>
          )}
        </header>

        {/* Rendered immediately (no in-view reveal) so it is there on load. */}
        <ProjectCover project={project} className="mt-10 aspect-[4/3] rounded-2xl md:mt-12 md:aspect-[2/1]" />

        {showcase && (
          <dl className="mt-12 grid grid-cols-2 gap-y-10 border-b border-hairline pb-12 md:mt-16 md:grid-cols-3">
            {showcase.metrics.map((metric) => (
              <div key={metric.value} className="flex flex-col-reverse gap-3">
                <dt className="text-sm text-mute">{t(metric.label.en, metric.label.nl)}</dt>
                <dd className="type-metric text-[clamp(2.75rem,5vw,4.5rem)]">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            {showcase && (
              <p className="text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug tracking-[-0.015em] text-ink">{intro}</p>
            )}
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0 && !showcase
                    ? 'text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug tracking-[-0.015em] text-ink'
                    : 'mt-6 max-w-[62ch] text-lg leading-relaxed text-body'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-sm font-semibold text-ink">{t('Built with', 'Gebouwd met')}</h2>
            <div className="mt-5 flex flex-col gap-6">
              {Object.entries(categorizeTechs(project.technologies)).map(([group, techs]) => (
                <div key={group}>
                  <h3 className="font-mono text-xs text-mute">{group}</h3>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <li key={tech} translate="no" className="rounded-full bg-surface-2 px-3 py-1.5 text-sm text-body">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section aria-labelledby="case-cta" className="mt-24 rounded-2xl border border-hairline bg-surface px-6 py-14 sm:px-10 md:mt-32 md:py-20">
          <h2 id="case-cta" className="max-w-[18ch] type-display text-[clamp(2.25rem,5vw,4rem)]">
            {t('Need something like this built?', 'Iets vergelijkbaars nodig?')}
          </h2>
          <MagneticLink href={`mailto:${personal.email}`} size="lg" className="mt-10">
            <EnvelopeSimple weight="bold" aria-hidden="true" className="size-5" />
            {t('Email me', 'Mail me')}
          </MagneticLink>
        </section>

        <nav aria-label={t('More projects', 'Meer projecten')} className="mt-6 grid gap-4 md:grid-cols-2">
          {prevProject ? (
            <PagerLink project={prevProject} label={t('Previous', 'Vorige')} direction="prev" />
          ) : (
            <span className="hidden md:block" />
          )}
          {nextProject && <PagerLink project={nextProject} label={t('Next', 'Volgende')} direction="next" />}
        </nav>
      </div>
    </article>
  );
}

function PagerLink({ project, label, direction }: { project: Project; label: string; direction: 'prev' | 'next' }) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className={`group flex min-h-40 flex-col justify-between gap-6 rounded-2xl border border-hairline bg-surface p-6 transition-colors duration-300 hover:border-hairline-strong sm:p-8 ${
        direction === 'next' ? 'md:items-end md:text-right' : ''
      }`}
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-body">
        {direction === 'prev' && <Icon weight="bold" aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-1" />}
        {label}
        {direction === 'next' && <Icon weight="bold" aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />}
      </span>
      <span className="type-title text-[clamp(1.5rem,2.4vw,2.25rem)]">{project.title}</span>
    </Link>
  );
}
