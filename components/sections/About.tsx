"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { personal } from "@/data/personal";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

/* ─── Content data ────────────────────────────────────────────────────── */
const paragraphs = {
  en: [
    "I started as a frontend developer in 2017 and moved into backend a few years later. The stack runs wide: React, Next.js, Laravel, Node, Python, plus the infrastructure to actually run it in production. The AI work came after that. Multi-agent systems, RAG platforms, on-premise LLMs. It's the latest chapter, built on top of the foundation, not stacked next to it.",
    "At Vloto B.V., I build the AI systems and the backend they run on. The customer-facing WhatsApp agent resolves over 55% of conversations autonomously. There's voice AI for inbound calls, fraud-prevention models, on-premise LLM workflows running quietly inside the company, plus the booking algorithms, internal dashboards, and APIs underneath. With Virelio, I bring the same full-stack-to-AI approach to other companies.",
  ],
  nl: [
    "Ik ben in 2017 begonnen als frontend developer en ging een paar jaar later over op backend. De stack is breed: React, Next.js, Laravel, Node, Python, plus de infrastructuur om het ook echt in productie te draaien. Het AI-werk kwam daarna. Multi-agent systemen, RAG-platformen, on-premise LLM's. Het is het nieuwste hoofdstuk, gebouwd op het fundament, niet ernaast geplakt.",
    "Bij Vloto B.V. bouw ik de AI-systemen en de backend waarop ze draaien. De klantgerichte WhatsApp-agent lost meer dan 55% van de gesprekken autonoom op. Er is voice AI voor inkomende telefoontjes, fraudepreventie-modellen, on-premise LLM-workflows die intern stil hun werk doen, plus de boekingsalgoritmes, interne dashboards en API's eronder. Met Virelio breng ik diezelfde full-stack-tot-AI aanpak naar andere bedrijven.",
  ],
};

const socialProof = [
  {
    href: personal.github,
    icon: "ri-github-fill",
    label: { en: "GitHub", nl: "GitHub" },
  },
  {
    href: personal.linkedin,
    icon: "ri-linkedin-fill",
    label: { en: "LinkedIn", nl: "LinkedIn" },
  },
  {
    href: personal.virelio.site,
    icon: "ri-rocket-2-line",
    label: { en: "Virelio", nl: "Virelio" },
  },
];

/* ─── Skill chips — balanced full-stack + AI ────────────────────────── */
const highlights = [
  {
    icon: "ri-stack-line",
    text: { en: "Full-Stack Development", nl: "Full-Stack Ontwikkeling" },
  },
  {
    icon: "ri-reactjs-line",
    text: { en: "React / Next.js", nl: "React / Next.js" },
  },
  {
    icon: "ri-server-line",
    text: { en: "Laravel · Node · FastAPI", nl: "Laravel · Node · FastAPI" },
  },
  {
    icon: "ri-team-line",
    text: { en: "Multi-Agent Systems", nl: "Multi-agent Systemen" },
  },
  {
    icon: "ri-database-2-line",
    text: { en: "RAG Architectures", nl: "RAG Architecturen" },
  },
  { icon: "ri-cpu-line", text: { en: "On-Premise LLMs", nl: "On-premise LLM's" } },
];

/* ─── Shared animation presets — NO isMobile conditionals ────────────── */
const fadeLeft = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.05 as const },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

const fadeRight = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.05 as const },
  transition: { duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const },
};

/* ─── About Section ───────────────────────────────────────────────────── */
export default function About() {
  const { language, t } = useLanguage();
  const lang = language === "NL" ? "nl" : "en";

  return (
    <section
      id="about-me"
      className="relative overflow-hidden bg-[var(--bg)] px-4 py-20 sm:px-6 sm:py-28"
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 0% 50%, rgba(124, 92, 252,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left column: text ──────────────────────────────────────── */}
          <motion.div {...fadeLeft} className="flex flex-col gap-6 min-w-0">
            {/* Editorial eyebrow */}
            <span className="eyebrow">
              <span className="text-[var(--accent)]">·</span>
              <span>{t("About / Profile", "Over / Profiel")}</span>
            </span>

            {/* Heading — full-stack + AI balance */}
            <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              {t("Builds the full stack. ", "Bouwt de hele stack. ")}
              <span className="display-serif-italic font-medium text-[var(--accent-deep)]">
                {t("Ships the AI.", "Levert de AI.")}
              </span>
            </h2>

            {/* Paragraphs */}
            <div className="flex flex-col gap-4">
              {paragraphs[lang].map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-[var(--text-muted)] sm:text-[17px]"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Highlight chips */}
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <span
                  key={h.text.en}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5",
                    "text-xs font-medium text-[var(--text-muted)] transition-all duration-200",
                    "hover:border-[rgba(124, 92, 252,0.35)] hover:text-[var(--primary)]",
                  )}
                >
                  <i className={cn(h.icon, "text-sm text-[var(--primary)]")} />
                  {h.text[lang]}
                </span>
              ))}
            </div>

            {/* Social proof links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {socialProof.map((link) => (
                <a
                  key={link.label.en}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group inline-flex items-center gap-2 text-sm font-semibold",
                    "text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--primary)]",
                  )}
                >
                  <i
                    className={cn(
                      link.icon,
                      "text-lg transition-transform duration-200 group-hover:scale-110",
                    )}
                  />
                  {link.label[lang]}
                  <i className="ri-arrow-right-up-line text-xs opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Right column: photo ────────────────────────────────────── */}
          <motion.div
            {...fadeRight}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-[280px] sm:w-auto">
              {/* Glow ring behind the photo */}
              <div
                className="absolute -inset-3 rounded-3xl opacity-50 blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(124, 92, 252,0.25) 0%, rgba(245, 121, 59,0.1) 60%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              {/* Photo */}
              <div
                className={cn(
                  "relative overflow-hidden rounded-3xl",
                  "h-[340px] w-full sm:h-[460px] sm:w-[360px]",
                  "border border-[rgba(124, 92, 252,0.25)]",
                  "shadow-[0_32px_80px_-16px_rgba(0,0,0,0.4)]",
                )}
              >
                <Image
                  src="/images/me2.png"
                  alt="Omar Nassar — AI Engineer"
                  fill
                  sizes="(max-width: 640px) 280px, 360px"
                  className="object-cover object-top"
                  priority
                  loading="eager"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(10,15,28,0.6)] to-transparent" />
              </div>

              {/* Floating badge: available */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={cn(
                  "absolute flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-lg",
                  "bg-emerald-600 border border-emerald-500/30",
                  "bottom-3 left-3 sm:-bottom-4 sm:-left-4",
                )}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                <span className="text-sm font-bold text-white">
                  {t("Open to work", "Beschikbaar")}
                </span>
              </motion.div>

              {/* Floating badge: Amsterdam */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className={cn(
                  "absolute flex items-center gap-2 rounded-2xl px-4 py-2.5",
                  "glass border border-[var(--border)] shadow-lg",
                  "right-3 top-3 sm:-right-5 sm:top-6",
                )}
              >
                <i className="ri-map-pin-2-fill text-sm text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--text)]">
                  Amsterdam
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
