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
    "Omar Nassar, full-stack developer and AI engineer in Amsterdam. Seven years building production systems across React, Next.js, Laravel, Node, and Python, plus LangChain, CrewAI, RAG and on-premise LLMs. Built fraud-prevention systems recovering €2M+, WhatsApp AI agents resolving 55% of customer conversations, voice AI assistants, AI customer support platforms, medical compliance automation, and enterprise multi-agent workflows. 50+ systems shipped, 200+ automations, 80,000+ users served. Lead AI engineer at Vloto, founder of Virelio. Available for full-time engineering and AI roles.",
  keywords: [
    // Identity
    "Omar Nassar",
    "Omar Nassar developer",
    "Omar Nassar AI engineer",
    "Omar Nassar Amsterdam",
    "omardev",
    "omardev.xyz",

    // Roles — AI
    "AI engineer",
    "AI engineer Amsterdam",
    "AI engineer Netherlands",
    "AI engineer Europe",
    "lead AI engineer",
    "AI agent developer",
    "AI agent engineer",
    "AI systems builder",
    "AI systems engineer",
    "AI consultant",
    "AI consultant Amsterdam",
    "AI freelancer Amsterdam",
    "AI workshops Amsterdam",
    "AI lessons Netherlands",
    "AI webinars",

    // Roles — full-stack
    "full-stack developer",
    "full-stack engineer",
    "full-stack developer Amsterdam",
    "full-stack engineer Amsterdam",
    "full-stack developer Netherlands",
    "senior full-stack developer",
    "freelance full-stack developer Amsterdam",
    "backend engineer Amsterdam",
    "backend developer Amsterdam",
    "frontend developer Amsterdam",
    "Laravel developer Amsterdam",
    "React developer Amsterdam",
    "Next.js developer Amsterdam",
    "TypeScript engineer Amsterdam",
    "Node.js engineer Amsterdam",
    "Python developer Amsterdam",
    "FastAPI developer",

    // AI specialty
    "autonomous AI agents",
    "multi-agent systems",
    "multi-agent orchestration",
    "agentic workflows",
    "AI agent platform",
    "AI workflow automation",
    "production AI",
    "RAG architecture",
    "RAG platform",
    "Retrieval Augmented Generation",
    "vector search",
    "LangChain developer",
    "LangGraph developer",
    "CrewAI developer",
    "Anthropic Claude developer",
    "Claude Code expert",
    "Model Context Protocol",
    "MCP servers",
    "OpenAI GPT-4 developer",
    "Google Gemini developer",
    "on-premise LLM",
    "self-hosted LLM",
    "Ollama deployment",
    "Llama 3 deployment",
    "private AI deployment",
    "enterprise AI",

    // Specific systems built
    "WhatsApp AI agent",
    "WhatsApp Business API integration",
    "AI customer support",
    "AI voice assistant",
    "voice AI for business",
    "fraud prevention system",
    "invoice fraud detection",
    "behavioral risk scoring",
    "medical compliance AI",
    "regulatory document automation",
    "FDA documentation automation",
    "CE marking automation",
    "AI booking system",
    "license plate detection",
    "image segmentation model",
    "AI meeting assistant",
    "AI website builder",

    // Companies & projects
    "Virelio",
    "Virelio AI agency",
    "Vloto AI engineer",
    "Bitsliced founder",

    // Stack
    "React",
    "Next.js",
    "TypeScript",
    "Laravel",
    "PHP",
    "Node.js",
    "Python",
    "FastAPI",
    "Supabase",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Qdrant",
    "Docker",
    "Azure",
    "AWS",
    "Cloudflare",
    "Tailwind CSS",
    "Playwright",

    // Use-case phrases
    "hire AI engineer",
    "hire full-stack developer Amsterdam",
    "AI automation for business",
    "custom AI agent",
    "build AI agent",
    "AI for SaaS",
    "AI integration Laravel",
    "AI integration Node.js",
    "automation Amsterdam",
    "freelance developer Amsterdam",
  ],
  authors: [{ name: "Omar Nassar" }],
  creator: "Omar Nassar",
  openGraph: {
    type: "website",
    url: "https://omardev.xyz/",
    title: "Omar Nassar | Full-Stack Engineer & AI Systems Builder, Amsterdam",
    description:
      "Full-stack developer and AI engineer in Amsterdam. Builds production AI agents, multi-agent workflows, RAG platforms, on-premise LLMs, fraud-prevention systems (€2M+ recovered), WhatsApp AI agents, voice AI, and the React, Next.js, Laravel, Node, Python stack underneath. 50+ systems shipped, 200+ automations, 80,000+ users served. Lead AI engineer at Vloto, founder of Virelio. Available for full-time roles.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Omar Nassar | Full-Stack Developer + AI Engineer, Amsterdam. 50+ systems shipped, AI agents, WhatsApp AI, voice AI, fraud prevention, RAG platforms, on-premise LLMs.",
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
      "Full-stack developer + AI engineer in Amsterdam. Production AI agents, fraud prevention, WhatsApp AI, voice AI, on-premise LLMs, RAG. Stack: React, Laravel, Node, Python, LangChain, CrewAI. 50+ shipped, 80K+ users. Lead AI @ Vloto, founder of Virelio.",
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
        "Full-stack developer and AI engineer based in Amsterdam. Seven years of production engineering across React, Next.js, TypeScript, Laravel, Node, FastAPI, and Python, plus the infrastructure to run it in production. Specializes in building autonomous AI agents and the systems they run on. Lead AI engineer at Vloto B.V., where he ships WhatsApp AI agents resolving 55%+ of customer conversations autonomously, voice AI assistants, on-premise LLM workflows, fraud-prevention systems that have recovered €2M+, and the booking algorithms, internal dashboards, and APIs underneath. Founder of Virelio, an Amsterdam AI agency delivering custom AI agent teams, RAG platforms, AI customer support systems, and medical compliance automation to other companies. Has shipped 50+ production systems serving 80,000+ users, built 200+ automation workflows, architected on-premise LLM platforms with multi-agent orchestration using CrewAI, LangGraph, Anthropic Claude, OpenAI, and Google Gemini, and runs AI lessons and webinars teaching practical agent engineering. Available for full-time engineering and AI roles.",
      email: "mailto:omarnassar1127@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Amsterdam",
        addressRegion: "Noord-Holland",
        addressCountry: "NL",
      },
      knowsAbout: [
        // AI engineering
        "AI Engineering",
        "AI Systems Engineering",
        "AI Agents",
        "Custom AI Agent Development",
        "Autonomous AI Agents",
        "Multi-Agent Systems",
        "Multi-Agent Orchestration",
        "Agentic Workflows",
        "AI Workflow Automation",
        "Production AI",
        "Enterprise AI",
        "AI Consulting",
        "AI Workshops",
        "AI Lessons",
        // Specific AI products built
        "WhatsApp AI Agents",
        "WhatsApp Business API Integration",
        "Voice AI",
        "Voice AI Assistants",
        "AI Customer Support",
        "Sales Automation Agents",
        "Customer Service AI Agents",
        "Operations Automation Agents",
        "Invoice Fraud Detection",
        "Fraud Prevention Systems",
        "Behavioral Risk Scoring",
        "Medical Compliance Automation",
        "Regulatory Document Automation",
        "AI Meeting Assistant",
        "AI Website Builder",
        "License Plate Recognition",
        "Image Segmentation",
        // RAG & retrieval
        "RAG Architecture",
        "Retrieval-Augmented Generation",
        "Vector Databases",
        "Qdrant",
        "Pinecone",
        // LLM stack
        "LangChain",
        "LangGraph",
        "CrewAI",
        "Anthropic Claude",
        "Claude Code",
        "Model Context Protocol",
        "MCP Servers",
        "OpenAI GPT-4",
        "Google Gemini",
        "Large Language Models",
        // On-premise / private LLM
        "On-Premise AI Deployment",
        "Self-Hosted LLM",
        "Ollama",
        "Llama 3",
        "Private AI Platforms",
        // Prompt engineering
        "Prompt Engineering",
        "Advanced Prompt Pipelines",
        // Full-stack development
        "Full-Stack Development",
        "Backend Engineering",
        "Frontend Engineering",
        "API Design",
        "REST APIs",
        "Microservices",
        "System Design",
        // Stack
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "FastAPI",
        "Laravel",
        "PHP",
        "Python",
        "Tailwind CSS",
        "Supabase",
        "PostgreSQL",
        "MySQL",
        "Docker",
        "Azure",
        "AWS",
        "Cloudflare",
        // Adjacent
        "Machine Learning",
        "Natural Language Processing",
        "Computer Vision",
      ],
      sameAs: [
        "https://github.com/OmarNassar1127",
        "https://www.linkedin.com/in/omar-nassar-93a176155/",
        "https://twitter.com/GodelTrabuco69",
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
