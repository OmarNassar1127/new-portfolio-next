'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useSectionInView } from '@/hooks/useSectionInView';
import { certificationsData, type Certification } from '@/data/certifications';

/* ─── Inline Google SVG logo (kept color for brand recognition) ──────── */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={cn('h-7 w-7', className)} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/* ─── Issuer logo resolver ───────────────────────────────────────────── */
function IssuerLogo({ cert, className }: { cert: Certification; className?: string }) {
  if (cert.logo === 'google') return <GoogleLogo className={className} />;
  if (cert.logoPath) {
    return (
      <span
        className={cn(
          'relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden',
          cert.logo === 'anthropic' && 'rounded-md',
          className,
        )}
      >
        <Image
          src={cert.logoPath}
          alt=""
          fill
          sizes="28px"
          className="object-contain"
        />
      </span>
    );
  }
  return (
    <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--text)] text-xs font-bold text-[var(--bg)]', className)}>
      {cert.issuer.charAt(0)}
    </span>
  );
}

/* ─── Single credential plate ────────────────────────────────────────── */
function CredentialPlate({ cert, index }: { cert: Certification; index: number }) {
  const hasCredential = cert.credentialUrl !== null;
  const verifyContent = (
    <article className="group relative flex h-full flex-col justify-between gap-6 rounded-lg border border-[var(--rule)] bg-[var(--bg-elevated)] p-5 transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-20px_rgba(10,11,17,0.25)] hover:-translate-y-0.5">
      {/* Editorial corner number (decorative) */}
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-subtle)]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Top: logo */}
      <div className="flex items-center gap-2.5">
        <IssuerLogo cert={cert} />
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {cert.issuer}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            {cert.date}
          </span>
        </div>
      </div>

      {/* Middle: title */}
      <h3 className="text-balance text-[15px] font-semibold leading-snug text-[var(--text)] sm:text-base">
        {cert.title}
      </h3>

      {/* Footer: skills + verify */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {cert.skills.slice(0, 3).map((skill, i) => (
            <span key={skill} className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <span>{skill}</span>
              {i < Math.min(cert.skills.length, 3) - 1 && (
                <span className="opacity-50">·</span>
              )}
            </span>
          ))}
        </div>

        <span aria-hidden="true" className="block h-px w-full bg-[var(--rule)]" />

        <span
          className={cn(
            'flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]',
            hasCredential ? 'text-[var(--text)]' : 'text-[var(--text-subtle)]',
          )}
        >
          {hasCredential ? 'Verify' : 'On record'}
          <i
            className={cn(
              'text-base transition-transform duration-300',
              hasCredential
                ? 'ri-arrow-right-up-line text-[var(--text-subtle)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-deep)]'
                : 'ri-checkbox-circle-line text-[var(--signal-emerald)] opacity-70',
            )}
          />
        </span>
      </div>
    </article>
  );

  if (hasCredential) {
    return (
      <li>
        <a
          href={cert.credentialUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
        >
          {verifyContent}
        </a>
      </li>
    );
  }
  return <li>{verifyContent}</li>;
}

/* ─── Certifications — editorial credentials wall ────────────────────── */
export default function Certifications() {
  const { t } = useLanguage();
  const ref = useSectionInView<HTMLOListElement>();

  // Group certs by issuer for the trust strip
  const issuers = Array.from(new Set(certificationsData.map((c) => c.issuer)));

  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
    >
      {/* Quiet violet wash from the left */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(124,92,252,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ════ Editorial header ════════════════════════════════════════ */}
        <header className="mb-10 lg:mb-14">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">
              <span className="text-[var(--accent)]">05</span>
              <span>{t('Credentials', 'Credentials')}</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline">
              {t(
                `${certificationsData.length} on record · Verified by issuer`,
                `${certificationsData.length} op record · Geverifieerd door uitgever`,
              )}
            </span>
          </div>
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            {t('Credentials, ', 'Credentials, ')}
            <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
              {t('on file.', 'op dossier.')}
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {t(
              'Verified through ',
              'Geverifieerd via ',
            )}
            {issuers.map((issuer, i) => (
              <span key={issuer}>
                <span className="font-medium text-[var(--text)]">{issuer}</span>
                {i < issuers.length - 2 ? ', ' : i === issuers.length - 2 ? t(' and ', ' en ') : t('. Always learning what ships.', '. Altijd lerend wat in productie staat.')}
              </span>
            ))}
          </p>
          <span className="mt-8 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        </header>

        {/* ════ Issuer trust strip ══════════════════════════════════════ */}
        <div className="mb-10 flex flex-wrap items-center gap-x-10 gap-y-5 sm:mb-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            {t('Issued by', 'Uitgegeven door')}
          </span>
          {issuers.map((issuer) => {
            const cert = certificationsData.find((c) => c.issuer === issuer)!;
            return (
              <div key={issuer} className="flex items-center gap-2.5">
                <IssuerLogo cert={cert} className="opacity-90" />
                <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--text)]">
                  {issuer}
                </span>
              </div>
            );
          })}
        </div>

        {/* ════ Credentials wall ════════════════════════════════════════ */}
        <ol
          ref={ref}
          role="list"
          className="section-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {certificationsData.map((cert, idx) => (
            <CredentialPlate key={cert.id} cert={cert} index={idx} />
          ))}
        </ol>
      </div>
    </section>
  );
}
