import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical insights on AI agents, multi-agent systems, RAG architectures, and full-stack development by Omar Nassar.',
};

export default function BlogPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">
        Coming Soon
      </span>
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
      <p className="text-muted max-w-lg mb-8">
        Technical deep-dives on AI agents, multi-agent orchestration, RAG
        architectures, and lessons from building production AI systems.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
      >
        <i className="ri-arrow-left-line" />
        Back to Home
      </Link>
    </div>
  );
}
