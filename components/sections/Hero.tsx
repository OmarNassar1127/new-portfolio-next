'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from '@phosphor-icons/react';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticLink, buttonStyles } from '@/components/ui/Button';

const inlineLink =
  'underline decoration-hairline-strong decoration-[0.07em] underline-offset-[0.16em] transition-[text-decoration-color] duration-200 hover:decoration-signal';

export default function Hero() {
  const { t } = useLanguage();
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Hand-off to the work section: copy fades and lifts, the name drifts up slower.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);

  return (
    <section
      id="about"
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden px-4 pb-5 pt-24 sm:px-6 lg:px-10 lg:pb-8"
    >
      <motion.div
        style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}
        className="mx-auto w-full max-w-[1400px] pt-8 sm:pt-12 lg:pt-16"
      >
        <p className="hero-fade inline-flex items-center gap-2.5 font-mono text-xs text-body" style={{ animationDelay: '0.35s' }}>
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative size-2 rounded-full bg-signal" />
          </span>
          {t('Open to new roles', 'Open voor nieuwe rollen')}
        </p>

        {/* No entrance animation: this sentence is the LCP element, so it paints immediately. */}
        <p
          className="mt-6 max-w-[29ch] text-[clamp(1.375rem,2.25vw,2rem)] font-medium leading-[1.2] tracking-[-0.022em] text-body"
        >
          {t('AI engineer and full-stack developer at ', 'AI engineer en full-stack developer bij ')}
          <a href="https://vloto.nl" target="_blank" rel="noopener noreferrer" className={`text-ink ${inlineLink}`}>
            Vloto
          </a>
          {t(', founder of ', ', oprichter van ')}
          <a href={personal.virelio.site} target="_blank" rel="noopener noreferrer" className={`text-ink ${inlineLink}`}>
            Virelio
          </a>
          .{' '}
          <span className="text-ink">{t('I build AI that ships, not demos.', 'Ik bouw AI die levert, geen demo’s.')}</span>
        </p>

        <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.5s' }}>
          <MagneticLink href="#portfolio" variant="primary">
            {t('See the work', 'Bekijk het werk')}
            <ArrowDown weight="bold" aria-hidden="true" className="size-4" />
          </MagneticLink>
          <a href={`mailto:${personal.email}`} className={buttonStyles('secondary')}>
            {t('Email me', 'Mail me')}
          </a>
        </div>
      </motion.div>

      <motion.h1
        style={reduce ? undefined : { y: nameY }}
        className="mx-auto mt-16 w-full max-w-[1400px] type-hero text-[20.5vw] text-ink sm:text-[17vw] lg:text-[min(12.3vw,11.4rem)]"
      >
        <span className="sr-only">Omar Nassar</span>
        <span aria-hidden="true" className="flex flex-wrap items-center gap-x-[0.1em]">
          <Letters word="Omar" offset={0} />
          <Portrait />
          <Letters word="Nassar" offset={4} />
        </span>
      </motion.h1>
    </section>
  );
}

/** Each glyph rises out of its line on load: the name is the first thing that moves. */
function Letters({ word, offset }: { word: string; offset: number }) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.05em] pt-[0.03em]">
      {word.split('').map((char, i) => (
        <span key={i} className="hero-rise inline-block" style={{ animationDelay: `${0.05 + (offset + i) * 0.045}s` }}>
          {char}
        </span>
      ))}
    </span>
  );
}

/** Memoji chip set inside the name. Waves by default, opens the laptop on hover. */
function Portrait() {

  return (
    <span
      style={{ animationDelay: '0.45s' }}
      className="hero-pop group/portrait relative inline-block h-[0.72em] w-[1.28em] shrink-0 overflow-hidden rounded-full bg-[#050505] ring-1 ring-hairline-strong"
    >
      <Image
        src="/images/me.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 15vw, 30vw"
        className="object-cover object-[50%_28%] transition-opacity duration-300 group-hover/portrait:opacity-0"
      />
      <Image
        src="/images/me2.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 15vw, 30vw"
        className="object-cover object-[50%_40%] opacity-0 transition-opacity duration-300 group-hover/portrait:opacity-100"
      />
    </span>
  );
}
