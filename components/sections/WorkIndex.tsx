'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useLenis } from 'lenis/react';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { categoryLabels, projects } from '@/data/projects';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { buttonStyles } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { cn } from '@/lib/utils';

const more = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.priority - b.priority)
  .slice(0, 6);

/** Next six projects as an index. On fine pointers a preview follows the cursor. */
export default function WorkIndex() {
  const { t } = useLanguage();
  const reduce = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const preview = finePointer && !reduce;

  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.5 });
  const followY = useSpring(y, { stiffness: 150, damping: 18, mass: 0.5 });

  // Scrolling moves rows under a resting cursor and fires pointerenter without a
  // pointermove. Hide while scrolling; the preview is for deliberate hovering.
  // (Not useLenis(cb): it re-runs and calls cb on every render, which would undo each hover.)
  const lenis = useLenis();
  useEffect(() => lenis?.on('scroll', () => setHovered(null)), [lenis]);

  const show = (event: React.PointerEvent, index: number) => {
    if (event.pointerType !== 'mouse') return;
    // Appearing from hidden: start at the cursor instead of springing in from a stale spot.
    if (hovered === null) {
      x.jump(event.clientX);
      y.jump(event.clientY);
      followX.jump(event.clientX);
      followY.jump(event.clientY);
    }
    setHovered(index);
  };

  return (
    <div className="pb-28 pt-24 md:pb-40 md:pt-32">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="type-title text-[clamp(1.75rem,3vw,2.75rem)]">{t('More projects', 'Meer projecten')}</h3>
        <Link href="/projects/" className={buttonStyles('secondary')}>
          {t(`All ${projects.length} projects`, `Alle ${projects.length} projecten`)}
          <ArrowRight weight="bold" aria-hidden="true" className="size-4" />
        </Link>
      </Reveal>

      <ul
        className="mt-10 divide-y divide-hairline"
        onPointerMove={(event) => {
          x.set(event.clientX);
          y.set(event.clientY);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        {more.map((project, i) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}/`}
              onPointerEnter={(event) => show(event, i)}
              onPointerMove={(event) => hovered !== i && show(event, i)}
              onFocus={() => setHovered(null)}
              className="group grid grid-cols-12 items-center gap-x-4 gap-y-1 py-6 md:py-8"
            >
              <span className="col-span-10 type-title text-[clamp(1.375rem,2.4vw,2.25rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:col-span-7">
                {project.title}
              </span>
              <span className="col-span-2 flex justify-end md:order-last md:col-span-1">
                <ArrowUpRight
                  weight="bold"
                  aria-hidden="true"
                  className="size-5 text-mute transition-[transform,color] duration-300 ease-out-expo group-hover:rotate-45 group-hover:text-signal-ink"
                />
              </span>
              <span className="col-span-8 text-sm text-body md:col-span-3">
                {t(categoryLabels[project.category].en, categoryLabels[project.category].nl)}
              </span>
              <span className="col-span-4 text-right font-mono text-xs text-mute md:col-span-1 md:text-left">
                {project.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {preview && (
        <motion.div
          aria-hidden="true"
          style={{ x: followX, y: followY }}
          animate={{ opacity: hovered === null ? 0 : 1, scale: hovered === null ? 0.6 : 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed left-0 top-0 z-[var(--z-panel)] h-[210px] w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-surface-2 shadow-[0_24px_60px_-20px_rgba(15,15,14,0.45)]"
        >
          {more.map((project, i) => (
            <ProjectCover
              key={project.slug}
              project={project}
              className={cn('absolute inset-0 transition-opacity duration-300', hovered === i ? 'opacity-100' : 'opacity-0')}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
