'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { personal } from '@/data/personal';
import { cn } from '@/lib/utils';

/* ─── Contact — slim, email-first ─────────────────────────────────────── */
export default function Contact() {
  const { t } = useLanguage();

  const channels = [
    {
      href: `mailto:${personal.email}`,
      icon: 'ri-mail-line',
      label: 'Email',
      value: personal.email,
      primary: true,
    },
    {
      href: personal.linkedin,
      icon: 'ri-linkedin-fill',
      label: 'LinkedIn',
      value: 'omar-nassar',
      primary: false,
    },
    {
      href: personal.github,
      icon: 'ri-github-fill',
      label: 'GitHub',
      value: 'OmarNassar1127',
      primary: false,
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-24 sm:px-6 sm:py-32 lg:px-10"
    >
      {/* Subtle warm wash */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(245,121,59,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Editorial header */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <span className="eyebrow">
            <span className="text-[var(--accent)]">·</span>
            <span>{t('Contact', 'Contact')}</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--signal-emerald)] sm:inline">
            {t('Available · Replies within 24h', 'Beschikbaar · Reactie binnen 24u')}
          </span>
        </div>

        {/* Big editorial line */}
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl lg:text-7xl">
          {t("Let's ", 'Laten we ')}
          <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
            {t('talk.', 'praten.')}
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          {t(
            'AI engineering, full-stack work, or a quick consult. Email is the fastest way through.',
            'AI engineering, full-stack werk, of even sparren. E-mail is de snelste weg.',
          )}
        </p>

        <span className="mt-8 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />

        {/* Channels */}
        <ul className="mt-2">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                target={channel.label === 'Email' ? undefined : '_blank'}
                rel={channel.label === 'Email' ? undefined : 'noopener noreferrer'}
                className={cn(
                  'group flex items-center justify-between gap-6 border-b border-[var(--rule)] py-6 transition-colors duration-200',
                  channel.primary ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                )}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)] group-hover:text-[var(--accent)]">
                    {channel.label}
                  </span>
                  <span
                    className={cn(
                      channel.primary
                        ? 'display-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-[34px]'
                        : 'text-base font-medium sm:text-lg',
                    )}
                  >
                    {channel.value}
                  </span>
                </span>
                <i
                  className={cn(
                    channel.icon,
                    'text-xl text-[var(--text-subtle)] transition-all duration-200 group-hover:text-[var(--accent-deep)] group-hover:translate-x-1',
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Footer note */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
          <span>
            {t('Based in Amsterdam · NL', 'Gevestigd in Amsterdam · NL')}
          </span>
          <span>
            {t('Open to: AI engineering · Full-stack · Founder roles', 'Open voor: AI engineering · Full-stack · Founder-rollen')}
          </span>
        </div>
      </div>
    </section>
  );
}
