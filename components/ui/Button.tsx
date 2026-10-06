'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

/** Pill buttons. Primary is the only signal fill on a screen. */
export function buttonStyles(variant: Variant = 'primary', size: Size = 'md') {
  return cn(
    'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold',
    'transition-[background-color,border-color,color,transform] duration-200 ease-out-expo active:scale-[0.98]',
    size === 'md' ? 'h-12 px-6 text-[0.9375rem]' : 'h-14 px-8 text-base',
    variant === 'primary' && 'bg-signal text-on-signal hover:bg-ink hover:text-canvas',
    variant === 'secondary' &&
      'border border-hairline-strong bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-canvas',
    variant === 'ghost' && 'text-ink hover:bg-surface-2',
  );
}

type MagneticLinkProps = React.ComponentProps<'a'> & { variant?: Variant; size?: Size };

/**
 * Anchor that leans toward the pointer. Fine pointers only, never under
 * reduced motion. Motion values keep it out of the React render cycle.
 */
export function MagneticLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = usePrefersReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 });
  const active = finePointer && !reduce;

  const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      style={active ? { x: springX, y: springY } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn(buttonStyles(variant, size), className)}
      {...(props as React.ComponentProps<typeof motion.a>)}
    >
      {children}
    </motion.a>
  );
}
