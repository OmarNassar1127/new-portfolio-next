'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { experienceData, type ExperienceEntry } from '@/data/experience';

import type { Variants } from 'framer-motion';

// ─── Animation variants ───────────────────────────────────────────────────────

// Framer Motion v12 strict types require the `ease` cubic-bezier tuple to be
// cast explicitly when using a factory-function variant.
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: EASE },
  }),
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: EASE },
  }),
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: EASE },
  }),
};

// ─── TimelineItem ─────────────────────────────────────────────────────────────

interface TimelineItemProps {
  entry: ExperienceEntry;
  index: number;
  isLeft: boolean;
}

function TimelineItem({ entry, index, isLeft }: TimelineItemProps) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const title = t(entry.title.en, entry.title.nl);
  const company = t(entry.company.en, entry.company.nl);
  const period = t(entry.period.en, entry.period.nl);
  const description = t(entry.description.en, entry.description.nl);

  return (
    // Desktop: alternating layout. Mobile: always left timeline.
    <div className="relative flex items-start group">

      {/* ── Desktop layout ──────────────────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-8 w-full items-start">

        {/* Left content column */}
        <div className={cn('flex', isLeft ? 'justify-end' : 'justify-start')}>
          {isLeft && (
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={slideLeft}
              className="w-full max-w-md"
            >
              <TimelineCard
                entry={entry}
                title={title}
                company={company}
                period={period}
                description={description}
                isDarkMode={isDarkMode}
                t={t}
              />
            </motion.div>
          )}
        </div>

        {/* Center dot + line connector */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'relative z-10 flex items-center justify-center w-12 h-12 rounded-full',
              'border-2 shadow-lg transition-all duration-300 group-hover:scale-110',
              isDarkMode
                ? 'bg-[var(--card)] border-[var(--border)] group-hover:border-[var(--primary)]'
                : 'bg-white border-gray-200 group-hover:border-[var(--primary)]',
              'group-hover:shadow-[0_0_24px_var(--primary-glow)]',
            )}
          >
            <Image
              src={entry.icon}
              alt={title}
              width={24}
              height={24}
              className={cn('object-contain', isDarkMode && 'brightness-0 invert')}
            />
          </div>
          {/* Year badge */}
          <div
            className={cn(
              'mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap',
              isDarkMode
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'bg-[var(--primary)]/10 text-[var(--primary)]',
            )}
          >
            {period}
          </div>
        </div>

        {/* Right content column */}
        <div className={cn('flex', isLeft ? 'justify-start' : 'justify-end')}>
          {!isLeft && (
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={slideRight}
              className="w-full max-w-md"
            >
              <TimelineCard
                entry={entry}
                title={title}
                company={company}
                period={period}
                description={description}
                isDarkMode={isDarkMode}
                t={t}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Mobile layout ───────────────────────────────────────────────── */}
      <div className="flex md:hidden items-start gap-4 w-full">
        {/* Left dot column */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={cn(
              'relative z-10 flex items-center justify-center w-10 h-10 rounded-full',
              'border-2 shadow-md transition-all duration-300',
              isDarkMode
                ? 'bg-[var(--card)] border-[var(--border)]'
                : 'bg-white border-gray-200',
            )}
          >
            <Image
              src={entry.icon}
              alt={title}
              width={20}
              height={20}
              className={cn('object-contain', isDarkMode && 'brightness-0 invert')}
            />
          </div>
        </div>

        {/* Card */}
        <motion.div
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
          className="flex-1 pb-8"
        >
          <TimelineCard
            entry={entry}
            title={title}
            company={company}
            period={period}
            description={description}
            isDarkMode={isDarkMode}
            t={t}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ─── TimelineCard ─────────────────────────────────────────────────────────────

interface TimelineCardProps {
  entry: ExperienceEntry;
  title: string;
  company: string;
  period: string;
  description: string;
  isDarkMode: boolean;
  t: (en: string, nl: string) => string;
}

function TimelineCard({
  entry,
  title,
  company,
  period,
  description,
  isDarkMode,
  t,
}: TimelineCardProps) {
  return (
    <div
      className={cn(
        'bento-card p-5 md:p-6 relative overflow-hidden',
        entry.current && 'ring-1 ring-[var(--primary)]/30',
      )}
    >
      {/* Gradient accent top bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r',
          entry.color,
        )}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[var(--text)] leading-snug truncate">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              {entry.subtitle}
            </span>
            <span className="text-[var(--text-muted)] opacity-40">·</span>
            <span className="text-xs font-semibold text-[var(--primary)]">
              {company}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Period pill */}
          <span
            className={cn(
              'hidden md:inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap',
              isDarkMode
                ? 'bg-[var(--card-hover)] text-[var(--text-muted)]'
                : 'bg-gray-100 text-gray-500',
            )}
          >
            {period}
          </span>

          {/* Current indicator */}
          {entry.current && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold',
                isDarkMode
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-green-100 text-green-700',
              )}
            >
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot" />
              {t('Current', 'Huidig')}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-4">
        {description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {entry.technologies.map((tech) => (
          <span
            key={tech}
            className={cn(
              'px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors duration-200',
              isDarkMode
                ? 'bg-[var(--primary)]/15 text-[var(--primary)] hover:bg-[var(--primary)]/25'
                : 'bg-[var(--primary)]/8 text-[var(--primary)] hover:bg-[var(--primary)]/15',
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Decorative corner glow */}
      <div
        className={cn(
          'absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl',
          `bg-gradient-to-r ${entry.color}`,
        )}
      />
    </div>
  );
}

// ─── Experience Section ───────────────────────────────────────────────────────

export default function Experience() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  // Show most recent first
  const reversed = [...experienceData].reverse();

  return (
    <section
      id="journey"
      className="relative py-20 md:py-28 overflow-hidden bg-[var(--bg)]"
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-72 h-72 bg-[var(--primary)]/8 rounded-full blur-3xl blob" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[var(--accent-cyan)]/6 rounded-full blur-3xl blob" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--primary)]/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-16 md:mb-20"
        >
          <span
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5',
              isDarkMode
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'bg-[var(--primary)]/8 text-[var(--primary)]',
            )}
          >
            <i className="ri-map-pin-time-line" />
            {t('Career Timeline', 'Carrière Tijdlijn')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            {t('The', 'De')}{' '}
            <span className="gradient-text-static">
              {t('Journey', 'Reis')}
            </span>
          </h2>

          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t(
              'From code student to AI co-founder — building systems that scale.',
              'Van code-student tot AI mede-oprichter — systemen bouwen die schalen.',
            )}
          </p>
        </motion.div>

        {/* ── Timeline ───────────────────────────────────────────────────── */}
        <div className="relative">

          {/* Desktop vertical center line */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 -translate-x-px top-6 bottom-6 w-px"
            style={{
              background: 'linear-gradient(to bottom, var(--primary), var(--accent-cyan), var(--primary))',
              opacity: 0.3,
            }}
          />

          {/* Mobile left line */}
          <div
            aria-hidden="true"
            className="md:hidden absolute left-5 top-6 bottom-6 w-px"
            style={{
              background: 'linear-gradient(to bottom, var(--primary), var(--accent-cyan))',
              opacity: 0.3,
            }}
          />

          <div className="space-y-6 md:space-y-10">
            {reversed.map((entry, index) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* ── Stats strip ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-16 md:mt-20"
        >
          <div
            className={cn(
              'bento-card px-6 py-8 md:py-10',
              'bg-gradient-to-br',
              isDarkMode
                ? 'from-[var(--primary)]/8 to-[var(--accent-cyan)]/5'
                : 'from-[var(--primary)]/4 to-[var(--accent-cyan)]/3',
            )}
          >
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              {[
                {
                  icon: 'ri-time-line',
                  gradient: 'from-[var(--primary)] to-purple-600',
                  value: '7+',
                  label: t('Years in Tech', 'Jaar in Tech'),
                },
                {
                  icon: 'ri-building-2-line',
                  gradient: 'from-blue-500 to-[var(--accent-cyan)]',
                  value: '3',
                  label: t('Companies', 'Bedrijven'),
                },
                {
                  icon: 'ri-rocket-line',
                  gradient: 'from-green-500 to-emerald-500',
                  value: '50+',
                  label: t('Projects Shipped', 'Projecten Opgeleverd'),
                },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2 md:space-y-3">
                  <div
                    className={cn(
                      'w-10 h-10 md:w-14 md:h-14 mx-auto rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br',
                      stat.gradient,
                    )}
                  >
                    <i className={cn(stat.icon, 'text-base md:text-xl text-white')} />
                  </div>
                  <p className="text-xl md:text-3xl font-bold text-[var(--text)]">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
