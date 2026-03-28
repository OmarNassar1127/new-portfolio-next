'use client';

import { motion } from 'framer-motion';
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
  .slice(0, 6);

/* ─── Category badge ──────────────────────────────────────────────────── */
function CategoryBadge({ category }: { category: 'ai/ml' | 'professional' }) {
  const isAI = category === 'ai/ml';
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest',
        isAI
          ? 'bg-[rgba(136,115,239,0.15)] text-[var(--primary)]'
          : 'bg-[rgba(0,212,255,0.12)] text-[var(--accent-cyan)]',
      )}
    >
      {isAI ? 'AI / ML' : 'Professional'}
    </span>
  );
}

/* ─── Project card ────────────────────────────────────────────────────── */
function ProjectCard({
  project,
}: {
  project: (typeof featuredProjects)[number];
}) {
  const { language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const description = project.description[lang];
  const firstSentence = description.split('. ')[0] + '.';
  const visibleTechs = project.technologies.slice(0, 4);

  return (
    <div>
      <Link
        href={`/projects/${project.slug}/`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-400 hover:border-[rgba(136,115,239,0.35)] hover:shadow-[0_8px_40px_-12px_rgba(136,115,239,0.25)] hover:-translate-y-1"
        aria-label={`View case study: ${project.title}`}
      >
        {/* Image container */}
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--card-hover)]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          {/* Hover overlay */}
          <div
            className={cn(
              'absolute inset-0 flex items-end justify-end p-4',
              'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
              'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            )}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              View Case Study
              <i className="ri-arrow-right-line text-sm" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <CategoryBadge category={project.category} />
            {project.siteUrl && (
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors duration-200 group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]"
                aria-hidden="true"
              >
                <i className="ri-external-link-line text-[11px]" />
              </span>
            )}
          </div>

          <h3 className="text-base font-bold leading-snug text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--primary)]">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {firstSentence}
          </p>

          {/* Tech tags */}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {visibleTechs.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)] transition-colors duration-200 group-hover:border-[rgba(136,115,239,0.25)]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ─── ProjectsShowcase ────────────────────────────────────────────────── */
export default function ProjectsShowcase() {
  const { t } = useLanguage();
  const gridRef = useSectionInView<HTMLDivElement>();

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {t('Portfolio', 'Portfolio')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            {t('Selected ', 'Geselecteerd ')}
            <span className="gradient-text">
              {t('Work', 'Werk')}
            </span>
          </h2>
          <p className="mt-4 text-base text-[var(--text-muted)] sm:text-lg">
            {t('Projects that define my craft', 'Projecten die mijn vakmanschap definiëren')}
          </p>
        </motion.div>

        {/* Project grid */}
        <div ref={gridRef} className="section-stagger grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/projects"
            className={cn(
              'group inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-7 py-3',
              'text-sm font-semibold text-[var(--text-muted)] transition-all duration-300',
              'hover:border-[var(--primary)] hover:text-[var(--text)] hover:shadow-[0_0_24px_-6px_rgba(136,115,239,0.3)]',
            )}
          >
            {t('View All Projects', 'Alle Projecten Bekijken')}
            <i className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
