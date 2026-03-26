"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { personal } from "@/data/personal";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/* ─── Content data ────────────────────────────────────────────────────── */
const paragraphs = {
  en: [
    "I'm an AI Engineer in Amsterdam who believes most AI demos are vaporware — I build the ones that aren't. At Vloto B.V., I've shipped on-premise AI solutions and automations that serve both the company and our users — our WhatsApp agent alone resolves over 55% of all customer conversations autonomously. On the side, I co-founded Virelio to bring that same production-grade AI to other companies.",
    "Multi-agent orchestration, RAG architectures, WhatsApp agents, voice AI — if it involves LLMs and needs to work in production, that's my playground.",
  ],
  nl: [
    "Ik ben een AI Engineer in Amsterdam die gelooft dat de meeste AI-demo's lucht zijn — ik bouw de exemplaren die dat niet zijn. Bij Vloto B.V. heb ik on-premise AI-oplossingen en automatiseringen opgeleverd die zowel het bedrijf als onze gebruikers dienen — onze WhatsApp-agent lost inmiddels meer dan 55% van alle klantgesprekken zelfstandig op. Daarnaast heb ik Virelio mede-opgericht om diezelfde productie-AI naar andere bedrijven te brengen.",
    "Multi-agent orchestratie, RAG-architecturen, WhatsApp-agents, voice AI — als het LLM's omvat en in productie moet werken, is dat mijn speeltuin.",
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

/* ─── Skill chips ─────────────────────────────────────────────────────── */
const highlights = [
  { icon: "ri-cpu-line", text: { en: "On-premise AI", nl: "On-premise AI" } },
  {
    icon: "ri-team-line",
    text: { en: "Multi-agent Systems", nl: "Multi-agent Systemen" },
  },
  {
    icon: "ri-database-2-line",
    text: { en: "RAG Architectures", nl: "RAG Architecturen" },
  },
  { icon: "ri-chat-voice-line", text: { en: "Voice AI", nl: "Voice AI" } },
];

/* ─── About Section ───────────────────────────────────────────────────── */
export default function About() {
  const { language, t } = useLanguage();
  const lang = language === "NL" ? "nl" : "en";
  const isMobile = useMediaQuery("(max-width: 768px)");

  /* Subtle parallax on photo — disabled on mobile to avoid jank */
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: photoContainerRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["4%", "-4%"]);
  const photoScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isMobile ? [1, 1, 1] : [0.97, 1, 0.97],
  );

  /* Entrance variants — fade only on mobile, slide on desktop */
  const slideLeft = {
    initial: isMobile ? { opacity: 0 } : { opacity: 0, x: -40 },
    whileInView: isMobile ? { opacity: 1 } : { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: isMobile
      ? { duration: 0.3 }
      : { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  };

  const slideRight = {
    initial: isMobile ? { opacity: 0 } : { opacity: 0, x: 40 },
    whileInView: isMobile ? { opacity: 1 } : { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: isMobile
      ? { duration: 0.3 }
      : { duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const },
  };

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
            "radial-gradient(ellipse 55% 60% at 0% 50%, rgba(136,115,239,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left column: text ──────────────────────────────────────── */}
          <motion.div {...slideLeft} className="flex flex-col gap-6">
            {/* Label */}
            <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {t("About", "Over Mij")}
            </p>

            {/* Heading */}
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              {t("Building AI that ", "AI bouwen die ")}
              <span className="gradient-text-static">
                {t("actually works.", "echt werkt.")}
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
                    "hover:border-[rgba(136,115,239,0.35)] hover:text-[var(--primary)]",
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
            {...slideRight}
            ref={photoContainerRef}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-[280px] sm:w-auto">
              {/* Glow ring behind the photo */}
              <div
                className="absolute -inset-3 rounded-3xl opacity-50 blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(136,115,239,0.25) 0%, rgba(0,212,255,0.1) 60%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              {/* Photo with parallax */}
              <motion.div
                style={{ y: photoY, scale: photoScale }}
                className={cn(
                  "relative overflow-hidden rounded-3xl",
                  "h-[340px] w-full sm:h-[460px] sm:w-[360px]",
                  "border border-[rgba(136,115,239,0.25)]",
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
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(10,15,28,0.6)] to-transparent" />
              </motion.div>

              {/* Floating badge: available */}
              <motion.div
                initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={
                  isMobile
                    ? { duration: 0.3 }
                    : { duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] as const }
                }
                className={cn(
                  "absolute flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-lg",
                  "bg-emerald-600 border border-emerald-500/30",
                  isMobile ? "bottom-3 left-3" : "-bottom-4 -left-4",
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
                initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: -10 }}
                whileInView={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={
                  isMobile
                    ? { duration: 0.3 }
                    : { duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] as const }
                }
                className={cn(
                  "absolute flex items-center gap-2 rounded-2xl px-4 py-2.5",
                  "glass border border-[var(--border)] shadow-lg",
                  isMobile ? "right-3 top-3" : "-right-5 top-6",
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
