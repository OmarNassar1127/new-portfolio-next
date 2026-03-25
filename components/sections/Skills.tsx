'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { skillsData, skillCategories, type Skill, type SkillCategory } from '@/data/skills';

// ─── Proficiency bar with animated fill ──────────────────────────────────────

function ProficiencyBar({
  proficiency,
  color,
  isVisible,
}: {
  proficiency: number;
  color: string;
  isVisible: boolean;
}) {
  return (
    <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-[var(--border)]">
      <motion.div
        className={cn('h-full rounded-full bg-gradient-to-r', color)}
        initial={{ width: 0 }}
        animate={{ width: isVisible ? `${proficiency}%` : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
      />
    </div>
  );
}

// ─── Skill level label ────────────────────────────────────────────────────────

function levelLabel(proficiency: number, t: (en: string, nl: string) => string): string {
  if (proficiency >= 90) return t('Expert', 'Expert');
  if (proficiency >= 80) return t('Advanced', 'Gevorderd');
  if (proficiency >= 70) return t('Intermediate', 'Gemiddeld');
  return t('Learning', 'Lerende');
}

function levelColor(proficiency: number): string {
  if (proficiency >= 90) return 'bg-emerald-500/15 text-emerald-400';
  if (proficiency >= 80) return 'bg-blue-500/15 text-blue-400';
  if (proficiency >= 70) return 'bg-yellow-500/15 text-yellow-400';
  return 'bg-orange-500/15 text-orange-400';
}

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      key={skill.name}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{
        duration: 0.42,
        delay: index * 0.035,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      viewport={{ once: true }}
      onViewportEnter={() => setInView(true)}
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      className={cn(
        'bento-card group relative flex flex-col gap-3 p-4 cursor-default overflow-hidden',
        'hover:shadow-[0_0_32px_var(--primary-glow)]',
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shadow-md',
            'transition-transform duration-300 group-hover:scale-110',
            'bg-gradient-to-br',
            skill.color,
          )}
        >
          {skill.iconType === 'svg' ? (
            <Image
              src={skill.icon}
              alt={skill.name}
              width={22}
              height={22}
              className="object-contain brightness-0 invert"
            />
          ) : (
            <i className={cn(skill.icon, 'text-lg text-white')} />
          )}
        </div>

        {/* Level badge */}
        <span
          className={cn(
            'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider',
            levelColor(skill.proficiency),
          )}
        >
          {levelLabel(skill.proficiency, t)}
        </span>
      </div>

      {/* Name */}
      <div>
        <h3
          className={cn(
            'text-sm font-bold leading-tight transition-colors duration-200',
            isDarkMode
              ? 'text-[var(--text)] group-hover:text-[var(--primary)]'
              : 'text-[var(--text)] group-hover:text-[var(--primary)]',
          )}
        >
          {skill.name}
        </h3>
        <p className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
          {t(skill.description.en, skill.description.nl)}
        </p>
      </div>

      {/* Proficiency bar + percentage */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {t('Proficiency', 'Vaardigheid')}
          </span>
          <span className="text-[10px] font-bold text-[var(--primary)]">
            {skill.proficiency}%
          </span>
        </div>
        <ProficiencyBar
          proficiency={skill.proficiency}
          color={skill.color}
          isVisible={inView}
        />
      </div>

      {/* Decorative bg glow */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute -bottom-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-0',
          'group-hover:opacity-20 transition-opacity duration-500',
          'bg-gradient-to-br',
          skill.color,
        )}
      />
    </motion.div>
  );
}

// ─── Category overview bar ────────────────────────────────────────────────────

function CategoryOverview({
  categories,
  isDarkMode,
  t,
}: {
  categories: SkillCategory[];
  isDarkMode: boolean;
  t: (en: string, nl: string) => string;
}) {
  const getAvg = (id: string) => {
    const subset = id === 'all' ? skillsData : skillsData.filter((s) => s.category === id);
    if (!subset.length) return 0;
    return Math.round(subset.reduce((sum, s) => sum + s.proficiency, 0) / subset.length);
  };

  return (
    <div
      className={cn(
        'bento-card p-5 md:p-8 mt-12 md:mt-16',
        isDarkMode
          ? 'bg-gradient-to-br from-[var(--primary)]/6 to-[var(--accent-cyan)]/4'
          : 'bg-gradient-to-br from-[var(--primary)]/3 to-[var(--accent-cyan)]/2',
      )}
    >
      <h3 className="text-base font-bold text-[var(--text)] text-center mb-6">
        {t('Skills Overview', 'Vaardigheden Overzicht')}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => (
            <div key={cat.id} className="text-center group">
              <div
                className={cn(
                  'w-11 h-11 md:w-12 md:h-12 mx-auto rounded-xl flex items-center justify-center mb-3',
                  'bg-gradient-to-br shadow-md',
                  'hover:scale-110 transition-transform duration-300 cursor-default',
                  cat.color,
                )}
              >
                <i className={cn(cat.icon, 'text-base text-white')} />
              </div>
              <p className="text-base font-bold text-[var(--text)]">{getAvg(cat.id)}%</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                {t(cat.label.en, cat.label.nl)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

export default function Skills() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredSkills =
    activeCategory === 'all'
      ? skillsData
      : skillsData.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      className="relative py-20 md:py-28 overflow-hidden bg-[var(--bg)]"
    >
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[var(--primary)]/5 rounded-full blur-3xl blob" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-[var(--accent-cyan)]/5 rounded-full blur-3xl blob" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-10 md:mb-12"
        >
          <span
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5',
              isDarkMode
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'bg-[var(--primary)]/8 text-[var(--primary)]',
            )}
          >
            <i className="ri-code-s-slash-line" />
            {t('Technical Expertise', 'Technische Expertise')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            {t('Skills &', 'Vaardigheden &')}{' '}
            <span className="gradient-text-static">{t('Expertise', 'Expertise')}</span>
          </h2>

          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t(
              'From AI frameworks to full stack development — a versatile toolkit refined through years of shipping production systems.',
              'Van AI-frameworks tot full stack development — een veelzijdige toolkit verfijnd door jaren van het bouwen van productiesystemen.',
            )}
          </p>
        </motion.div>

        {/* ── Filter tabs ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
          className="flex gap-2 mb-10 md:mb-12 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center"
          style={{ scrollbarWidth: 'none' }}
        >
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={isActive}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm',
                  'whitespace-nowrap flex-shrink-0 transition-all duration-250',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                  isActive
                    ? [
                        'text-white shadow-lg shadow-[var(--primary)]/25',
                        'bg-gradient-to-r',
                        cat.color,
                      ]
                    : isDarkMode
                      ? 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:text-[var(--text)]'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--primary)]/40 hover:text-[var(--text)]',
                )}
              >
                <i className={cn(cat.icon, 'text-sm')} />
                {t(cat.label.en, cat.label.nl)}

                {/* Active pulse ring */}
                {isActive && (
                  <motion.span
                    layoutId="tab-active-ring"
                    className="absolute inset-0 rounded-xl ring-2 ring-white/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Skills grid ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4"
          >
            {filteredSkills.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Category overview ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <CategoryOverview categories={skillCategories} isDarkMode={isDarkMode} t={t} />
        </motion.div>

        {/* ── Learning CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-8 text-center"
        >
          <div
            className={cn(
              'inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold',
              'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)]',
              'text-white shadow-lg hover:shadow-[var(--primary)]/30',
              'hover:scale-105 transition-all duration-250 cursor-default',
            )}
          >
            <i className="ri-lightbulb-flash-line text-base" />
            {t('Always learning new technologies', 'Altijd nieuwe technologieën leren')}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
