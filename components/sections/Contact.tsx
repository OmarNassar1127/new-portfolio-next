'use client';

import { useState, useRef } from 'react';
// motion removed — using CSS animations only
import { toast, Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { personal } from '@/data/personal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Input component ──────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  isDarkMode: boolean;
  error?: boolean;
}

function FormInput({ label, icon, isDarkMode, error, ...rest }: InputProps) {
  return (
    <div className="relative">
      <label htmlFor={rest.id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <i
          className={cn(
            icon,
            'absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors duration-200',
            isDarkMode ? 'text-[var(--text-muted)]' : 'text-gray-400',
          )}
        />
        <input
          {...rest}
          suppressHydrationWarning
          placeholder={label}
          className={cn(
            'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm',
            'border transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)]',
            isDarkMode
              ? 'bg-[var(--card-hover)] border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)]'
              : 'bg-gray-50 border-gray-200 text-[var(--text)] placeholder:text-gray-400 focus:bg-white',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30',
          )}
        />
      </div>
    </div>
  );
}

// ─── Textarea component ───────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon: string;
  isDarkMode: boolean;
  error?: boolean;
}

function FormTextarea({ label, icon, isDarkMode, error, ...rest }: TextareaProps) {
  return (
    <div className="relative">
      <label htmlFor={rest.id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <i
          className={cn(
            icon,
            'absolute left-4 top-4 text-base pointer-events-none transition-colors duration-200',
            isDarkMode ? 'text-[var(--text-muted)]' : 'text-gray-400',
          )}
        />
        <textarea
          {...rest}
          suppressHydrationWarning
          placeholder={label}
          className={cn(
            'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm resize-none',
            'border transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)]',
            isDarkMode
              ? 'bg-[var(--card-hover)] border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)]'
              : 'bg-gray-50 border-gray-200 text-[var(--text)] placeholder:text-gray-400 focus:bg-white',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30',
          )}
        />
      </div>
    </div>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

export default function Contact() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // ── Validation errors ──────────────────────────────────────────────────────
  const errors: Partial<Record<keyof FormState, boolean>> = {
    name:    touched.name    && formData.name.trim().length < 2,
    email:   touched.email   && !isValidEmail(formData.email),
    subject: touched.subject && formData.subject.trim().length < 2,
    message: touched.message && formData.message.trim().length < 10,
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    isValidEmail(formData.email) &&
    formData.subject.trim().length >= 2 &&
    formData.message.trim().length >= 10;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await fetch(`https://formspree.io/f/${personal.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
        formRef.current?.reset();
        toast.success(
          t(
            'Message received! I\'ll get back to you soon.',
            'Bericht ontvangen! Ik neem snel contact op.',
          ),
          { duration: 4000 },
        );
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      toast.error(
        t(
          'Something went wrong. Please try again.',
          'Er ging iets mis. Probeer het opnieuw.',
        ),
        { duration: 4000 },
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Quick contact links ────────────────────────────────────────────────────
  const contactLinks = [
    {
      icon: 'ri-mail-line',
      label: t('Email', 'E-mail'),
      value: personal.email,
      href: `mailto:${personal.email}`,
      color: 'from-[var(--primary)] to-purple-600',
    },
    {
      icon: 'ri-linkedin-box-fill',
      label: 'LinkedIn',
      value: 'Omar Nassar',
      href: personal.linkedin,
      color: 'from-blue-600 to-blue-800',
    },
    {
      icon: 'ri-github-fill',
      label: 'GitHub',
      value: 'OmarNassar1127',
      href: personal.github,
      color: 'from-gray-700 to-gray-900',
    },
    {
      icon: 'ri-twitter-x-line',
      label: 'Twitter',
      value: '@GodelTrabuco69',
      href: personal.twitter,
      color: 'from-sky-500 to-sky-700',
    },
  ];

  return (
    <>
      {/* Sonner toast container */}
      <Toaster
        position="top-right"
        theme={isDarkMode ? 'dark' : 'light'}
        richColors
      />

      <section
        id="contact"
        className="relative py-20 md:py-28 overflow-hidden bg-[var(--bg)]"
      >
        {/* Background blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-24 w-72 h-72 bg-[var(--primary)]/7 rounded-full blur-3xl blob" />
          <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-[var(--accent-cyan)]/6 rounded-full blur-3xl blob" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="text-center mb-12 md:mb-16">
            <span
              className={cn(
                'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5',
                isDarkMode
                  ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                  : 'bg-[var(--primary)]/8 text-[var(--primary)]',
              )}
            >
              <i className="ri-chat-smile-2-line" />
              {t('Get in Touch', 'Neem Contact Op')}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
              {t("Let's", "Laten We")}{' '}
              <span className="gradient-text-static">{t('Connect', 'Verbinden')}</span>
            </h2>

            <p className="text-[var(--text-muted)] max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              {t(
                "Have a project in mind or want to explore AI solutions? I'd love to hear from you.",
                'Heb je een project in gedachten of wil je AI-oplossingen verkennen? Ik hoor graag van je.',
              )}
            </p>
          </div>

          {/* ── Two-column layout ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* ── Left: Contact form ──────────────────────────────────────── */}
            <div className="order-1">
              <div className={cn('bento-card p-4 sm:p-6 md:p-8 glass')}>
                <h3 className="text-base font-bold text-[var(--text)] mb-6 flex items-center gap-2">
                  <i className="ri-send-plane-2-line text-[var(--primary)]" />
                  {t('Send a Message', 'Stuur een Bericht')}
                </h3>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                >
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id="name"
                      name="name"
                      type="text"
                      label={t('Your name', 'Uw naam')}
                      icon="ri-user-line"
                      isDarkMode={isDarkMode}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.name}
                      required
                      autoComplete="name"
                    />
                    <FormInput
                      id="email"
                      name="email"
                      type="email"
                      label={t('Your email', 'Uw e-mail')}
                      icon="ri-mail-line"
                      isDarkMode={isDarkMode}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email}
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Subject */}
                  <FormInput
                    id="subject"
                    name="subject"
                    type="text"
                    label={t("What's this about?", 'Waar gaat het over?')}
                    icon="ri-chat-1-line"
                    isDarkMode={isDarkMode}
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.subject}
                    required
                  />

                  {/* Message */}
                  <FormTextarea
                    id="message"
                    name="message"
                    label={t(
                      'Tell me about your project or idea...',
                      'Vertel me over uw project of idee...',
                    )}
                    icon="ri-message-3-line"
                    isDarkMode={isDarkMode}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.message}
                    required
                    rows={5}
                  />

                  {/* Submit — extra bottom margin ensures it's never cut off */}
                  <div className="pb-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        'w-full flex items-center justify-center gap-2.5',
                        'py-3.5 px-6 rounded-xl text-sm font-semibold text-white',
                        'bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)]',
                        'shadow-lg hover:shadow-[var(--primary)]/30',
                        'transition-all duration-250 hover:scale-[1.02] active:scale-[0.98]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                      )}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          {t('Sending...', 'Versturen...')}
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-line text-base" />
                          {t('Send Message', 'Verstuur Bericht')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ── Right: Info + Map ───────────────────────────────────────── */}
            <div className="order-2 flex flex-col gap-5">
              {/* Status pills */}
              <div className="flex flex-wrap gap-3">
                {/* Location */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                    isDarkMode
                      ? 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)]'
                      : 'bg-white border border-gray-200 text-gray-600',
                  )}
                >
                  <i className="ri-map-pin-2-line text-[var(--primary)]" />
                  {t('Based in Amsterdam', 'Gevestigd in Amsterdam')}
                </div>

                {/* Availability */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                    isDarkMode
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-green-50 border border-green-200 text-green-700',
                  )}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
                  {t('Available for AI projects', 'Beschikbaar voor AI projecten')}
                </div>
              </div>

              {/* Quick contact links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className={cn(
                      'group flex items-center gap-3 p-3.5 rounded-xl',
                      'bento-card transition-all duration-250',
                      'hover:shadow-[0_0_24px_var(--primary-glow)]',
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                        'bg-gradient-to-br shadow-sm',
                        'group-hover:scale-110 transition-transform duration-250',
                        link.color,
                      )}
                    >
                      <i className={cn(link.icon, 'text-sm text-white')} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        {link.label}
                      </p>
                      <p className="text-xs font-medium text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors duration-200">
                        {link.value}
                      </p>
                    </div>
                    <i className="ri-arrow-right-up-line text-[var(--text-muted)] ml-auto text-sm group-hover:text-[var(--primary)] transition-colors duration-200" />
                  </a>
                ))}
              </div>

              {/* Map embed */}
              <div className={cn('bento-card overflow-hidden flex-1')}>
                <div
                  className={cn(
                    'px-4 py-3 border-b flex items-center gap-2',
                    isDarkMode ? 'border-[var(--border)]' : 'border-gray-100',
                  )}
                >
                  <i className="ri-map-2-line text-sm text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {t('Based in Amsterdam', 'Gevestigd in Amsterdam')}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] ml-auto truncate hidden sm:block">
                    Amsterdam-Zuid, Netherlands
                  </span>
                </div>
                <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden">
                  <iframe
                    title={t('Amsterdam location map', 'Amsterdam locatiekaart')}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19500.474268381622!2d4.848801944608884!3d52.342140875020675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609fd919e5b05%3A0xfadb36a3b89991d8!2sAmsterdam-Zuid%2C%20Amsterdam!5e0!3m2!1sen!2snl!4v1680872096824!5m2!1sen!2snl"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={isDarkMode ? { filter: 'invert(0.85) hue-rotate(180deg) saturate(0.8)' } : {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
