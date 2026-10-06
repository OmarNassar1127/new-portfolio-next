import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectsArchive, { ProjectsArchiveView } from '@/components/projects/ProjectsArchive';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'All AI agent systems, multi-agent platforms, and full-stack projects built by Omar Nassar. Enterprise RAG, WhatsApp AI agents, computer vision, and more.',
};

export default function ProjectsPage() {
  // The fallback is the full archive, so the static HTML lists every project.
  return (
    <Suspense fallback={<ProjectsArchiveView />}>
      <ProjectsArchive />
    </Suspense>
  );
}
