import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/hooks/useLanguage";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorSpotlight } from "@/components/effects/CursorSpotlight";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { personal } from "@/data/personal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omardev.xyz"),
  title: {
    default:
      "Omar Nassar | AI Agent Engineer & Full Stack Developer — Amsterdam",
    template: "%s | Omar Nassar",
  },
  description:
    "Omar Nassar — AI Agent Engineer & Full Stack Developer in Amsterdam. Building custom AI agents, autonomous multi-agent systems, WhatsApp AI agents, sales agents, operations agents, and enterprise RAG platforms. Founder of Virelio.",
  keywords: [
    "AI agent developer",
    "AI agents Amsterdam",
    "multi-agent systems",
    "WhatsApp AI agent",
    "autonomous AI agents",
    "AI automation",
    "RAG architect",
    "enterprise AI",
    "CrewAI developer",
    "LangGraph developer",
    "AI agent builder",
    "Omar Nassar",
  ],
  authors: [{ name: "Omar Nassar" }],
  creator: "Omar Nassar",
  openGraph: {
    type: "website",
    url: "https://omardev.xyz/",
    title: "Omar Nassar | AI Agent Engineer — Building Autonomous AI Systems",
    description:
      "AI Agent Engineer building autonomous multi-agent systems, WhatsApp AI agents, sales agents, customer service agents, and enterprise RAG platforms. 30+ AI systems deployed, 200+ automations, serving 80,000+ users. Amsterdam.",
    images: [
      {
        url: "/images/me2.png",
        width: 512,
        height: 512,
        alt: "Omar Nassar - AI Agent Engineer",
      },
    ],
    locale: "en_US",
    alternateLocale: "nl_NL",
    siteName: "Omar Nassar - AI Agent Engineer Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omar Nassar | AI Agent Engineer — Autonomous AI Systems",
    description:
      "Building autonomous AI agents: WhatsApp agents, sales agents, customer service agents, operations agents, multi-agent systems. 30+ AI systems deployed. Amsterdam.",
    images: ["/images/me2.png"],
    site: "@GodelTrabuco69",
    creator: "@GodelTrabuco69",
  },
  verification: {
    google: personal.googleVerification,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://omardev.xyz/#person",
      name: "Omar Nassar",
      url: "https://omardev.xyz",
      image: "https://omardev.xyz/images/me2.png",
      jobTitle: "AI Agent Engineer & Full Stack Developer",
      description:
        "AI Agent Engineer and Full Stack Developer based in Amsterdam. Builds autonomous AI agents for businesses — WhatsApp AI agents, sales automation agents, customer service agents, operations agents, and enterprise multi-agent systems. Founder of Virelio, an AI agency delivering custom AI agent teams. Has deployed 30+ AI systems serving 80,000+ users, built 200+ automation workflows, and architected on-premise LLM platforms with multi-agent orchestration using CrewAI, LangGraph, and RAG architectures.",
      email: "mailto:omarnassar1127@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Amsterdam",
        addressRegion: "Noord-Holland",
        addressCountry: "NL",
      },
      knowsAbout: [
        "AI Agents",
        "Custom AI Agent Development",
        "Autonomous AI Agents",
        "Multi-Agent Systems",
        "Multi-Agent Orchestration",
        "WhatsApp AI Agents",
        "Sales Automation Agents",
        "Customer Service AI Agents",
        "Operations Automation Agents",
        "RAG Architecture",
        "Retrieval-Augmented Generation",
        "LangChain",
        "LangGraph",
        "CrewAI",
        "Large Language Models",
        "GPT-4",
        "Claude",
        "Gemini",
        "On-Premise AI Deployment",
        "Ollama",
        "Prompt Engineering",
        "AI Workflow Automation",
        "Enterprise AI",
        "Machine Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Full Stack Development",
        "Python",
        "React",
        "Node.js",
        "FastAPI",
        "Laravel",
      ],
      sameAs: [
        "https://github.com/OmarNassar1127",
        "https://www.linkedin.com/in/omar-nassar-93a176155/",
        "https://twitter.com/GodelTrabuco69",
        "https://virelio.nl",
        "https://virelio.nl",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Vloto B.V.",
        url: "https://vloto.nl",
      },
      knowsLanguage: ["en", "nl"],
      nationality: { "@type": "Country", name: "Netherlands" },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://omardev.xyz/#profilepage",
      name: "Omar Nassar | AI Agent Engineer & Full Stack Developer",
      url: "https://omardev.xyz",
      description:
        "Portfolio of Omar Nassar — AI Agent Engineer building autonomous AI agents, multi-agent systems, and enterprise RAG platforms. Founder of Virelio.",
      mainEntity: { "@id": "https://omardev.xyz/#person" },
      dateCreated: "2023-01-01",
      dateModified: "2026-03-25",
      inLanguage: ["en", "nl"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["meta[name='description']", "title"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://omardev.xyz/#website",
      name: "Omar Nassar - AI Agent Engineer Portfolio",
      url: "https://omardev.xyz",
      description:
        "Portfolio of Omar Nassar, AI Agent Engineer based in Amsterdam. Specializing in autonomous AI agents, multi-agent systems, WhatsApp AI agents, enterprise AI, and RAG platforms.",
      author: { "@id": "https://omardev.xyz/#person" },
      inLanguage: ["en", "nl"],
    },
    {
      "@type": "Organization",
      "@id": "https://virelio.nl/#organization",
      name: "Virelio",
      url: "https://virelio.nl",
      description:
        "Amsterdam-based AI agency building custom autonomous AI agent teams for businesses. Founded by Omar Nassar.",
      founder: { "@id": "https://omardev.xyz/#person" },
      foundingDate: "2023",
      areaServed: "Europe",
      sameAs: ["https://virelio.nl", "https://virelio.nl"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScroll>
              <CursorSpotlight />
              <NoiseOverlay />
              <ScrollProgress />
              <Header />
              <main>{children}</main>
              <Footer />
            </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${personal.ga4Id}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${personal.ga4Id}');
          `}
        </Script>
      </body>
    </html>
  );
}
