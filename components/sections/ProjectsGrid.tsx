'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import type { Project } from '@/data/projects';

type FilterId = 'all' | 'ai/ml' | 'professional';
type SortId = 'newest' | 'oldest' | 'priority';

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const { language, t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState<FilterId>('all');
  const [sort, setSort] = useState<SortId>('priority');

  const filters: { id: FilterId; label: { en: string; nl: string } }[] = [
    { id: 'all', label: { en: 'All Work', nl: 'Alles' } },
    { id: 'ai/ml', label: { en: 'AI & ML', nl: 'AI & ML' } },
    { id: 'professional', label: { en: 'Web / App', nl: 'Web / App' } },
  ];

  const sorts: { id: SortId; label: string }[] = [
    { id: 'priority', label: 'Featured' },
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
  ];

  const filtered = useMemo(() => {
    let list =
      filter === 'all'
        ? [...projects]
        : projects.filter((p) => p.category === filter);

    if (sort === 'newest') list.sort((a, b) => b.year - a.year || b.date.localeCompare(a.date));
    else if (sort === 'oldest') list.sort((a, b) => a.year - b.year || a.date.localeCompare(b.date));
    else list.sort((a, b) => a.priority - b.priority);

    return list;
  }, [filter, sort, projects]);

  return (
    <section className="min-h-screen py-24 md:py-32 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-6 group"
          >
            <i className="ri-arrow-left-line transition-transform group-hover:-translate-x-1" />
            {t('Back to Home', 'Terug naar Home')}
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text-static">
              {t('All Projects', 'Alle Projecten')}
            </span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl text-base md:text-lg">
            {t(
              `${projects.length} projects spanning AI agents, multi-agent systems, enterprise platforms, and full-stack applications.`,
              `${projects.length} projecten over AI-agents, multi-agent systemen, enterprise platforms en full-stack applicaties.`
            )}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                    active
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white shadow-lg shadow-[var(--primary)]/20'
                      : isDarkMode
                        ? 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/40'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--primary)]/40'
                  )}
                >
                  {t(f.label.en, f.label.nl)}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider">
              {t('Sort', 'Sorteer')}:
            </span>
            {sorts.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  sort === s.id
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <p className="text-sm text-[var(--text-muted)] mb-6 font-mono">
          {filtered.length} {t('projects', 'projecten')}
        </p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter + sort}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/projects/${project.slug}/`}
                  className="group block bento-card overflow-hidden h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <span
                      className={cn(
                        'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm',
                        project.category === 'ai/ml'
                          ? 'bg-[var(--primary)]/80 text-white'
                          : 'bg-[var(--accent-cyan)]/80 text-white'
                      )}
                    >
                      {project.category === 'ai/ml' ? 'AI / ML' : 'Professional'}
                    </span>

                    {/* Featured badge */}
                    {project.featured && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/80 text-white backdrop-blur-sm">
                        Featured
                      </span>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-sm font-semibold text-gray-900">
                        {t('View Case Study', 'Bekijk Case Study')} &rarr;
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {project.date}
                      </span>
                      {project.siteUrl && (
                        <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          Live
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {project.title}
                    </h2>

                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">
                      {language === 'NL'
                        ? project.description.nl.split('. ')[0] + '.'
                        : project.description.en.split('. ')[0] + '.'}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className={cn(
                            'px-2 py-0.5 rounded-md text-[10px] font-medium',
                            isDarkMode
                              ? 'bg-[var(--card-hover)] text-[var(--text-muted)]'
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] text-[var(--text-muted)] self-center">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
