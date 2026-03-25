import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OG Image Preview',
  robots: { index: false, follow: false },
};

/**
 * This page renders the OG image design at 1200x630.
 * Screenshot this page to create your og-image.png.
 * Visit /og/ in your browser, take a screenshot, save as public/og-image.png
 */
export default function OGImagePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-8">
      <div
        style={{ width: 1200, height: 630 }}
        className="relative overflow-hidden rounded-none bg-[#0a0f1c] flex"
      >
        {/* Background gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#8873ef]/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#00d4ff]/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8873ef]/8 rounded-full blur-[120px]" />
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '192px 192px',
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Top */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#8873ef]" />
              <span className="text-[#8873ef] text-lg font-mono tracking-wider">omardev.xyz</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400 text-sm font-semibold">Available for AI Projects</span>
            </div>
          </div>

          {/* Center */}
          <div>
            <h1 className="text-[72px] font-bold text-white leading-[1.1] tracking-tight mb-4">
              Omar Nassar
            </h1>
            <p className="text-[32px] font-light tracking-tight" style={{
              background: 'linear-gradient(135deg, #8873ef, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI Engineer & Full Stack Developer
            </p>
          </div>

          {/* Bottom */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-6">
              {[
                { value: '30+', label: 'AI Systems' },
                { value: '200+', label: 'Automations' },
                { value: '80K+', label: 'Users Served' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {['Multi-Agent Systems', 'RAG', 'WhatsApp AI', 'LangChain'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
