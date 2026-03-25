export type CertificationCategory = "AI/ML" | "Cloud" | "Development";

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string | null;
  category: CertificationCategory;
  /** Logo identifier used to resolve the correct logo component */
  logo: "google" | "oracle" | "udemy" | "anthropic";
  /** Path relative to /public/images/ — null for SVG-rendered logos (Google) */
  logoPath: string | null;
  skills: string[];
  color: string;
}

export const certificationsData: Certification[] = [
  {
    id: 7,
    title: "Model Context Protocol: Advanced Topics",
    issuer: "Anthropic",
    date: "Mar 2026",
    credentialUrl: "https://verify.skilljar.com/c/kuqi7egxxvg8",
    category: "AI/ML",
    logo: "anthropic",
    logoPath: "/images/anthropicresearch_logo.jpeg",
    skills: ["MCP Servers", "Tool Integration", "Agentic Workflows"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 8,
    title: "Certificate of Completion: Agent Skills",
    issuer: "Anthropic",
    date: "Mar 2026",
    credentialUrl: "https://verify.skilljar.com/c/e5ox2qj3xwi6",
    category: "AI/ML",
    logo: "anthropic",
    logoPath: "/images/anthropicresearch_logo.jpeg",
    skills: ["Autonomous Agents", "Multi-Step Reasoning", "Tool Use"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 9,
    title: "Claude Code in Action",
    issuer: "Anthropic",
    date: "Mar 2026",
    credentialUrl: "https://verify.skilljar.com/c/97f6bmdcy376",
    category: "AI/ML",
    logo: "anthropic",
    logoPath: "/images/anthropicresearch_logo.jpeg",
    skills: ["AI-Powered Development", "CLI Automation", "Pair Programming"],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 1,
    title:
      "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG Skill Badge",
    issuer: "Google",
    date: "Oct 2025",
    credentialUrl: null,
    category: "AI/ML",
    logo: "google",
    logoPath: null,
    skills: ["Artificial Intelligence (AI)", "Gemini API"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Prompt Design in Vertex AI Skill Badge",
    issuer: "Google",
    date: "Oct 2025",
    credentialUrl: null,
    category: "AI/ML",
    logo: "google",
    logoPath: null,
    skills: ["Artificial Intelligence (AI)", "Gemini API"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 3,
    title: "Machine Learning Operations (MLOps) for Generative AI",
    issuer: "Google",
    date: "Feb 2025",
    credentialUrl: null,
    category: "AI/ML",
    logo: "google",
    logoPath: null,
    skills: ["Artificial Intelligence (AI)", "Machine Learning", "MLOps"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 4,
    title: "Advanced: Generative AI for Developers",
    issuer: "Google",
    date: "Jan 2025",
    credentialUrl: null,
    category: "AI/ML",
    logo: "google",
    logoPath: null,
    skills: ["Artificial Intelligence (AI)", "Google Gemini"],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 5,
    title: "OCI Generative AI Professional",
    issuer: "Oracle",
    date: "Nov 2024",
    credentialUrl: null,
    category: "AI/ML",
    logo: "oracle",
    logoPath: "/images/oracle.png",
    skills: ["Oracle Cloud", "Generative AI", "LLM Deployment"],
    color: "from-red-500 to-red-600",
  },
  // {
  //   id: 6,
  //   title: "Laravel: Beginner to Advanced",
  //   issuer: "Udemy",
  //   date: "May 2023",
  //   credentialUrl: null,
  //   category: "Development",
  //   logo: "udemy",
  //   logoPath: "/images/udemy.png",
  //   skills: ["Laravel", "Object-Relational Mapping (ORM)"],
  //   color: "from-purple-500 to-purple-600",
  // },
];
