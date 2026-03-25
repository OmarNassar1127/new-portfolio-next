'use client';

import { useMemo } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  /** Raw value string, e.g. "€50K", "30+", "200+", "7+" */
  value: string;
  className?: string;
  /** Animation duration in seconds (default: 2.2) */
  duration?: number;
}

interface ParsedValue {
  prefix: string;
  number: number;
  suffix: string;
}

/** Extracts prefix (e.g. "€"), numeric part, and suffix (e.g. "K", "+") */
function parseValue(raw: string): ParsedValue {
  // Match an optional leading non-numeric string, then the number, then trailing
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: '', number: 0, suffix: raw };
  return {
    prefix: match[1],
    number: parseFloat(match[2]),
    suffix: match[3],
  };
}

export function AnimatedCounter({
  value,
  className,
  duration = 2.2,
}: AnimatedCounterProps) {
  const parsed = useMemo(() => parseValue(value), [value]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {parsed.prefix}
      <CountUp
        start={0}
        end={inView ? parsed.number : 0}
        duration={duration}
        useEasing
        easingFn={(t, b, c, d) => {
          // Ease out cubic
          t /= d;
          t--;
          return c * (t * t * t + 1) + b;
        }}
        preserveValue
      />
      {parsed.suffix}
    </span>
  );
}
