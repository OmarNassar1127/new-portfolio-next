import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omardev.xyz"),
  title: {
    default:
      "Omar Nassar | Full-Stack Engineer & AI Systems Builder, Amsterdam",
    template: "%s | Omar Nassar",
  },
  description:
    "Omar Nassar, full-stack engineer and AI systems builder in Amsterdam. Seven years across React, Next.js, Laravel, Node, and Python. Production AI agents, multi-agent systems, RAG platforms, on-premise LLM workflows, and the backend underneath. 50+ systems shipped. Founder of Virelio.",
  keywords: [
    "AI agent developer",
    "AI agents Amsterdam",
    "AI systems engineer",
    "AI workflows",
    "multi-agent systems",
    "WhatsApp AI agent",
    "voice AI",
    "autonomous AI agents",
    "AI automation",
    "RAG architect",
    "enterprise AI",
    "CrewAI developer",
    "LangGraph developer",
    "LangChain developer",
    "on-premise LLM",
    "AI agent builder",
    "full stack developer Amsterdam",
    "full-stack engineer",
    "React developer Amsterdam",
    "Next.js developer",
    "Laravel developer",
    "Node.js engineer",
    "TypeScript engineer",
    "backend engineer Amsterdam",
    "Python developer",
    "FastAPI",
    "Omar Nassar",
  ],
  authors: [{ name: "Omar Nassar" }],
  creator: "Omar Nassar",
  openGraph: {
    type: "website",
    url: "https://omardev.xyz/",
    title: "Omar Nassar | Full-Stack Engineer & AI Systems Builder, Amsterdam",
    description:
      "Full-stack engineer and AI systems builder in Amsterdam. React, Next.js, Laravel, Node, Python, plus LangChain, CrewAI, and on-premise LLMs for production AI agents and multi-agent workflows. 50+ systems shipped, 200+ automations, 80,000+ users served. Founder of Virelio.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Omar Nassar | Full-Stack Engineer & AI Systems Builder. 50+ systems shipped, 200+ automations, 80K+ users served",
      },
    ],
    locale: "en_US",
    alternateLocale: "nl_NL",
    siteName: "Omar Nassar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omar Nassar | Full-Stack + AI Systems, Amsterdam",
    description:
      "Full-stack engineer building production AI agents and multi-agent workflows. React, Laravel, Node, Python, plus LangChain, CrewAI, on-premise LLMs. 50+ systems shipped, 80,000+ users served. Amsterdam.",
    images: ["/og-image.png"],
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
      jobTitle: "Full-Stack Engineer & AI Systems Builder",
      description:
        "Full-stack engineer and AI systems builder based in Amsterdam. Seven years of full-stack engineering across React, Next.js, Laravel, Node, and Python, plus the infrastructure to run it in production. Builds autonomous AI agents and the systems they run on: WhatsApp AI agents, voice AI, sales automation agents, customer service agents, operations agents, and enterprise multi-agent systems. Founder of Virelio, an AI agency delivering custom AI agent teams. Has shipped 50+ production systems serving 80,000+ users, built 200+ automation workflows, and architected on-premise LLM platforms with multi-agent orchestration using CrewAI, LangGraph, and RAG architectures.",
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
      name: "Omar Nassar | Full-Stack Engineer & AI Systems Builder",
      url: "https://omardev.xyz",
      description:
        "Portfolio of Omar Nassar, full-stack engineer and AI systems builder in Amsterdam. Seven years across React, Next.js, Laravel, Node, and Python. Builds production AI agents, multi-agent workflows, RAG platforms, and on-premise LLM systems. Founder of Virelio.",
      mainEntity: { "@id": "https://omardev.xyz/#person" },
      dateCreated: "2023-01-01",
      dateModified: "2026-05-09",
      inLanguage: ["en", "nl"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["meta[name='description']", "title"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://omardev.xyz/#website",
      name: "Omar Nassar Portfolio",
      alternateName: ["Omar Nassar", "omardev"],
      url: "https://omardev.xyz/",
      description:
        "Portfolio of Omar Nassar, full-stack engineer and AI systems builder based in Amsterdam. Specializing in production AI agents, multi-agent workflows, RAG platforms, on-premise LLMs, plus the React, Next.js, Laravel, Node, and Python stack underneath.",
      author: { "@id": "https://omardev.xyz/#person" },
      publisher: { "@id": "https://omardev.xyz/#person" },
      inLanguage: ["en", "nl"],
      // Sitebox / search action — Google uses this to render a search box
      // directly in the search result for branded queries.
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://omardev.xyz/projects/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    // Sitelink hints — explicit list of the main sections of the site.
    // Google uses these to influence sitelinks generation.
    {
      "@type": "ItemList",
      "@id": "https://omardev.xyz/#main-sections",
      name: "Main sections",
      url: "https://omardev.xyz/",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: 6,
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Selected Work",
          description:
            "Production AI projects and full-stack case studies including fraud prevention, WhatsApp AI agents, on-premise LLMs, and medical compliance automation.",
          url: "https://omardev.xyz/#portfolio",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "About",
          description:
            "Full-stack engineer in Amsterdam shipping production AI agents on top of seven years of React, Next.js, Laravel, Node, and Python.",
          url: "https://omardev.xyz/#about-me",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Teaching · Lead AI",
          description:
            "Lead AI engineer at Vloto. AI lessons and webinars taught by building, not by slides.",
          url: "https://omardev.xyz/#teaching",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Journey",
          description:
            "Career ledger from student in 2017 to engineer at Vloto and founder of Virelio. By year.",
          url: "https://omardev.xyz/#journey",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Credentials",
          description:
            "Certifications verified through Anthropic, Google, and Oracle.",
          url: "https://omardev.xyz/#certifications",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Contact",
          description:
            "Available for full-time AI engineering and full-stack roles. Email omarnassar1127@gmail.com.",
          url: "https://omardev.xyz/#contact",
        },
      ],
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
      sameAs: ["https://virelio.nl"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
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
