import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, getProjectBySlug } from '@/data/projects';
import ProjectCaseStudy from '@/components/sections/ProjectCaseStudy';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const description = project.description.en.slice(0, 160);

  return {
    title: project.title,
    description,
    openGraph: {
      title: `${project.title} | Omar Nassar`,
      description,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Omar Nassar`,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const sortedProjects = [...projects].sort(
    (a, b) => a.priority - b.priority
  );
  const currentIndex = sortedProjects.findIndex((p) => p.slug === slug);
  const prevProject =
    currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < sortedProjects.length - 1
      ? sortedProjects[currentIndex + 1]
      : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description.en,
    dateCreated: project.date,
    author: { '@id': 'https://omardev.xyz/#person' },
    keywords: project.technologies,
    ...(project.siteUrl ? { url: project.siteUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectCaseStudy
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  );
}
