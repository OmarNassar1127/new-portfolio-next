import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omar Nassar | AI Agent Engineer & Full Stack Developer',
    short_name: 'Omar Nassar',
    description:
      'AI Agent Engineer portfolio: autonomous AI agents, multi-agent systems, and enterprise RAG platforms.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f4f2',
    theme_color: '#f4f4f2',
    icons: [
      {
        src: '/images/me2.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/me.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
