'use client';

import { useRef, useState, useCallback, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type AllowedTag = 'div' | 'article' | 'a';

type SpotlightCardProps<T extends AllowedTag = 'div'> = {
  as?: T;
  className?: string;
  spotlightColor?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'className' | 'children'>;

export function SpotlightCard<T extends AllowedTag = 'div'>({
  as,
  className,
  spotlightColor,
  children,
  ...rest
}: SpotlightCardProps<T>) {
  const cardRef = useRef<HTMLElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const defaultColor = 'rgba(136, 115, 239, 0.18)';
  const resolvedColor = spotlightColor ?? defaultColor;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const Tag = (as ?? 'div') as 'div';

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-xl border border-[var(--border)]',
        'bg-[var(--card)] transition-[border-color,box-shadow] duration-300',
        'hover:border-[rgba(136,115,239,0.35)]',
        className
      )}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any)}
    >
      {/* Spotlight glow layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, ${resolvedColor}, transparent 70%)`,
        }}
      />
      {/* Content sits above the glow */}
      <span className="relative z-10 flex flex-col">{children}</span>
    </Tag>
  );
}
