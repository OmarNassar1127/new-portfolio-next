'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { projects, type Project } from '@/data/projects';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { Heading, Reveal } from '@/components/ui/Reveal';
import WorkIndex from '@/components/sections/WorkIndex';

const featured = projects
  .filter((p): p is Project & { showcase: NonNullable<Project['showcase']> } => p.featured && !!p.showcase)
  .sort((a, b) => a.priority - b.priority);

export default function Work() {
  const { t } = useLanguage();
  const stackRef = useRef<HTMLOListElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduce = usePrefersReducedMotion();
  const stacked = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="portfolio" className="px-4 pt-28 sm:px-6 md:pt-40 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-4xl">
          <Heading className="type-display text-[clamp(2.75rem,7.5vw,6.5rem)]">
            {t('Selected work', 'Geselecteerd werk')}
          </Heading>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-[44ch] text-lg text-body md:text-xl">
            {t('Four systems in production, and what they delivered.', 'Vier systemen in productie, en wat ze opleverden.')}
          </Reveal>
        </header>

        <ol ref={stackRef} className="mt-14 flex flex-col gap-5 md:mt-20 md:gap-0">
          {featured.map((project, i) => (
            <WorkCard
              key={project.slug}
              project={project}
              index={i}
              total={featured.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </ol>

        <WorkIndex />
      </div>
    </section>
  );
}

function WorkCard({
  project,
  index,
  total,
  progress,
  stacked,
}: {
  project: Project & { showcase: NonNullable<Project['showcase']> };
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const { t } = useLanguage();
  const { showcase } = project;

  // Each card shrinks a little more than the one above it as the stack scrolls
  // on, so the deck reads as physical depth. The last card stays full size.
  const depth = total - 1 - index;
  const scale = useTransform(progress, [index / total, 1], [1, 1 - depth * 0.045]);
  const shade = useTransform(progress, [index / total, 1], [0, depth * 0.14]);

  return (
    // Sticky inside the list, so every card stays pinned while the next one
    // slides over it. The bottom margin is dwell time: each card sits fully
    // visible for a beat before it gets covered.
    <li
      className="md:sticky md:mb-[32dvh] md:last:mb-0"
      style={{ zIndex: index + 1, top: `calc(11dvh + ${index * 1.25}rem)` }}
    >
      <motion.article
        style={stacked ? { scale } : undefined}
        className="group relative flex w-full origin-top flex-col overflow-hidden rounded-2xl border border-hairline bg-surface has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-signal md:grid md:h-[min(74dvh,680px)] md:grid-cols-12"
      >
        <div className="flex flex-col p-6 sm:p-8 md:col-span-5 md:p-10 lg:p-12">
          <p className="flex items-center gap-4 font-mono text-xs text-mute">
            <span>{project.year}</span>
            <span>{showcase.client}</span>
          </p>

          <h3 className="mt-5 type-title text-[clamp(1.75rem,2.9vw,2.75rem)]">
            <Link
              href={`/projects/${project.slug}/`}
              className="outline-none after:absolute after:inset-0 after:z-[2] after:content-['']"
            >
              {project.title}
            </Link>
          </h3>

          <p className="mt-4 max-w-[40ch] text-body">{t(showcase.summary.en, showcase.summary.nl)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:mt-auto md:pt-8 lg:grid-cols-3">
            {showcase.metrics.map((metric) => (
              <div key={metric.value} className="flex flex-col-reverse gap-2">
                <dt className="text-sm leading-snug text-mute">{t(metric.label.en, metric.label.nl)}</dt>
                <dd className="type-metric text-[clamp(2rem,3.4vw,3.25rem)] text-ink">{metric.value}</dd>
              </div>
            ))}
          </dl>

          <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            {t('Read the case study', 'Lees de case study')}
            <ArrowUpRight
              weight="bold"
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>

        <ProjectCover
          project={project}
          className="order-first aspect-[4/3] md:order-none md:col-span-7 md:aspect-auto md:h-full"
        />

        {stacked && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: shade }}
            className="pointer-events-none absolute inset-0 z-[3] bg-canvas"
          />
        )}
      </motion.article>
    </li>
  );
}
