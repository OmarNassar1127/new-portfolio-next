'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn, parseDescription, categorizeTechs } from '@/lib/utils';
import type { Project } from '@/data/projects';

const techIcons: Record<string, string> = {
  Core: 'ri-code-s-slash-line',
  AI: 'ri-robot-2-line',
  Infrastructure: 'ri-server-line',
};

export default function ProjectCaseStudy({
  project,
  prevProject,
  nextProject,
}: {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}) {
  const { language, t } = useLanguage();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    });
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }, 50);
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }, 150);
  }, [project.slug]);

  const description = language === 'NL' ? project.description.nl : project.description.en;
  const { intro, highlights } = parseDescription(description);
  const techGroups = categorizeTechs(project.technologies);
  const categoryLabel = project.category === 'ai/ml' ? 'AI / ML' : 'Professional';
  const dateFmt = new Date(project.date + '-01').toLocaleDateString(
    language === 'NL' ? 'nl-NL' : 'en-US',
    { month: 'short', year: 'numeric' },
  );

  return (
    <article ref={topRef} className="relative bg-[var(--bg)]">
      {/* ════════ MASTHEAD ════════════════════════════════════════════════ */}
      <header className="relative pt-24 lg:pt-28">
        {/* Filing strip */}
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link
            href="/#portfolio"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <i className="ri-arrow-left-line text-sm transition-transform duration-200 group-hover:-translate-x-0.5" />
            {t('Back to Portfolio', 'Terug naar Portfolio')}
          </Link>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--text-subtle)]">
            <span className="hidden sm:inline">{categoryLabel}</span>
            <span className="hidden h-3 w-px bg-[var(--rule)] sm:inline-block" />
            <span>{dateFmt}</span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="mx-auto mt-3 block h-px w-[calc(100%-2rem)] max-w-[1400px] bg-[var(--rule)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-5rem)]"
        />

        {/* Title block */}
        <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-10 lg:pb-16 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12"
          >
            {/* LEFT — Title (cols 1-8) */}
            <div className="lg:col-span-8">
              <span className="eyebrow mb-5">
                <span className="text-[var(--accent)]">
                  {String((project.priority || 0) + 1).padStart(2, '0')}
                </span>
                <span>{t('Case Study', 'Casestudy')}</span>
              </span>

              <h1
                className="font-bold leading-[0.95] tracking-tight text-[var(--text)]"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.035em' }}
              >
                {project.title.split(' ').map((word, i, arr) => {
                  // Italicize last word for editorial accent
                  if (i === arr.length - 1 && arr.length > 1) {
                    return (
                      <span key={i} className="display-serif-italic font-medium text-[var(--accent-deep)]">
                        {' '}{word}
                      </span>
                    );
                  }
                  return <span key={i}>{i === 0 ? word : ` ${word}`}</span>;
                })}
              </h1>
            </div>

            {/* RIGHT — Meta (cols 9-12) */}
            <div className="flex flex-col gap-5 lg:col-span-4 lg:items-end lg:justify-end">
              {project.siteUrl && (
                <a
                  href={project.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 self-start rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:shadow-[0_8px_24px_-6px_rgba(124,92,252,0.5)]"
                >
                  <i className="ri-external-link-line text-base" />
                  {t('Visit Live', 'Bekijk Live')}
                </a>
              )}
              <dl className="flex flex-col gap-3 text-left lg:text-right">
                <div className="flex items-baseline justify-between gap-6 lg:justify-end">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                    {t('Category', 'Categorie')}
                  </dt>
                  <dd className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text)]">
                    {categoryLabel}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 lg:justify-end">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                    {t('Year', 'Jaar')}
                  </dt>
                  <dd className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text)]">
                    {project.year}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 lg:justify-end">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                    {t('Stack Size', 'Stack')}
                  </dt>
                  <dd className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text)]">
                    {project.technologies.length} {t('tools', 'tools')}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ════════ HERO IMAGE — full bleed with editorial frame ════════ */}
      <motion.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1320px"
          />
          {/* Subtle vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 50%, rgba(10,11,17,0.35) 100%)',
            }}
          />
          {/* Corner viewfinders */}
          <span className="viewfinder tl" />
          <span className="viewfinder tr" />
          <span className="viewfinder bl" />
          <span className="viewfinder br" />
        </div>
        <figcaption className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
          <span>
            {t('Fig. 01 ·', 'Afb. 01 ·')} {project.title}
          </span>
          <span>{project.date}</span>
        </figcaption>
      </motion.figure>

      {/* ════════ BODY — 12-col editorial spread ════════════════════════ */}
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12">
          {/* ─── LEFT: Sticky meta (cols 1-3) ────────────────────── */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-8">
              <div>
                <span className="eyebrow mb-3">
                  <span className="text-[var(--accent)]">·</span>
                  <span>{t('Synopsis', 'Samenvatting')}</span>
                </span>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {t(
                    'A practical case study from a production AI engagement.',
                    'Een praktijkgerichte casestudy uit een productie AI-traject.',
                  )}
                </p>
              </div>

              <span className="hidden h-px w-full bg-[var(--rule)] lg:block" aria-hidden="true" />

              <div>
                <span className="eyebrow mb-3">
                  <span className="text-[var(--accent)]">·</span>
                  <span>{t('Role', 'Rol')}</span>
                </span>
                <p className="text-sm font-medium text-[var(--text)]">
                  {t('AI & Backend Engineer', 'AI & Backend Engineer')}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {t('End-to-end design + delivery', 'End-to-end ontwerp + levering')}
                </p>
              </div>
            </div>
          </aside>

          {/* ─── RIGHT: Body content (cols 4-12) ──────────────────── */}
          <div className="lg:col-span-9">
            {/* Drop cap intro paragraph — editorial */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-balance text-xl leading-[1.55] text-[var(--text)] sm:text-2xl"
                style={{ letterSpacing: '-0.012em' }}
              >
                <span
                  className="display-serif float-left mr-3 mt-1 block font-semibold leading-[0.85] text-[var(--accent-deep)]"
                  style={{ fontSize: '4.25em' }}
                >
                  {intro.charAt(0)}
                </span>
                {intro.slice(1)}
              </p>
            </motion.div>

            {/* Pull quote — only if there's a highlight strong enough */}
            {highlights.length > 0 && (
              <motion.figure
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="my-14 border-l-2 border-[var(--accent)] pl-6"
              >
                <blockquote
                  className="display-serif-italic font-medium text-2xl leading-[1.3] text-[var(--text)] sm:text-3xl lg:text-4xl"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  &ldquo;{highlights[0]}&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                  {t('Pull quote · Project Highlight', 'Quote · Project Highlight')}
                </figcaption>
              </motion.figure>
            )}

            {/* Highlights list */}
            {highlights.length > 1 && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="mt-12"
              >
                <header className="mb-6 flex items-end justify-between gap-4">
                  <h2 className="display-serif text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                    {t('Key Outcomes', 'Belangrijkste Resultaten')}
                  </h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                    {String(highlights.length - 1).padStart(2, '0')} {t('items', 'items')}
                  </span>
                </header>
                <span className="block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
                <ul className="mt-4">
                  {highlights.slice(1).map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="group flex items-start gap-5 border-b border-[var(--rule)] py-5"
                    >
                      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[15px] leading-relaxed text-[var(--text)] sm:text-base">
                        {highlight}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Tech stack — clean grid */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="mt-20"
            >
              <header className="mb-6 flex items-end justify-between gap-4">
                <h2 className="display-serif text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                  {t('Stack', 'Stack')}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                  {project.technologies.length} {t('tools', 'tools')}
                </span>
              </header>
              <span className="block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {Object.entries(techGroups).map(([category, techs]) => (
                  <div
                    key={category}
                    className="editorial-card flex flex-col gap-3 p-5"
                  >
                    <div className="flex items-center gap-2">
                      <i
                        className={cn(
                          techIcons[category] || 'ri-tools-line',
                          'text-base text-[var(--accent)]',
                        )}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--text)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* ════════ NAVIGATION — prev / next ═══════════════════════════════ */}
      <nav className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
        <span className="block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}/`}
              className="group editorial-card flex flex-col gap-2 p-6"
            >
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                <i className="ri-arrow-left-line transition-transform duration-200 group-hover:-translate-x-1" />
                {t('Previous Case', 'Vorige Casus')}
              </span>
              <span className="display-serif text-xl font-semibold leading-tight text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent-deep)] sm:text-2xl">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}/`}
              className="group editorial-card flex flex-col gap-2 p-6 md:items-end md:text-right"
            >
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)]">
                {t('Next Case', 'Volgende Casus')}
                <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <span className="display-serif text-xl font-semibold leading-tight text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent-deep)] sm:text-2xl">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>
    </article>
  );
}
