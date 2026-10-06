'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { ArrowUp, GithubLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react';
import { personal } from '@/data/personal';
import { useLanguage } from '@/hooks/useLanguage';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const LINKS = [
  { href: '#portfolio', en: 'Work', nl: 'Werk' },
  { href: '#about-me', en: 'About', nl: 'Over' },
  { href: '#journey', en: 'Journey', nl: 'Reis' },
  { href: '#tools', en: 'Tools', nl: 'Tools' },
  { href: '#contact', en: 'Contact', nl: 'Contact' },
];

const SOCIALS = [
  { href: personal.github, label: 'GitHub', Icon: GithubLogo },
  { href: personal.linkedin, label: 'LinkedIn', Icon: LinkedinLogo },
  { href: personal.twitter, label: 'X', Icon: XLogo },
];

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const lenis = useLenis();
  const reduce = usePrefersReducedMotion();

  const linkClass = 'text-body transition-colors duration-200 hover:text-ink';

  return (
    <footer className="border-t border-hairline px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <nav aria-label={t('Footer', 'Footer')}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {LINKS.map((link) => (
              <li key={link.href}>
                {isHome ? (
                  <a href={link.href} className={linkClass}>
                    {t(link.en, link.nl)}
                  </a>
                ) : (
                  <Link href={`/${link.href}`} className={linkClass}>
                    {t(link.en, link.nl)}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/projects/" className={linkClass}>
                {t('All projects', 'Alle projecten')}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-11 items-center justify-center rounded-full text-body transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <Icon weight="bold" aria-hidden="true" className="size-5" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { immediate: !!reduce }) : window.scrollTo(0, 0))}
            aria-label={t('Back to top', 'Terug naar boven')}
            className="ml-2 flex size-11 items-center justify-center rounded-full border border-hairline-strong text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            <ArrowUp weight="bold" aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1400px] flex-col gap-2 border-t border-hairline pt-6 text-sm text-mute sm:flex-row sm:justify-between">
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Omar Nassar
        </p>
        <p>{t('Built with Next.js. Set in Mona Sans.', 'Gebouwd met Next.js. Gezet in Mona Sans.')}</p>
      </div>
    </footer>
  );
}
