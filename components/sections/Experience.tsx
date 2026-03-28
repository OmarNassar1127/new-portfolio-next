'use client';

// motion removed — CSS animations only
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { useSectionInView } from '@/hooks/useSectionInView';
import { experienceData } from '@/data/experience';

export default function Experience() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const reversed = [...experienceData].reverse();
  const timelineRef = useSectionInView<HTMLDivElement>();

  return (
    <section id="journey" className="relative py-20 md:py-28 overflow-hidden bg-[var(--bg)]">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-72 h-72 bg-[var(--primary)]/8 rounded-full blur-3xl blob" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[var(--accent-cyan)]/6 rounded-full blur-3xl blob" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-18"
        >
          <span
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5',
              isDarkMode
                ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                : 'bg-[var(--primary)]/8 text-[var(--primary)]'
            )}
          >
            <i className="ri-map-pin-time-line" />
            {t('Career Timeline', 'Carrière Tijdlijn')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            {t('The', 'De')}{' '}
            <span className="gradient-text-static">{t('Journey', 'Reis')}</span>
          </h2>

          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {t(
              'From code student to AI co-founder — building systems that scale.',
              'Van code-student tot AI mede-oprichter — systemen bouwen die schalen.'
            )}
          </p>
        </div>

        {/* Timeline — single column, line on the left */}
        <div className="relative">
          {/* Vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
            style={{
              background: isDarkMode
                ? 'linear-gradient(to bottom, var(--primary), var(--accent-cyan), transparent)'
                : 'linear-gradient(to bottom, var(--primary), var(--accent-cyan), transparent)',
              opacity: 0.3,
            }}
          />

          <div ref={timelineRef} className="section-stagger space-y-8 md:space-y-10">
            {reversed.map((entry, index) => {
              const title = t(entry.title.en, entry.title.nl);
              const company = t(entry.company.en, entry.company.nl);
              const period = t(entry.period.en, entry.period.nl);
              const description = t(entry.description.en, entry.description.nl);

              return (
                <div
                  key={entry.id}
                  className="relative flex gap-5 md:gap-7"
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center',
                        'shadow-md transition-all duration-300',
                        'bg-gradient-to-br',
                        entry.color,
                        entry.current && 'shadow-[0_0_20px_var(--primary-glow)]'
                      )}
                    >
                      <i className={cn(entry.icon, 'text-xl text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]')} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={cn(
                      'flex-1 rounded-2xl border p-5 md:p-6 transition-all duration-300',
                      isDarkMode
                        ? 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30'
                        : 'bg-white border-gray-200 hover:border-[var(--primary)]/30 hover:shadow-lg',
                      entry.current && 'ring-1 ring-[var(--primary)]/20'
                    )}
                  >
                    {/* Top accent */}
                    <div className={cn('h-0.5 w-16 rounded-full bg-gradient-to-r mb-4', entry.color)} />

                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-[var(--text)]">
                          {title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-[var(--text-muted)]">{entry.subtitle}</span>
                          <span className="text-[var(--text-muted)] opacity-40">·</span>
                          {entry.companyUrl ? (
                            <a
                              href={entry.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--accent-cyan)] transition-colors inline-flex items-center gap-1"
                            >
                              {company}
                              <i className="ri-external-link-line text-[10px] opacity-60" />
                            </a>
                          ) : (
                            <span className="text-xs font-semibold text-[var(--primary)]">{company}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-[10px] font-semibold',
                            isDarkMode
                              ? 'bg-[var(--card-hover)] text-[var(--text-muted)]'
                              : 'bg-gray-100 text-gray-500'
                          )}
                        >
                          {period}
                        </span>
                        {entry.current && (
                          <span
                            className={cn(
                              'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold',
                              isDarkMode
                                ? 'bg-green-500/15 text-green-400'
                                : 'bg-green-100 text-green-700'
                            )}
                          >
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot" />
                            {t('Current', 'Huidig')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
                      {description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {entry.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={cn(
                            'px-2 py-0.5 rounded-md text-[10px] font-semibold',
                            isDarkMode
                              ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                              : 'bg-[var(--primary)]/8 text-[var(--primary)]'
                          )}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-14 md:mt-18">
          <div
            className={cn(
              'rounded-2xl border px-6 py-8 md:py-10',
              isDarkMode
                ? 'bg-gradient-to-br from-[var(--primary)]/8 to-[var(--accent-cyan)]/5 border-[var(--border)]'
                : 'bg-gradient-to-br from-[var(--primary)]/4 to-[var(--accent-cyan)]/3 border-gray-200'
            )}
          >
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              {[
                { icon: 'ri-time-line', gradient: 'from-[var(--primary)] to-purple-600', value: '7+', label: t('Years in Tech', 'Jaar in Tech') },
                { icon: 'ri-building-2-line', gradient: 'from-blue-500 to-[var(--accent-cyan)]', value: '3', label: t('Companies', 'Bedrijven') },
                { icon: 'ri-rocket-line', gradient: 'from-green-500 to-emerald-500', value: '50+', label: t('Projects Shipped', 'Projecten Opgeleverd') },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className={cn('w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-br', stat.gradient)}>
                    <i className={cn(stat.icon, 'text-base md:text-lg text-white')} />
                  </div>
                  <p className="text-xl md:text-3xl font-bold text-[var(--text)]">{stat.value}</p>
                  <p className="text-xs md:text-sm text-[var(--text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
