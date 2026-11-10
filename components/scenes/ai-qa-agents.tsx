'use client';

/**
 * The QA rig: a three.js simulator built with the teardown kit (source in sims/qa-rig-*), shipped as one
 * self-contained page in public/sims. Wide frame on desktop, the page's portrait layout on phones.
 */
import type { Project } from '@/data/projects';

export default function AiQaAgentsScene({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={`${className ?? ''} relative aspect-[9/15]! overflow-hidden bg-[#f3eee6] md:aspect-video!`}>
      <iframe
        src="/sims/qa-rig.html"
        title={`${project.title}: interactive simulator of the QA rig. Seven agent phones on docks send findings through a verifier gate; confirmed bugs fill a tray, rejected ones drop in a bin.`}
        loading="lazy"
        className="absolute inset-0 size-full border-0"
      />
      <a
        href="/sims/qa-rig.html"
        target="_blank"
        rel="noopener"
        className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[11px] text-ink shadow-sm"
      >
        Full screen
      </a>
    </div>
  );
}
