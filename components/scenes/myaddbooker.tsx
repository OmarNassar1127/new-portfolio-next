'use client';

/** Placeholder until this project's scene is built: the editorial cover. */
import type { Project } from '@/data/projects';
import { ProjectCover } from '@/components/ui/ProjectCover';

export default function Scene({ project, className }: { project: Project; className?: string }) {
  return <ProjectCover project={project} className={className} />;
}
