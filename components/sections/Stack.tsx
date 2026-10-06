'use client';

import { stackData, stackSignature } from '@/data/stack';
import { useLanguage } from '@/hooks/useLanguage';
import { Heading, Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

type Tone = 'signal' | 'ink' | 'surface';

/** One cell per stack group, sized by how much lives in it. Order matters: the grid fills in this sequence. */
const ORDER = ['ai', 'languages', 'frontend', 'backend', 'data', 'infra'];
const groups = [...stackData].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

const LAYOUT: Record<string, { cell: string; tone: Tone }> = {
  ai: { cell: 'md:col-span-2 lg:col-span-7 lg:row-span-2', tone: 'signal' },
  languages: { cell: 'lg:col-span-5', tone: 'ink' },
  frontend: { cell: 'lg:col-span-5', tone: 'surface' },
  backend: { cell: 'lg:col-span-4', tone: 'surface' },
  data: { cell: 'lg:col-span-3', tone: 'surface' },
  infra: { cell: 'md:col-span-2 lg:col-span-5', tone: 'surface' },
};

const TONES: Record<Tone, { cell: string; chip: string; daily: string; count: string }> = {
  signal: {
    cell: 'bg-signal text-on-signal',
    chip: 'bg-on-signal/[0.08]',
    daily: 'font-semibold',
    count: 'text-on-signal/70',
  },
  ink: {
    cell: 'bg-ink text-canvas',
    chip: 'bg-canvas/[0.1]',
    daily: 'font-semibold',
    count: 'text-canvas/60',
  },
  surface: {
    cell: 'border border-hairline bg-surface text-ink',
    chip: 'bg-surface-2',
    daily: 'font-semibold text-ink',
    count: 'text-mute',
  },
};

export default function Stack() {
  const { t } = useLanguage();

  return (
    <section id="stack" className="px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Heading className="type-display text-[clamp(2.75rem,7vw,6rem)]">{t('The kit, seven years deep.', 'Het gereedschap, zeven jaar diep.')}</Heading>
        <Reveal as="p" delay={0.1} className="mt-5 max-w-[52ch] text-lg leading-relaxed text-body md:text-xl">
          {t(
            'No tribal loyalties. Pick the right tool, ship the thing, move on. Bold ones are daily drivers.',
            'Geen stammenstrijd. Pak het juiste gereedschap, lever het werk op, ga door. Vetgedrukt pak ik dagelijks.',
          )}
        </Reveal>

        <div className="mt-14 grid gap-3 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {groups.map((group, i) => {
            const layout = LAYOUT[group.id] ?? { cell: 'lg:col-span-4', tone: 'surface' as Tone };
            const tone = TONES[layout.tone];
            return (
              <Reveal
                key={group.id}
                delay={i * 0.06}
                className={cn('flex flex-col rounded-2xl p-6 sm:p-8', layout.cell, tone.cell)}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-title text-[clamp(1.5rem,2.2vw,2rem)]">{t(group.label.en, group.label.nl)}</h3>
                  <span className={cn('font-mono text-xs', tone.count)}>{group.skills.length}</span>
                </div>
                <ul className={cn('mt-6 flex flex-wrap gap-2', layout.tone === 'signal' && 'lg:mt-auto lg:pt-10')}>
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      translate="no"
                      className={cn(
                        'rounded-full px-3 py-1.5 text-sm',
                        tone.chip,
                        skill.highlight ? tone.daily : 'font-normal',
                      )}
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Reveal as="p" className="mt-10 text-lg text-body">
          {t('Most reached for: ', 'Meest gebruikt: ')}
          <span className="font-semibold text-ink" translate="no">
            {stackSignature.join(', ')}
          </span>
          .
        </Reveal>
      </div>
    </section>
  );
}
