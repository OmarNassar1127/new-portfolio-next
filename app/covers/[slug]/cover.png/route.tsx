import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getProjectBySlug, projects, type CoverTone } from '@/data/projects';

// Share image (og:image) in the same editorial style as the on-site ProjectCover.
// A route handler in a folder named `cover.png` so the static export writes a
// real .png file (GitHub Pages serves extensionless files as octet-stream).
// Satori needs woff/ttf (not woff2), hence the copies in assets/fonts (SIL OFL).

export const dynamic = 'force-static';

const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const TONES: Record<CoverTone, { bg: string; text: string; hero: string; line: string }> = {
  ink: { bg: '#141413', text: '#f2f2ee', hero: '#f2541a', line: 'rgba(242,242,238,0.28)' },
  signal: { bg: '#f2541a', text: '#0f0f0e', hero: '#0f0f0e', line: 'rgba(15,15,14,0.3)' },
  paper: { bg: '#e4e4df', text: '#0f0f0e', hero: '#0f0f0e', line: 'rgba(15,15,14,0.25)' },
};

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return new Response('Not found', { status: 404 });

  const [medium, heavy] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/MonaSans-Medium.woff')),
    readFile(join(process.cwd(), 'assets/fonts/MonaSans-ExtraBold.woff')),
  ]);

  const { cover } = project;
  const tone = TONES[cover.tone];
  const hero = cover.stat?.value ?? cover.subject ?? project.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 72,
          background: tone.bg,
          color: tone.text,
          fontFamily: 'Mona Sans',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 500 }}>
          <span style={{ maxWidth: 760 }}>{project.title}</span>
          <span style={{ opacity: 0.7 }}>{project.year}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div
            style={{
              fontSize: cover.stat ? 200 : 150,
              fontWeight: 800,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              color: tone.hero,
            }}
          >
            {hero}
          </div>
          {cover.stat && (
            <div style={{ marginTop: 18, fontSize: 34, fontWeight: 500, letterSpacing: '-0.01em' }}>
              {cover.stat.label.en}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {cover.flow.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: 28, height: 2, background: tone.line, margin: '0 10px' }} />}
                <div
                  style={{
                    display: 'flex',
                    border: `2px solid ${tone.line}`,
                    borderRadius: 999,
                    padding: '8px 20px',
                    fontSize: 22,
                    fontWeight: 500,
                  }}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>
          <span style={{ fontSize: 24, fontWeight: 500, opacity: 0.7 }}>omardev.xyz</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Mona Sans', data: medium, weight: 500, style: 'normal' },
        { name: 'Mona Sans', data: heavy, weight: 800, style: 'normal' },
      ],
    },
  );
}
