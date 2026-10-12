'use client';

/**
 * Case-study hero scenes, one per project slug. Each scene is its own chunk,
 * so a page only loads its own. Projects without a scene keep the editorial
 * ProjectCover. The Selected work grid always uses ProjectCover.
 */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { Project } from '@/data/projects';
import { ProjectCover } from '@/components/ui/ProjectCover';

type SceneProps = { project: Project; className?: string };

const SCENES: Record<string, ComponentType<SceneProps>> = {
  'invoice-fraud-prevention-platform': dynamic(() => import('./invoice-fraud-prevention-platform'), { ssr: false }),
  'slouch-ai-posture-coach': dynamic(() => import('./slouch-ai-posture-coach'), { ssr: false }),
  'whatsapp-ai-business-agent': dynamic(() => import('./whatsapp-ai-business-agent'), { ssr: false }),
  'ai-image-editor': dynamic(() => import('./ai-image-editor'), { ssr: false }),
  'enterprise-rag-platform': dynamic(() => import('./enterprise-rag-platform'), { ssr: false }),
  'full-stack-multi-agent': dynamic(() => import('./full-stack-multi-agent'), { ssr: false }),
  'outlook-agenda-ai': dynamic(() => import('./outlook-agenda-ai'), { ssr: false }),
  'linkedin-ai-outreach': dynamic(() => import('./linkedin-ai-outreach'), { ssr: false }),
  'ai-meeting-assistant-voice-automation': dynamic(() => import('./ai-meeting-assistant-voice-automation'), { ssr: false }),
  'ai-website-builder': dynamic(() => import('./ai-website-builder'), { ssr: false }),
  'personal-full-stack-agent': dynamic(() => import('./personal-full-stack-agent'), { ssr: false }),
  'claude-workflow-automator': dynamic(() => import('./claude-workflow-automator'), { ssr: false }),
  'autonomous-research-agent': dynamic(() => import('./autonomous-research-agent'), { ssr: false }),
  'enterprise-ai-platform': dynamic(() => import('./enterprise-ai-platform'), { ssr: false }),
  'vloto-bv': dynamic(() => import('./vloto-bv'), { ssr: false }),
  'license-plate-detection-system': dynamic(() => import('./license-plate-detection-system'), { ssr: false }),
  'house-scraper-platform': dynamic(() => import('./house-scraper-platform'), { ssr: false }),
  'image-segmentation-model': dynamic(() => import('./image-segmentation-model'), { ssr: false }),
  'medical-technical-file-builder': dynamic(() => import('./medical-technical-file-builder'), { ssr: false }),
  'ai-customer-support': dynamic(() => import('./ai-customer-support'), { ssr: false }),
  'sliced-marketplace': dynamic(() => import('./sliced-marketplace'), { ssr: false }),
  'yamba': dynamic(() => import('./yamba'), { ssr: false }),
  'tic-tac-toe': dynamic(() => import('./tic-tac-toe'), { ssr: false }),
  'snake-3d': dynamic(() => import('./snake-3d'), { ssr: false }),
  'restaurant-management-system': dynamic(() => import('./restaurant-management-system'), { ssr: false }),
  'myaddbooker': dynamic(() => import('./myaddbooker'), { ssr: false }),
  'blog-website': dynamic(() => import('./blog-website'), { ssr: false }),
};

export function ProjectScene({ project, className }: SceneProps) {
  const Scene = SCENES[project.slug];
  if (!Scene) return <ProjectCover project={project} className={className} />;
  return <Scene project={project} className={className} />;
}
