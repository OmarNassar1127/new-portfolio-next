'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, GoogleLogo, SealCheck } from '@phosphor-icons/react';
import { certificationsData, type Certification } from '@/data/certifications';
import { useLanguage } from '@/hooks/useLanguage';
import { Heading, Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const issuers = Array.from(new Set(certificationsData.map((c) => c.issuer)));

/** Horizontal snap rail. Arrow buttons are the click and keyboard alternative to swiping. */
export default function Credentials() {
  const { t } = useLanguage();
  const reduce = usePrefersReducedMotion();
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Watch the first and last card instead of listening to scroll.
  useEffect(() => {
    const root = rail.current;
    if (!root || root.children.length === 0) return;
    const first = root.children[0];
    const last = root.children[root.children.length - 1];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === first) setAtStart(entry.intersectionRatio > 0.95);
          if (entry.target === last) setAtEnd(entry.intersectionRatio > 0.95);
        }
      },
      { root, threshold: [0, 0.95, 1] },
    );
    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, []);

  const step = (direction: 1 | -1) => {
    const root = rail.current;
    const card = root?.children[0] as HTMLElement | undefined;
    if (!root || !card) return;
    root.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: reduce ? 'auto' : 'smooth' });
  };

  const verifiedBy =
    issuers.length > 1
      ? `${issuers.slice(0, -1).join(', ')} ${t('and', 'en')} ${issuers[issuers.length - 1]}`
      : issuers[0];

  return (
    <section id="certifications" className="py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Heading className="type-display text-[clamp(2.75rem,7vw,6rem)]">{t('Credentials, on file.', 'Credentials, op dossier.')}</Heading>
        <Reveal as="p" delay={0.1} className="mt-5 max-w-[52ch] text-lg leading-relaxed text-body md:text-xl">
          {t(`Verified through ${verifiedBy}. Always learning what ships.`, `Geverifieerd via ${verifiedBy}. Altijd lerend wat in productie staat.`)}
        </Reveal>
      </div>

      <ul
        ref={rail}
        tabIndex={0}
        aria-label={t('Certifications', 'Certificeringen')}
        className="rail mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 md:mt-16 lg:scroll-px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))] lg:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]"
      >
        {certificationsData.map((cert) => (
          <li key={cert.id} className="w-[min(80vw,340px)] shrink-0 snap-start">
            <CredentialCard cert={cert} />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-8 flex max-w-[1400px] gap-2 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label={t('Previous certifications', 'Vorige certificeringen')}
          className="flex size-12 items-center justify-center rounded-full border border-hairline-strong text-ink transition-[background-color,color,opacity] hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft weight="bold" aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label={t('Next certifications', 'Volgende certificeringen')}
          className="flex size-12 items-center justify-center rounded-full border border-hairline-strong text-ink transition-[background-color,color,opacity] hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowRight weight="bold" aria-hidden="true" className="size-4" />
        </button>
      </div>
    </section>
  );
}

function IssuerMark({ cert }: { cert: Certification }) {
  if (cert.logo === 'google') {
    return (
      <span className="flex size-9 items-center justify-center rounded-full bg-surface-2">
        <GoogleLogo weight="bold" aria-hidden="true" className="size-4" />
      </span>
    );
  }
  if (cert.logoPath) {
    return (
      <span className="relative size-9 overflow-hidden rounded-full bg-surface-2">
        <Image src={cert.logoPath} alt="" fill sizes="36px" className="object-cover" />
      </span>
    );
  }
  return null;
}

function CredentialCard({ cert }: { cert: Certification }) {
  const { t } = useLanguage();
  const verified = cert.credentialUrl !== null;

  return (
    <article
      className={cn(
        'group relative flex h-full min-h-[300px] flex-col rounded-2xl border border-hairline bg-surface p-6 sm:p-7',
        verified && 'transition-colors duration-300 hover:border-hairline-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-signal',
      )}
    >
      <div className="flex items-center gap-3">
        <IssuerMark cert={cert} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{cert.issuer}</span>
          <span className="font-mono text-xs text-mute">{cert.date}</span>
        </div>
      </div>

      <h3 className="mt-6 text-xl font-semibold leading-snug tracking-[-0.02em]">
        {verified ? (
          <a
            href={cert.credentialUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
          >
            {cert.title}
          </a>
        ) : (
          cert.title
        )}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-body">{cert.skills.join(', ')}</p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold">
        {verified ? (
          <>
            {t('Verify credential', 'Bekijk credential')}
            <ArrowUpRight
              weight="bold"
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </>
        ) : (
          <>
            <SealCheck weight="bold" aria-hidden="true" className="size-4 text-mute" />
            <span className="font-medium text-mute">{t('On record', 'Geregistreerd')}</span>
          </>
        )}
      </span>
    </article>
  );
}
