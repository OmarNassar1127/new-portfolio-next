'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

/** Copies `value` and confirms through an aria-live region. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context or permissions): the text stays selectable.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-body',
          'transition-[background-color,color] duration-200 hover:bg-surface-2 hover:text-ink',
          className,
        )}
      >
        {copied ? (
          <Check weight="bold" aria-hidden="true" className="size-4 text-signal-ink" />
        ) : (
          <Copy weight="bold" aria-hidden="true" className="size-4" />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t('Copied to clipboard', 'Gekopieerd naar klembord') : ''}
      </span>
    </>
  );
}
