'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import type { Skill } from '@/data/skills';

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    amount: 0.3,
  });

  const description = t(skill.description.en, skill.description.nl);

  return (
    <div
      ref={ref}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl p-4',
        'border border-[var(--border)] bg-[var(--card)]',
        'cursor-default overflow-hidden',
        'transition-[border-color,box-shadow,transform] duration-300',
        'hover:-translate-y-0.5 hover:border-[rgba(136,115,239,0.30)]',
        'hover:shadow-[0_4px_20px_-8px_var(--primary-glow)]',
        className
      )}
    >
      {/* Top row: icon + name + proficiency number */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--card-hover)]">
          {skill.iconType === 'svg' ? (
            <Image
              src={skill.icon}
              alt={skill.name}
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          ) : (
            <i className={cn(skill.icon, 'text-lg text-[var(--text-muted)]')} />
          )}
        </div>

        {/* Name */}
        <span className="flex-1 text-sm font-semibold text-[var(--text)]">
          {skill.name}
        </span>

        {/* Proficiency % */}
        <span className="text-xs font-mono font-semibold text-[var(--text-muted)]">
          {skill.proficiency}%
        </span>
      </div>

      {/* Proficiency bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--card-hover)]">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', skill.color)}
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
        />
      </div>

      {/* Description — expands on hover */}
      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
        )}
      >
        <p className="overflow-hidden text-xs leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
