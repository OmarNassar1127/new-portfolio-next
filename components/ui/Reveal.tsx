'use client';

import { motion } from 'motion/react';
import { cn, ease } from '@/lib/utils';

type RevealProps = {
  as?: 'div' | 'p' | 'li' | 'span' | 'header';
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/** Fade-up on first entry. Used for body copy that follows a heading. */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Component>
  );
}

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
  children: React.ReactNode;
};

const rise = {
  hidden: { y: '105%' },
  shown: { y: '0%', transition: { duration: 1, ease } },
};

/**
 * Section heading that rises out of a mask when it enters the viewport,
 * marking where a new chapter starts. The heading itself is observed (the
 * masked child is clipped, so it can never intersect). Padding inside the
 * mask leaves room for italic descenders.
 */
export function Heading({ as = 'h2', id, className, children }: HeadingProps) {
  const Tag = motion[as];

  return (
    <Tag
      id={id}
      className={cn('overflow-hidden pb-[0.14em] pt-[0.04em]', className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span className="block" variants={rise}>
        {children}
      </motion.span>
    </Tag>
  );
}
