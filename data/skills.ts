export interface Skill {
  name: string;
  category: "ai" | "frontend" | "backend" | "tools" | "databases";
  proficiency: number;
  description: {
    en: string;
    nl: string;
  };
  color: string;
  /** Discriminated union: SVG file path or Remix Icon class name */
  iconType: "svg" | "remix";
  icon: string;
}

export interface SkillCategory {
  id: "all" | "ai" | "frontend" | "backend" | "tools" | "databases";
  label: {
    en: string;
    nl: string;
  };
  icon: string;
  color: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: "all",
    label: { en: "All Skills", nl: "Alle Vaardigheden" },
    icon: "ri-apps-line",
    color: "from-gray-500 to-gray-700",
  },
  {
    id: "ai",
    label: { en: "AI & ML", nl: "AI & ML" },
    icon: "ri-robot-line",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "frontend",
    label: { en: "Frontend", nl: "Frontend" },
    icon: "ri-palette-line",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "backend",
    label: { en: "Backend", nl: "Backend" },
    icon: "ri-server-line",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "tools",
    label: { en: "Tools & Platforms", nl: "Tools & Platforms" },
    icon: "ri-tools-line",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "databases",
    label: { en: "Databases", nl: "Databases" },
    icon: "ri-database-2-line",
    color: "from-orange-500 to-red-600",
  },
];

export const skillsData: Skill[] = [
  // --- AI & ML ---
  {
    name: "LangChain",
    category: "ai",
    proficiency: 92,
    description: {
      en: "RAG & agent orchestration",
      nl: "RAG & agent orchestratie",
    },
    color: "from-green-400 to-emerald-600",
    iconType: "remix",
    icon: "ri-link-m",
  },
  {
    name: "OpenAI/GPT",
    category: "ai",
    proficiency: 95,
    description: {
      en: "GPT-4, embeddings & fine-tuning",
      nl: "GPT-4, embeddings & fine-tuning",
    },
    color: "from-gray-700 to-gray-900",
    iconType: "remix",
    icon: "ri-openai-fill",
  },
  {
    name: "CrewAI",
    category: "ai",
    proficiency: 90,
    description: {
      en: "Multi-agent systems",
      nl: "Multi-agent systemen",
    },
    color: "from-blue-500 to-indigo-600",
    iconType: "remix",
    icon: "ri-team-line",
  },
  {
    name: "LangGraph",
    category: "ai",
    proficiency: 88,
    description: {
      en: "Agent workflows & state",
      nl: "Agent workflows & state",
    },
    color: "from-purple-500 to-violet-600",
    iconType: "remix",
    icon: "ri-flow-chart",
  },
  {
    name: "RAG Systems",
    category: "ai",
    proficiency: 95,
    description: {
      en: "Vector search & retrieval",
      nl: "Vector search & retrieval",
    },
    color: "from-cyan-500 to-blue-600",
    iconType: "remix",
    icon: "ri-database-2-line",
  },
  {
    name: "Qdrant",
    category: "ai",
    proficiency: 88,
    description: {
      en: "Vector database",
      nl: "Vector database",
    },
    color: "from-red-400 to-pink-500",
    iconType: "remix",
    icon: "ri-shape-line",
  },
  {
    name: "Claude/Anthropic",
    category: "ai",
    proficiency: 90,
    description: {
      en: "Claude API & agents",
      nl: "Claude API & agents",
    },
    color: "from-orange-400 to-amber-500",
    iconType: "remix",
    icon: "ri-brain-line",
  },
  {
    name: "Llama/Ollama",
    category: "ai",
    proficiency: 85,
    description: {
      en: "Local LLM deployment",
      nl: "Lokale LLM deployment",
    },
    color: "from-blue-400 to-purple-500",
    iconType: "remix",
    icon: "ri-server-line",
  },
  {
    name: "PyTorch",
    category: "ai",
    proficiency: 75,
    description: {
      en: "Deep learning & neural networks",
      nl: "Deep learning & neurale netwerken",
    },
    color: "from-orange-500 to-red-600",
    iconType: "remix",
    icon: "ri-fire-line",
  },
  {
    name: "TensorFlow",
    category: "ai",
    proficiency: 72,
    description: {
      en: "ML model training & deployment",
      nl: "ML model training & deployment",
    },
    color: "from-orange-400 to-yellow-500",
    iconType: "remix",
    icon: "ri-cpu-line",
  },

  // --- Backend ---
  {
    name: "Python",
    category: "backend",
    proficiency: 90,
    description: {
      en: "AI/ML & backend development",
      nl: "AI/ML & backend ontwikkeling",
    },
    color: "from-blue-400 to-yellow-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/python.svg",
  },
  {
    name: "Laravel",
    category: "backend",
    proficiency: 90,
    description: {
      en: "Eloquent ORM & Artisan CLI",
      nl: "Eloquent ORM & Artisan CLI",
    },
    color: "from-red-400 to-red-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/laravel.svg",
  },
  {
    name: "Node.js",
    category: "backend",
    proficiency: 82,
    description: {
      en: "Server-side JavaScript & APIs",
      nl: "Server-side JavaScript & APIs",
    },
    color: "from-green-400 to-green-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/nodejs.svg",
  },
  {
    name: "FastAPI",
    category: "backend",
    proficiency: 88,
    description: {
      en: "High-performance Python APIs",
      nl: "High-performance Python APIs",
    },
    color: "from-teal-400 to-green-500",
    iconType: "remix",
    icon: "ri-flashlight-line",
  },
  {
    name: "PHP",
    category: "backend",
    proficiency: 90,
    description: {
      en: "Laravel & modern PHP practices",
      nl: "Laravel & moderne PHP praktijken",
    },
    color: "from-indigo-400 to-purple-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/php.svg",
  },
  {
    name: "GraphQL",
    category: "backend",
    proficiency: 75,
    description: {
      en: "Query language for APIs",
      nl: "Query taal voor APIs",
    },
    color: "from-pink-400 to-rose-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/graphQL.svg",
  },
  {
    name: "C++",
    category: "backend",
    proficiency: 60,
    description: {
      en: "System programming & algorithms",
      nl: "Systeemprogrammering & algoritmen",
    },
    color: "from-indigo-500 to-purple-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/cplus.svg",
  },
  {
    name: "C#",
    category: "backend",
    proficiency: 70,
    description: {
      en: ".NET development",
      nl: ".NET ontwikkeling",
    },
    color: "from-blue-500 to-indigo-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/c.svg",
  },

  // --- Frontend ---
  {
    name: "React",
    category: "frontend",
    proficiency: 85,
    description: {
      en: "Hooks, Context & state management",
      nl: "Hooks, Context & state management",
    },
    color: "from-cyan-400 to-blue-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/react.svg",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: 92,
    description: {
      en: "Utility-first CSS framework",
      nl: "Utility-first CSS framework",
    },
    color: "from-teal-400 to-cyan-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/tailwind.svg",
  },
  {
    name: "JavaScript",
    category: "frontend",
    proficiency: 88,
    description: {
      en: "ES6+ & DOM manipulation",
      nl: "ES6+ & DOM manipulatie",
    },
    color: "from-yellow-400 to-orange-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/javascript.svg",
  },
  {
    name: "HTML5",
    category: "frontend",
    proficiency: 95,
    description: {
      en: "Semantic markup & accessibility",
      nl: "Semantische markup & toegankelijkheid",
    },
    color: "from-orange-400 to-red-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/html.svg",
  },
  {
    name: "CSS3",
    category: "frontend",
    proficiency: 90,
    description: {
      en: "Modern layouts & animations",
      nl: "Moderne layouts & animaties",
    },
    color: "from-blue-400 to-blue-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/css.svg",
  },
  {
    name: "Bootstrap",
    category: "frontend",
    proficiency: 80,
    description: {
      en: "Responsive grid systems",
      nl: "Responsieve grid systemen",
    },
    color: "from-purple-400 to-purple-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/bootstrap.svg",
  },

  // --- Databases ---
  {
    name: "MySQL",
    category: "databases",
    proficiency: 88,
    description: {
      en: "Relational database design",
      nl: "Relationele database ontwerp",
    },
    color: "from-blue-400 to-blue-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/mysql.svg",
  },
  {
    name: "PostgreSQL",
    category: "databases",
    proficiency: 82,
    description: {
      en: "Advanced relational database",
      nl: "Geavanceerde relationele database",
    },
    color: "from-blue-500 to-indigo-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/postgresql.svg",
  },
  {
    name: "Redis",
    category: "databases",
    proficiency: 80,
    description: {
      en: "In-memory caching & queues",
      nl: "In-memory caching & queues",
    },
    color: "from-red-500 to-red-700",
    iconType: "remix",
    icon: "ri-database-line",
  },

  // --- Tools & Platforms ---
  {
    name: "VS Code",
    category: "tools",
    proficiency: 95,
    description: {
      en: "Code editor & extensions",
      nl: "Code editor & extensies",
    },
    color: "from-blue-500 to-cyan-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/vscode.svg",
  },
  {
    name: "Figma",
    category: "tools",
    proficiency: 78,
    description: {
      en: "UI/UX design & prototyping",
      nl: "UI/UX ontwerp & prototyping",
    },
    color: "from-purple-400 to-pink-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/figma.svg",
  },
  {
    name: "GitHub",
    category: "tools",
    proficiency: 90,
    description: {
      en: "Version control & collaboration",
      nl: "Versiebeheer & samenwerking",
    },
    color: "from-gray-600 to-gray-800",
    iconType: "svg",
    icon: "/images/SVG/SVGs/github.svg",
  },
  {
    name: "Jira",
    category: "tools",
    proficiency: 82,
    description: {
      en: "Project management & tracking",
      nl: "Projectbeheer & tracking",
    },
    color: "from-blue-400 to-blue-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/jira.svg",
  },
  {
    name: "Atlassian",
    category: "tools",
    proficiency: 80,
    description: {
      en: "Team collaboration tools",
      nl: "Team samenwerkingstools",
    },
    color: "from-blue-500 to-indigo-600",
    iconType: "svg",
    icon: "/images/SVG/SVGs/atlassian.svg",
  },
  {
    name: "WordPress",
    category: "tools",
    proficiency: 85,
    description: {
      en: "CMS & custom development",
      nl: "CMS & custom ontwikkeling",
    },
    color: "from-blue-600 to-indigo-700",
    iconType: "svg",
    icon: "/images/SVG/SVGs/wordpress-svgrepo-com.svg",
  },
  {
    name: "Docker",
    category: "tools",
    proficiency: 82,
    description: {
      en: "Containerization & deployment",
      nl: "Containerisatie & deployment",
    },
    color: "from-blue-400 to-cyan-500",
    iconType: "remix",
    icon: "ri-ship-line",
  },
  {
    name: "Azure",
    category: "tools",
    proficiency: 78,
    description: {
      en: "Cloud services & DevOps",
      nl: "Cloud services & DevOps",
    },
    color: "from-blue-500 to-blue-700",
    iconType: "remix",
    icon: "ri-cloud-line",
  },
  {
    name: "n8n",
    category: "tools",
    proficiency: 92,
    description: {
      en: "Workflow automation",
      nl: "Workflow automatisering",
    },
    color: "from-orange-400 to-pink-500",
    iconType: "svg",
    icon: "/images/SVG/SVGs/n8n.svg",
  },
];
