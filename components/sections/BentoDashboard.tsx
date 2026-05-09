"use client";

// motion removed — CSS animations only
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { useLanguage } from "@/hooks/useLanguage";
import { useSectionInView } from "@/hooks/useSectionInView";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

/* ─── AnimatedCounter ─────────────────────────────────────────────────── */
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  return (
    <span ref={ref}>
      {prefix}
      {inView ? <CountUp end={end} duration={duration} separator="," /> : String(end)}
      {suffix}
    </span>
  );
}

/* ─── Tech stack pills ────────────────────────────────────────────────── */
const techStack = [
  { name: "Anthropic", color: "rgba(204,115,68,0.15)", text: "#cc7344" },
  { name: "OpenAI", color: "rgba(16,163,127,0.15)", text: "#10a37f" },
  { name: "LangChain", color: "rgba(124, 92, 252,0.15)", text: "var(--primary)" },
  { name: "CrewAI", color: "rgba(255,100,100,0.15)", text: "#ff6464" },
  { name: "React", color: "rgba(97,218,251,0.15)", text: "#61dafb" },
  { name: "Python", color: "rgba(255,212,59,0.12)", text: "#ffd43b" },
  { name: "Node.js", color: "rgba(104,183,68,0.15)", text: "#68b744" },
  { name: "Next.js", color: "rgba(232,234,240,0.08)", text: "var(--text)" },
  { name: "Laravel", color: "rgba(255,77,55,0.12)", text: "#ff4d37" },
  { name: "TypeScript", color: "rgba(49,120,198,0.15)", text: "#3178c6" },
  { name: "Azure", color: "rgba(0,120,212,0.15)", text: "#0078d4" },
  { name: "Docker", color: "rgba(32,159,223,0.15)", text: "#209fdf" },
  { name: "FastAPI", color: "rgba(0,150,136,0.15)", text: "#009688" },
  { name: "Supabase", color: "rgba(62,207,142,0.15)", text: "#3ecf8e" },
  { name: "Tailwind", color: "rgba(56,189,248,0.15)", text: "#38bdf8" },
];


/* ─── BentoDashboard ──────────────────────────────────────────────────── */
export default function BentoDashboard() {
  const { t } = useLanguage();
  const gridRef = useSectionInView<HTMLDivElement>();

  return (
    <section
      id="bento"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* Subtle section background accent */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124, 92, 252,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading — editorial */}
        <div className="mb-14">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="eyebrow">
              <span className="text-[var(--accent)]">02</span>
              <span>{t("Overview", "Overzicht")}</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-subtle)] sm:inline">
              {t("Live · Updated 2026", "Live · Bijgewerkt 2026")}
            </span>
          </div>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
            {t("At a ", "In één ")}
            <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
              {t("glance", "oogopslag")}
            </span>
            {t(", the operator profile.", ", het operator-profiel.")}
          </h2>
          <span className="mt-6 block h-px w-full bg-[var(--rule)]" aria-hidden="true" />
        </div>

        {/* Bento grid — plain divs, section-level motion handles the reveal */}
        <div ref={gridRef} className="section-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Card 1 — Current role (2 cols) */}
          <div className="sm:col-span-2">
            <SpotlightCard className="h-full min-h-[160px] p-6">
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(124, 92, 252,0.12)]">
                    <i className="ri-briefcase-4-line text-lg text-[var(--primary)]" />
                  </span>
                  <div>
                    <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                      {t("Current Role", "Huidige Rol")}
                    </p>
                    <h3 className="text-base font-bold leading-snug text-[var(--text)]">
                      AI Engineer{" "}
                      <span className="text-[var(--primary)]">
                        @ Vloto B.V.
                      </span>
                    </h3>
                    <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                      {t("Founder", "Oprichter")} ·{" "}
                      <a
                        href="https://virelio.nl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--accent-deep)] underline decoration-[var(--accent)]/30 underline-offset-4 hover:decoration-[var(--accent)]"
                      >
                        Virelio
                      </a>
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {t(
                    "Building the AI systems and the backend powering them. WhatsApp agents, voice AI, on-premise LLMs, fraud-prevention models, plus the booking algorithms and dashboards keeping it all running. 80,000+ users.",
                    "De AI-systemen bouwen en de backend eronder. WhatsApp-agenten, voice AI, on-premise LLM's, fraudepreventie, plus de boekingsalgoritmes en dashboards eronder. 80.000+ gebruikers.",
                  )}
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2 — Years counter (1 col) */}
          <div>
            <SpotlightCard className="h-full min-h-[160px] p-6">
              <div className="flex h-full flex-col justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(245,121,59,0.12)]">
                  <i className="ri-time-line text-lg text-[var(--accent)]" />
                </span>
                <div>
                  <p className="display-serif text-5xl font-semibold leading-none text-[var(--text)]">
                    <AnimatedCounter end={7} suffix="+" />
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {t("Years in Tech", "Jaar in Tech")}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3 — Projects counter (1 col) */}
          <div>
            <SpotlightCard className="h-full min-h-[160px] p-6">
              <div className="flex h-full flex-col justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(232,184,110,0.18)]">
                  <i className="ri-rocket-2-line text-lg text-[var(--signal-gold)]" />
                </span>
                <div>
                  <p className="display-serif text-5xl font-semibold leading-none text-[var(--text)]">
                    <AnimatedCounter end={30} suffix="+" />
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    {t("AI Systems Built", "AI Systemen Gebouwd")}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4 — Tech stack (2 cols) */}
          <div className="sm:col-span-2">
            <SpotlightCard className="h-full p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                {t("Tech Stack", "Technologieën")}
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className="rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105"
                    style={{
                      background: tech.color,
                      color: tech.text,
                      border: `1px solid ${tech.color.replace(/[\d.]+\)$/, "0.35)")}`,
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* Card 5 — Location (1 col) */}
          <div>
            <SpotlightCard className="h-full min-h-[140px] p-6">
              <div className="flex h-full flex-col justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(124, 92, 252,0.1)]">
                  <i className="ri-map-pin-2-line text-lg text-[var(--primary)]" />
                </span>
                <div>
                  <p className="text-lg font-bold text-[var(--text)]">
                    Amsterdam
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {/* Netherlands flag — horizontal stripes */}
                    <span className="flex flex-col h-3 w-5 overflow-hidden rounded-sm">
                      <span className="flex-1 bg-[#ae1c28]" />
                      <span className="flex-1 bg-white" />
                      <span className="flex-1 bg-[#21468b]" />
                    </span>
                    <p className="text-xs text-[var(--text-muted)]">
                      Netherlands
                    </p>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 6 — Status (1 col) */}
          <div>
            <SpotlightCard
              className="h-full min-h-[140px] p-6"
              spotlightColor="rgba(245, 121, 59, 0.12)"
            >
              <div className="flex h-full flex-col justify-between">
                {/* Pulsing status dot */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
                    {t("Available", "Beschikbaar")}
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold leading-snug text-[var(--text)]">
                    {t("Open to AI Projects", "Beschikbaar voor AI Projecten")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {t("Freelance & consulting", "Freelance & consulting")}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 7 — Monthly impact stat (full width) */}
          <div className="sm:col-span-2 md:col-span-4">
            <SpotlightCard
              className="p-6"
              spotlightColor="rgba(124, 92, 252,0.12)"
            >
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(124, 92, 252,0.12)]">
                    <i className="ri-line-chart-line text-xl text-[var(--primary)]" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                      {t(
                        "Monthly Business Impact",
                        "Maandelijkse Bedrijfsimpact",
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                      {t(
                        "Generated through AI automation and deployed systems",
                        "Gegenereerd via AI-automatisering en geïmplementeerde systemen",
                      )}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="display-serif text-4xl font-semibold leading-none text-[var(--text)] sm:text-5xl">
                    €<AnimatedCounter end={50} suffix="K+" duration={2.5} />
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
