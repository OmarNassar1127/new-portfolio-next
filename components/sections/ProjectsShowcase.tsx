'use client';

import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { useLanguage } from '@/hooks/useLanguage';
import { useSectionInView } from '@/hooks/useSectionInView';
import { cn } from '@/lib/utils';

/* ─── Derived data ────────────────────────────────────────────────────── */
const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.priority - b.priority)
  .slice(0, 4);

/* ─── Editorial project row ───────────────────────────────────────────── */
function ProjectRow({
  project,
  index,
}: {
  project: (typeof featuredProjects)[number];
  index: number;
}) {
  const { language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const description = project.description[lang];
  const firstSentence = description.split('. ')[0] + '.';
  const categoryLabel = project.category === 'ai/ml' ? 'AI / ML' : 'Professional';
  const topTechs = project.technologies.slice(0, 3);

  return (
    <li>
      <Link
        href={`/projects/${project.slug}/`}
        aria-label={`View case study: ${project.title}`}
        className="group grid grid-cols-1 items-center gap-x-6 gap-y-4 border-b border-[var(--rule)] py-6 transition-colors duration-200 sm:grid-cols-12 sm:py-8"
      >
        {/* Number — col 1 (desktop) */}
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)] sm:col-span-1">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Thumbnail — col 2-3 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--card)] sm:col-span-2 sm:aspect-square">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        {/* Title + description + meta — col 4-11 */}
        <div className="flex flex-col gap-2 sm:col-span-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            {categoryLabel} · {project.year}
          </span>
          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent-deep)] sm:text-[28px] lg:text-[32px]">
            {project.title}
          </h3>
          <p className="hidden text-sm leading-relaxed text-[var(--text-muted)] sm:block sm:text-[15px]">
            {firstSentence}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
            {topTechs.map((tech, i) => (
              <span key={tech} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                <span>{tech}</span>
                {i < topTechs.length - 1 && <span className="opacity-50">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow — col 12 */}
        <span className="hidden sm:col-span-1 sm:flex sm:justify-end">
          <i
            className={cn(
              'ri-arrow-right-up-line text-2xl text-[var(--text-subtle)]',
              'transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-deep)]',
            )}
          />
        </span>
      </Link>
    </li>
  );
}

/* ─── ProjectsShowcase ────────────────────────────────────────────────── */
export default function ProjectsShowcase() {
  const { t } = useLanguage();
  const listRef = useSectionInView<HTMLOListElement>();

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      {/* Subtle background wash */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(245,121,59,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Heading — editorial */}
        <div className="mb-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">
              <span className="text-[var(--accent)]">03</span>
              <span>{t('Selected Work', 'Geselecteerd Werk')}</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline">
              {t('Case Studies · 04 of many', 'Casestudies · 04 van meer')}
            </span>
          </div>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            {t('Projects that define the ', 'Projecten die het ')}
            <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
              {t('craft', 'vakmanschap')}
            </span>
            {t('.', ' definiëren.')}
          </h2>
          <span className="mt-6 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        </div>

        {/* Project list — editorial index */}
        <ol ref={listRef} className="section-stagger" role="list">
          {featuredProjects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </ol>

        {/* View all link */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            {t('Want more?', 'Meer zien?')}
          </span>
          <Link
            href="/projects"
            className={cn(
              'group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-2.5',
              'font-mono text-[11px] uppercase tracking-[0.18em] font-medium text-[var(--text)]',
              'transition-all duration-300',
              'hover:border-[var(--accent)] hover:text-[var(--accent-deep)]',
            )}
          >
            {t('View all projects', 'Alle projecten')}
            <i className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
