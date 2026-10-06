'use client';

import { useState } from 'react';
import { Asterisk, Pause, Play } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';

const CAPABILITIES = [
  { en: 'AI agents', nl: 'AI-agents' },
  { en: 'Voice AI', nl: 'Voice AI' },
  { en: 'WhatsApp automation', nl: 'WhatsApp-automatisering' },
  { en: 'Fraud prevention', nl: 'Fraudepreventie' },
  { en: 'RAG platforms', nl: 'RAG-platformen' },
  { en: 'Multi-agent systems', nl: 'Multi-agent systemen' },
  { en: 'On-premise LLMs', nl: 'On-premise LLM’s' },
  { en: 'Full-stack products', nl: 'Full-stack producten' },
];

/** The page's one marquee: the range of work, at a glance, between hero and case studies. */
export default function Capabilities() {
  const { t } = useLanguage();
  const [paused, setPaused] = useState(false);

  const row = (duplicate: boolean) => (
    <ul
      aria-label={duplicate ? undefined : t('What I build', 'Wat ik bouw')}
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center"
    >
      {CAPABILITIES.map((item) => (
        <li key={item.en} className="flex items-center gap-[0.55em] whitespace-nowrap pr-[0.55em]">
          <span>{t(item.en, item.nl)}</span>
          <Asterisk weight="bold" aria-hidden="true" className="size-[0.62em] text-signal" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-paused={paused}
      className="marquee relative border-y border-hairline py-6 md:py-8"
    >
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_88%,transparent)]">
        <div className="marquee-track flex w-max type-title text-[clamp(1.75rem,4.2vw,3.75rem)] text-ink">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? t('Play animation', 'Animatie afspelen') : t('Pause animation', 'Animatie pauzeren')}
        aria-pressed={paused}
        className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-canvas text-body transition-colors hover:text-ink sm:right-6 lg:right-10"
      >
        {paused ? (
          <Play weight="fill" aria-hidden="true" className="size-3.5" />
        ) : (
          <Pause weight="fill" aria-hidden="true" className="size-3.5" />
        )}
      </button>
    </div>
  );
}
