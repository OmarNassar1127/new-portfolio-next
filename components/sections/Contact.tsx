'use client';

import { ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { CopyButton } from '@/components/ui/CopyButton';
import { MagneticLink } from '@/components/ui/Button';
import { Heading, Reveal } from '@/components/ui/Reveal';

const textLink =
  'inline-flex items-center gap-1.5 font-semibold underline decoration-hairline-strong underline-offset-4 transition-[text-decoration-color] hover:decoration-signal';

/** Closing poster. Mirrors the hero's scale so the page ends where it began. */
export default function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="px-4 pb-24 pt-28 sm:px-6 md:pb-32 md:pt-40 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Heading className="type-hero text-[clamp(4.5rem,17vw,15rem)] leading-[0.9]">
          {t('Let’s ', 'Laten we ')}
          <em className="italic text-signal">{t('talk.', 'praten.')}</em>
        </Heading>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12">
          <Reveal as="p" className="max-w-[34ch] text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-snug tracking-[-0.02em] text-body lg:col-span-6">
            {t(
              'AI engineering, full-stack work, or a quick consult. Email is the fastest way through.',
              'AI engineering, full-stack werk, of even sparren. E-mail is de snelste weg.',
            )}
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6 lg:col-span-6 lg:items-end">
            <MagneticLink href={`mailto:${personal.email}`} size="lg">
              <EnvelopeSimple weight="bold" aria-hidden="true" className="size-5" />
              {t('Email me', 'Mail me')}
            </MagneticLink>
            <div className="flex items-center gap-1 rounded-full border border-hairline py-1 pl-5 pr-1">
              <span className="font-mono text-sm text-body">{personal.email}</span>
              <CopyButton value={personal.email} label={t('Copy email address', 'Kopieer e-mailadres')} />
            </div>
            <div className="flex gap-6 text-sm">
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className={textLink}>
                LinkedIn
                <ArrowUpRight weight="bold" aria-hidden="true" className="size-3.5" />
              </a>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className={textLink}>
                GitHub
                <ArrowUpRight weight="bold" aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
