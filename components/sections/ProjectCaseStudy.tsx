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
    // Force scroll to top on mount — bypasses Lenis
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [project.slug]);

  const description =
    language === 'NL' ? project.description.nl : project.description.en;
  const { intro, highlights } = parseDescription(description);
  const techGroups = categorizeTechs(project.technologies);

  return (
    <article className="relative">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative -mt-32 mx-auto max-w-4xl px-6 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-8 group"
          >
            <i className="ri-arrow-left-line transition-transform group-hover:-translate-x-1" />
            {t('Back to Projects', 'Terug naar Projecten')}
          </Link>
        </motion.div>

        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider',
                project.category === 'ai/ml'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-accent-cyan/10 text-accent-cyan'
              )}
            >
              {project.category === 'ai/ml' ? 'AI / ML' : 'Professional'}
            </span>
            <span className="text-sm text-muted font-mono">{project.date}</span>
            {project.siteUrl && (
              <a
                href={project.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <i className="ri-external-link-line" />
                {t('Live Project', 'Live Project')}
              </a>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {project.title}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-8">
            {intro}
          </p>

          {highlights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-primary mb-4">
                {t('Key Highlights', 'Belangrijkste Punten')}
              </h2>
              <ul className="space-y-3">
                {highlights.map((highlight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-muted leading-relaxed">
                      {highlight}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary mb-6">
            {t('Technology Stack', 'Technologie Stack')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(techGroups).map(([category, techs]) => (
              <div
                key={category}
                className="rounded-xl border border-border/50 bg-card/50 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <i
                    className={cn(
                      techIcons[category] || 'ri-tools-line',
                      'text-primary'
                    )}
                  />
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-primary/5 text-xs font-mono text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t border-border/50 pt-8"
        >
          <div className="flex justify-between items-center">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}/`}
                className="group flex items-center gap-3 hover:text-primary transition-colors"
              >
                <i className="ri-arrow-left-line transition-transform group-hover:-translate-x-1" />
                <div className="text-right">
                  <span className="text-xs text-muted block font-mono">
                    {t('Previous', 'Vorige')}
                  </span>
                  <span className="text-sm font-medium">
                    {prevProject.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}/`}
                className="group flex items-center gap-3 hover:text-primary transition-colors text-right"
              >
                <div>
                  <span className="text-xs text-muted block font-mono">
                    {t('Next', 'Volgende')}
                  </span>
                  <span className="text-sm font-medium">
                    {nextProject.title}
                  </span>
                </div>
                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </motion.div>
      </div>
    </article>
  );
}
