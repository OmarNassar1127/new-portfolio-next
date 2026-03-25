'use client';

import {
  useRef,
  useCallback,
  ElementType,
  ComponentPropsWithoutRef,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  MotionProps,
} from 'framer-motion';
import { cn } from '@/lib/utils';

type MagneticButtonOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  /** Fraction of the cursor offset to apply as displacement (default: 0.3) */
  strength?: number;
  children: React.ReactNode;
};

type MagneticButtonProps<T extends ElementType> = MagneticButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof MagneticButtonOwnProps<T>> &
  MotionProps;

const springConfig = { stiffness: 250, damping: 22, mass: 0.5 };

export function MagneticButton<T extends ElementType = 'button'>({
  as,
  className,
  strength = 0.3,
  children,
  ...rest
}: MagneticButtonProps<T>) {
  const Tag = (as ?? 'button') as ElementType;
  const MotionTag = motion.create(Tag);
  const elRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;
      // Clamp displacement to ±10px
      const clamp = (v: number) => Math.max(-10, Math.min(10, v * strength));
      rawX.set(clamp(offsetX));
      rawY.set(clamp(offsetY));
    },
    [rawX, rawY, strength]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <MotionTag
      ref={elRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative inline-flex items-center justify-center', className)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
