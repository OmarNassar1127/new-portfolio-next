'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const CATEGORY_LABELS: Record<Project['category'], { en: string; nl: string }> = {
  'ai/ml': { en: 'AI / ML', nl: 'AI / ML' },
  professional: { en: 'Professional', nl: 'Professioneel' },
};

const CATEGORY_COLORS: Record<Project['category'], string> = {
  'ai/ml': 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  professional: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

/** Returns the first sentence of a description. */
function firstSentence(text: string): string {
  const idx = text.search(/[.!?]/);
  return idx !== -1 ? text.slice(0, idx + 1) : text;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const description = t(project.description.en, project.description.nl);
  const shortDesc = firstSentence(description);
  const visibleTech = project.technologies.slice(0, 4);
  const categoryLabel = t(
    CATEGORY_LABELS[project.category].en,
    CATEGORY_LABELS[project.category].nl
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((p) => ({ ...p, opacity: 0 }));
  }, []);

  return (
    <Link
      href={`/projects/${project.slug}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl',
        'border border-[var(--border)] bg-[var(--card)]',
        'transition-[border-color,box-shadow,transform] duration-300',
        'hover:-translate-y-1 hover:border-[rgba(136,115,239,0.40)]',
        'hover:shadow-[0_8px_32px_-8px_var(--primary-glow),0_24px_48px_-16px_rgba(0,0,0,0.25)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
        className
      )}
    >
      {/* Spotlight glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgba(136,115,239,0.14), transparent 70%)`,
        }}
      />

      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--card-hover)] sm:h-52">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-[rgba(10,15,28,0.72)] backdrop-blur-sm',
            'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          )}
        >
          <span className="flex items-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-white">
            {t('View Case Study', 'Bekijk Case Study')}
            <i className="ri-arrow-right-line" />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
        {/* Category badge */}
        <span
          className={cn(
            'inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
            CATEGORY_COLORS[project.category]
          )}
        >
          {categoryLabel}
        </span>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--primary)]">
          {project.title}
        </h3>

        {/* Short description */}
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {shortDesc}
        </p>

        {/* Tech tags */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-[var(--card-hover)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded-md bg-[var(--card-hover)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
