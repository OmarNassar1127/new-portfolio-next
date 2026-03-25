import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import ProjectsGrid from '@/components/sections/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'All AI agent systems, multi-agent platforms, and full-stack projects built by Omar Nassar. Enterprise RAG, WhatsApp AI agents, computer vision, and more.',
};

export default function ProjectsPage() {
  return <ProjectsGrid projects={projects} />;
}
