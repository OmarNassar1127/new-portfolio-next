'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { categoryLabels, projects, type Project } from '@/data/projects';
import { useLanguage } from '@/hooks/useLanguage';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { buttonStyles } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Category = 'all' | Project['category'];
type Sort = 'featured' | 'newest' | 'oldest';
type State = { category: Category; sort: Sort; query: string };

const DEFAULT_STATE: State = { category: 'all', sort: 'featured', query: '' };
const years = projects.map((p) => p.year);

/** Reads filter state from the URL so every view is linkable (and ?q= powers the JSON-LD SearchAction). */
export default function ProjectsArchive() {
  const params = useSearchParams();
  const category = params.get('category');
  const sort = params.get('sort');

  const state: State = {
    category: category === 'ai/ml' || category === 'professional' ? category : 'all',
    sort: sort === 'newest' || sort === 'oldest' ? sort : 'featured',
    query: params.get('q') ?? '',
  };

  const setParam = (key: 'category' | 'sort' | 'q', value: string | null) => {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  };

  return <ProjectsArchiveView state={state} onChange={setParam} />;
}

/** Static first paint (also the Suspense fallback): the full, unfiltered archive. */
export function ProjectsArchiveView({
  state = DEFAULT_STATE,
  onChange,
}: {
  state?: State;
  onChange?: (key: 'category' | 'sort' | 'q', value: string | null) => void;
}) {
  const { t, language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const needle = state.query.trim().toLowerCase();
  const search = useRef<HTMLInputElement>(null);

  const visible = projects
    .filter((p) => state.category === 'all' || p.category === state.category)
    .filter(
      (p) =>
        !needle ||
        p.title.toLowerCase().includes(needle) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(needle)) ||
        p.description[lang].toLowerCase().includes(needle),
    )
    .sort((a, b) => {
      if (state.sort === 'newest') return b.date.localeCompare(a.date);
      if (state.sort === 'oldest') return a.date.localeCompare(b.date);
      return a.priority - b.priority;
    });

  const filters: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: t('All', 'Alles'), count: projects.length },
    ...(['ai/ml', 'professional'] as const).map((id) => ({
      id,
      label: t(categoryLabels[id].en, categoryLabels[id].nl),
      count: projects.filter((p) => p.category === id).length,
    })),
  ];

  return (
    <div className="px-4 pb-28 pt-36 sm:px-6 md:pb-40 md:pt-44 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="type-display text-[clamp(3rem,8vw,7rem)]">{t('All projects', 'Alle projecten')}</h1>
        <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-body md:text-xl">
          {t(
            `${projects.length} projects across AI systems and web & app work, from ${Math.min(...years)} to ${Math.max(...years)}.`,
            `${projects.length} projecten in AI-systemen en web & app, van ${Math.min(...years)} tot ${Math.max(...years)}.`,
          )}
        </p>

        <div className="mt-12 flex flex-col gap-4 border-y border-hairline py-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={t('Filter by category', 'Filter op categorie')} className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const active = state.category === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  disabled={!onChange}
                  aria-pressed={active}
                  onClick={() => onChange?.('category', filter.id === 'all' ? null : filter.id)}
                  className={cn(
                    'inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200',
                    active ? 'bg-ink text-canvas' : 'bg-surface-2 text-body hover:text-ink',
                  )}
                >
                  {filter.label}
                  <span className={cn('font-mono text-xs tabular-nums', active ? 'text-canvas/70' : 'text-mute')}>{filter.count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex items-center">
              <span className="sr-only">{t('Search projects', 'Zoek projecten')}</span>
              <MagnifyingGlass weight="bold" aria-hidden="true" className="pointer-events-none absolute left-4 size-4 text-mute" />
              <input
                ref={search}
                type="search"
                name="q"
                defaultValue={state.query}
                disabled={!onChange}
                onChange={(event) => onChange?.('q', event.target.value || null)}
                placeholder={t('Search projects…', 'Zoek projecten…')}
                autoComplete="off"
                spellCheck={false}
                className="h-11 w-full rounded-full border border-hairline-strong bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-mute focus-visible:border-ink sm:w-64"
              />
            </label>
            <label className="flex items-center gap-3 text-sm text-body">
              {t('Sort', 'Sorteer')}
              <select
                name="sort"
                value={state.sort}
                disabled={!onChange}
                onChange={(event) => onChange?.('sort', event.target.value === 'featured' ? null : event.target.value)}
                className="h-11 rounded-full border border-hairline-strong bg-surface px-4 text-sm font-semibold text-ink"
              >
                <option value="featured">{t('Featured', 'Uitgelicht')}</option>
                <option value="newest">{t('Newest', 'Nieuwste')}</option>
                <option value="oldest">{t('Oldest', 'Oudste')}</option>
              </select>
            </label>
          </div>
        </div>

        <p aria-live="polite" className="mt-6 font-mono text-xs text-mute">
          {t(`${visible.length} projects`, `${visible.length} projecten`)}
        </p>

        {visible.length > 0 ? (
          <ul className="mt-6 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <li key={project.slug}>
                <ArchiveCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-hairline-strong px-6 py-20 text-center">
            <p className="type-title text-2xl">{t(`Nothing matches “${state.query}”.`, `Niets gevonden voor “${state.query}”.`)}</p>
            <p className="mt-3 text-body">{t('Try a technology like “Laravel” or “RAG”.', 'Probeer een technologie zoals “Laravel” of “RAG”.')}</p>
            <button
              type="button"
              onClick={() => {
                if (search.current) search.current.value = '';
                window.history.replaceState(null, '', window.location.pathname);
              }}
              className={cn(buttonStyles('secondary'), 'mt-8')}
            >
              {t('Clear filters', 'Filters wissen')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ArchiveCard({ project }: { project: Project }) {
  const { t, language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';
  const firstSentence = project.description[lang].split('. ')[0] + '.';

  return (
    <article className="group relative has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-signal">
      <ProjectCover project={project} className="aspect-[4/3] rounded-2xl" />
      <p className="mt-5 flex gap-4 font-mono text-xs text-mute">
        <span>{project.year}</span>
        <span>{t(categoryLabels[project.category].en, categoryLabels[project.category].nl)}</span>
      </p>
      <h2 className="mt-2 type-title text-[1.625rem]">
        <Link href={`/projects/${project.slug}/`} className="outline-none after:absolute after:inset-0 after:content-['']">
          {project.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-body">{firstSentence}</p>
    </article>
  );
}
