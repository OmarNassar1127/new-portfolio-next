'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Paragraph whose words light up as it scrolls through the viewport, so the
 * reveal paces the read. Screen readers get the plain text.
 */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={reduce}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  progress,
  range,
  still,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
  children: string;
}) {
  // Floor of 0.5 keeps unrevealed words above 3:1 contrast (large text) in both themes.
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.5, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  );
}
