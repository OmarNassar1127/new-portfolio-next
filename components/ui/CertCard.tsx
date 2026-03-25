'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Certification } from '@/data/certifications';

interface CertCardProps {
  cert: Certification;
  className?: string;
}

/** Renders the four-color Google "G" SVG inline — no external asset needed. */
function GoogleLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Google"
      role="img"
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const LOGO_SIZE = 32;

export function CertCard({ cert, className }: CertCardProps) {
  const hasLink = Boolean(cert.credentialUrl);

  const cardContent = (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        'group relative flex flex-col gap-4 overflow-hidden rounded-xl p-5',
        'border border-[var(--border)] bg-[var(--card)]',
        'transition-[border-color,box-shadow] duration-300',
        'hover:shadow-[0_6px_28px_-8px_var(--primary-glow)]',
        hasLink && 'cursor-pointer',
        className
      )}
    >
      {/* Accent stripe */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b',
          cert.color
        )}
      />

      {/* Header: logo + issuer + date */}
      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            {cert.logo === 'google' ? (
              <GoogleLogo size={LOGO_SIZE} />
            ) : cert.logoPath ? (
              <Image
                src={cert.logoPath}
                alt={cert.issuer}
                width={LOGO_SIZE}
                height={LOGO_SIZE}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <i className="ri-award-line text-lg text-[var(--text-muted)]" />
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-[var(--text)]">
              {cert.issuer}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {cert.date}
            </span>
          </div>
        </div>

        {/* Category chip */}
        <span className="shrink-0 rounded-full bg-[var(--card-hover)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)] border border-[var(--border)]">
          {cert.category}
        </span>
      </div>

      {/* Title */}
      <p className="pl-3 text-sm font-semibold leading-snug text-[var(--text)] line-clamp-3 transition-colors duration-200 group-hover:text-[var(--primary)]">
        {cert.title}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 pl-3">
        {cert.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-[var(--card-hover)] px-2 py-0.5 text-[11px] text-[var(--text-muted)] border border-[var(--border)]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Credential link hint */}
      {hasLink && (
        <div className="flex items-center gap-1.5 pl-3 text-xs text-[var(--primary)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <i className="ri-external-link-line text-sm" />
          <span>View Credential</span>
        </div>
      )}
    </motion.div>
  );

  if (hasLink) {
    return (
      <a
        href={cert.credentialUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-xl"
        aria-label={`View credential: ${cert.title}`}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
