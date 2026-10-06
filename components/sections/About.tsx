'use client';

import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { Heading, Reveal } from '@/components/ui/Reveal';
import { ScrubText } from '@/components/ui/ScrubText';

const paragraphs = {
  en: [
    "I started as a frontend developer in 2017 and moved into backend a few years later. The stack runs wide: React, Next.js, Laravel, Node, Python, plus the infrastructure to actually run it in production. The AI work came after that. Multi-agent systems, RAG platforms, on-premise LLMs. It's the latest chapter, built on top of the foundation, not stacked next to it.",
    'At Vloto B.V., I build the AI systems and the backend they run on. The customer-facing WhatsApp agent resolves over 55% of conversations autonomously. There is voice AI for inbound calls, fraud-prevention models, on-premise LLM workflows running inside the company, plus the booking algorithms, internal dashboards and APIs underneath. With Virelio, I bring the same full-stack-to-AI approach to other companies.',
  ],
  nl: [
    "Ik ben in 2017 begonnen als frontend developer en ging een paar jaar later over op backend. De stack is breed: React, Next.js, Laravel, Node, Python, plus de infrastructuur om het ook echt in productie te draaien. Het AI-werk kwam daarna. Multi-agent systemen, RAG-platformen, on-premise LLM's. Het is het nieuwste hoofdstuk, gebouwd op het fundament, niet ernaast geplakt.",
    "Bij Vloto B.V. bouw ik de AI-systemen en de backend waarop ze draaien. De klantgerichte WhatsApp-agent lost meer dan 55% van de gesprekken autonoom op. Er is voice AI voor inkomende telefoontjes, fraudepreventie-modellen, on-premise LLM-workflows die intern hun werk doen, plus de boekingsalgoritmes, interne dashboards en API's eronder. Met Virelio breng ik diezelfde full-stack-tot-AI aanpak naar andere bedrijven.",
  ],
};

export default function About() {
  const { t, language } = useLanguage();
  const lang = language === 'NL' ? 'nl' : 'en';

  return (
    <section id="about-me" className="px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Heading className="max-w-[16ch] type-display text-[clamp(2.75rem,7.5vw,6.5rem)]">
          {t('Builds the full stack. ', 'Bouwt de hele stack. ')}
          <em className="italic text-signal">{t('Ships the AI.', 'Levert de AI.')}</em>
        </Heading>

        <ScrubText
          key={lang}
          text={paragraphs[lang][0]}
          className="mt-12 max-w-[36ch] text-[clamp(1.5rem,2.7vw,2.5rem)] font-medium leading-[1.22] tracking-[-0.022em] text-ink md:mt-20"
        />

        <Reveal as="p" className="mt-10 max-w-[56ch] text-lg leading-relaxed text-body md:ml-[38%] md:mt-14">
          {paragraphs[lang][1]}
        </Reveal>

        <dl className="mt-20 grid grid-cols-2 gap-y-12 border-t border-hairline pt-10 md:mt-28 md:grid-cols-4 md:pt-12">
          {personal.stats.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 0.08} className="flex flex-col-reverse gap-3 md:border-l md:border-hairline md:pl-8 md:first:border-l-0 md:first:pl-0">
              <dt className="text-sm text-mute">{t(stat.label.en, stat.label.nl)}</dt>
              <dd className="type-metric text-[clamp(2.75rem,5vw,4.5rem)] text-ink">{stat.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
