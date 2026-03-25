'use client';

import { useScroll, useSpring, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Thin gradient bar fixed at the top of the viewport that fills as the
 * user scrolls down the page. Uses Framer Motion's useScroll + useSpring
 * for a smooth, springy feel.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed left-0 top-0 z-60 h-[2px] w-full origin-left',
        className
      )}
      style={{
        scaleX,
        background: 'linear-gradient(to right, #a855f7, #06b6d4, #ec4899)',
      }}
    />
  );
}
