'use client';

import { ArrowUpRight, Plus } from '@phosphor-icons/react';
import { experienceData } from '@/data/experience';
import { useLanguage } from '@/hooks/useLanguage';
import { Heading } from '@/components/ui/Reveal';

/** Career ledger, newest first. Native <details> so it works without JS and with a keyboard. */
export default function Journey() {
  const { t } = useLanguage();
  const entries = [...experienceData].reverse();

  return (
    <section id="journey" className="px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Heading className="max-w-[20ch] type-display text-[clamp(2.5rem,6vw,5rem)]">
          {t('From student to engineer at Vloto and founder of Virelio.', 'Van student tot engineer bij Vloto en oprichter van Virelio.')}
        </Heading>

        <div className="mt-14 divide-y divide-hairline border-y border-hairline md:mt-20">
          {entries.map((entry, i) => {
            const company = t(entry.company.en, entry.company.nl);
            return (
              <details key={entry.id} name="journey" open={i === 0} className="group">
                <summary className="grid cursor-pointer list-none grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7 transition-colors md:py-9 [&:hover_.row-title]:text-signal-ink">
                  <span className="col-span-10 font-mono text-xs text-mute md:col-span-2 md:text-sm">
                    {t(entry.period.en, entry.period.nl)}
                  </span>
                  <span className="col-span-2 row-span-2 flex justify-end self-center md:order-last md:col-span-1 md:row-span-1">
                    <span className="flex size-10 items-center justify-center rounded-full border border-hairline transition-[background-color,border-color] group-open:border-ink group-open:bg-ink group-open:text-canvas">
                      <Plus weight="bold" aria-hidden="true" className="size-4 transition-transform duration-300 ease-out-expo group-open:rotate-45" />
                    </span>
                  </span>
                  <span className="col-span-10 md:col-span-6">
                    <span className="row-title type-title text-[clamp(1.5rem,2.6vw,2.25rem)] transition-colors duration-200">
                      {t(entry.title.en, entry.title.nl)}
                    </span>{' '}
                    <span className="whitespace-nowrap text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-mute">
                      {company}
                    </span>
                  </span>
                  <span className="hidden text-sm text-body md:col-span-3 md:block">
                    {entry.current ? <span className="font-medium text-signal-ink">{t('Current', 'Huidig')}</span> : entry.subtitle}
                  </span>
                </summary>

                <div className="detail-body grid grid-cols-12 gap-x-4 pb-10 md:pb-12">
                  <div className="col-span-12 md:col-span-7 md:col-start-3">
                    <p className="max-w-[62ch] text-lg leading-relaxed text-body">{t(entry.description.en, entry.description.nl)}</p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('Stack', 'Stack')}>
                      {entry.technologies.map((tech) => (
                        <li key={tech} translate="no" className="rounded-full bg-surface-2 px-3 py-1.5 text-sm text-body">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    {entry.companyUrl && (
                      <a
                        href={entry.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-hairline-strong underline-offset-4 transition-[text-decoration-color] hover:decoration-signal"
                      >
                        {t(`Visit ${company}`, `Bezoek ${company}`)}
                        <ArrowUpRight weight="bold" aria-hidden="true" className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
