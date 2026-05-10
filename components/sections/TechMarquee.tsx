'use client';

import { useLanguage } from '@/hooks/useLanguage';

const stack = [
  'Anthropic Claude',
  'OpenAI GPT',
  'LangChain',
  'LangGraph',
  'CrewAI',
  'RAG Architectures',
  'Pinecone',
  'Qdrant',
  'On-Prem LLMs',
  'Ollama',
  'Python',
  'FastAPI',
  'Node.js',
  'Next.js',
  'React',
  'TypeScript',
  'Laravel',
  'Supabase',
  'Postgres',
  'Docker',
  'Azure',
  'AWS',
  'Playwright',
  'Tailwind',
];

/* ─── TechMarquee — kinetic horizontal ticker ──────────────────────── */
export default function TechMarquee() {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t('Technology stack', 'Technologie stack')}
      className="relative isolate overflow-hidden border-y border-[var(--rule)] bg-[var(--bg)] py-5"
    >
      {/* Edge fade masks so the line dissolves at the edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent"
        aria-hidden="true"
      />

      <div className="marquee-track">
        {/* Render the list twice for seamless loop */}
        {[0, 1].map((dup) => (
          <ul key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
            {stack.map((tech, i) => (
              <li key={`${dup}-${tech}`} className="flex shrink-0 items-center gap-7 px-7">
                <span className="display-serif-italic text-[28px] font-medium text-[var(--text)] sm:text-[34px]">
                  {tech}
                </span>
                {i < stack.length - 1 || dup === 0 ? (
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
