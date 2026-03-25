'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { skillsData, skillCategories } from '@/data/skills';

/* ─── Skills Section — Compact grouped layout ─────────────────────────────── */

export default function Skills() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  // Group skills by category (skip "all")
  const groups = skillCategories
    .filter((c) => c.id !== 'all')
    .map((cat) => ({
      ...cat,
      skills: skillsData.filter((s) => s.category === cat.id),
      avg: Math.round(
        skillsData
          .filter((s) => s.category === cat.id)
          .reduce((sum, s) => sum + s.proficiency, 0) /
          (skillsData.filter((s) => s.category === cat.id).length || 1)
      ),
    }));

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-12 md:mb-16"
        >
          <span
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5',
              isDarkMode
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'bg-[var(--primary)]/8 text-[var(--primary)]'
            )}
          >
            <i className="ri-code-s-slash-line" />
            {t('Technical Expertise', 'Technische Expertise')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            {t('Skills &', 'Vaardigheden &')}{' '}
            <span className="gradient-text-static">{t('Expertise', 'Expertise')}</span>
          </h2>

          <p className="text-[var(--text-muted)] max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            {t(
              '34 technologies across 5 domains, refined through production.',
              '34 technologieën in 5 domeinen, verfijnd door productie.'
            )}
          </p>
        </motion.div>

        {/* Grouped skill rows */}
        <div className="space-y-6">
          {groups.map((group, gi) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
              className={cn(
                'rounded-2xl border p-5 md:p-6 transition-all duration-300',
                isDarkMode
                  ? 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/20'
                  : 'bg-white border-gray-200 hover:border-[var(--primary)]/20'
              )}
            >
              {/* Category header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-sm',
                      group.color
                    )}
                  >
                    <i className={cn(group.icon, 'text-sm text-white')} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">
                      {t(group.label.en, group.label.nl)}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {group.skills.length} {t('skills', 'vaardigheden')}
                    </p>
                  </div>
                </div>

                {/* Average proficiency */}
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--primary)]">{group.avg}%</span>
                  <p className="text-[10px] text-[var(--text-muted)]">{t('avg', 'gem')}</p>
                </div>
              </div>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: gi * 0.05 + si * 0.02 }}
                    className={cn(
                      'group/pill flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium',
                      'border transition-all duration-200 cursor-default',
                      isDarkMode
                        ? 'bg-[var(--card-hover)] border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5'
                    )}
                  >
                    {/* Icon */}
                    {skill.iconType === 'svg' ? (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={14}
                        height={14}
                        className={cn(
                          'object-contain',
                          isDarkMode ? 'brightness-0 invert opacity-70' : 'opacity-70'
                        )}
                      />
                    ) : (
                      <i className={cn(skill.icon, 'text-xs opacity-60')} />
                    )}

                    {skill.name}

                    {/* Proficiency dot */}
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0 ml-0.5',
                        skill.proficiency >= 90
                          ? 'bg-emerald-500'
                          : skill.proficiency >= 80
                            ? 'bg-blue-500'
                            : skill.proficiency >= 70
                              ? 'bg-yellow-500'
                              : 'bg-orange-500'
                      )}
                      title={`${skill.proficiency}%`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-5 mt-6 text-[10px] text-[var(--text-muted)]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t('Expert', 'Expert')} 90%+
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {t('Advanced', 'Gevorderd')} 80%+
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> {t('Intermediate', 'Gemiddeld')} 70%+
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {t('Learning', 'Lerende')}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
