'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type TextRevealTag = 'h1' | 'h2' | 'h3' | 'p';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: TextRevealTag;
  /** Delay before the first word animates in (seconds) */
  delay?: number;
}

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function TextReveal({
  text,
  className,
  as: Tag = 'p',
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-10% 0px',
  });

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={cn('flex flex-wrap gap-x-[0.28em]', className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as const as [number, number, number, number],
            delay: delay + i * 0.05,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
