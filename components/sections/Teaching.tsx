'use client';

import { ChalkboardTeacher, Lightning, Wrench } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';
import { Heading, Reveal } from '@/components/ui/Reveal';

const PRACTICES = [
  {
    Icon: Lightning,
    title: { en: 'AI go-to engineer at Vloto', nl: 'AI go-to engineer bij Vloto' },
    body: {
      en: 'Half engineering, half teaching: showing the team how to automate their own workflows.',
      nl: 'Half engineering, half lesgeven: het team laten zien hoe ze hun eigen workflows automatiseren.',
    },
  },
  {
    Icon: Wrench,
    title: { en: 'Internal tools that cut dev time', nl: 'Interne tools die dev-tijd schrappen' },
    body: {
      en: 'Techniques and tools I build to compress development time, then teach the team to use.',
      nl: 'Technieken en tools die ik bouw om ontwikkeltijd in te korten, en daarna aan het team leer.',
    },
  },
  {
    Icon: ChalkboardTeacher,
    title: { en: 'AI lessons & webinars', nl: 'AI-lessen & webinars' },
    body: {
      en: 'Every session builds something real, live, instead of clicking through slides.',
      nl: 'Elke sessie bouwt live iets echts, in plaats van door slides te klikken.',
    },
  },
];

export default function Teaching() {
  const { t } = useLanguage();

  return (
    <section id="teaching" className="px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Heading className="type-display text-[clamp(2.75rem,6.5vw,5.5rem)]">
              {t('Best taught by ', 'Het best geleerd door ')}
              <em className="italic text-signal">{t('doing.', 'doen.')}</em>
            </Heading>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-[40ch] text-lg leading-relaxed text-body">
              {t(
                'The only way to teach AI is to build it in front of you. That holds inside Vloto and in every lesson I run outside it.',
                'De enige manier om AI te leren is door het voor je ogen te bouwen. Dat geldt binnen Vloto en in elke les die ik daarbuiten geef.',
              )}
            </Reveal>
          </div>
        </div>

        <ol className="flex flex-col lg:col-span-6 lg:col-start-7">
          {PRACTICES.map(({ Icon, title, body }, i) => (
            <Reveal
              as="li"
              key={title.en}
              delay={i * 0.08}
              className="flex gap-6 border-t border-hairline py-10 first:border-t-0 first:pt-0 md:gap-8 md:py-14"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
                <Icon weight="bold" aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="type-title text-[clamp(1.5rem,2.4vw,2.25rem)]">{t(title.en, title.nl)}</h3>
                <p className="mt-3 max-w-[42ch] text-lg leading-relaxed text-body">{t(body.en, body.nl)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
