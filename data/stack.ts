export interface StackSkill {
  name: string;
  /** Headliner — gets italic Fraunces emphasis */
  highlight?: boolean;
}

export interface StackGroup {
  id: string;
  label: { en: string; nl: string };
  /** Editorial sub-label, italic Fraunces */
  sublabel: { en: string; nl: string };
  skills: StackSkill[];
}

export const stackData: StackGroup[] = [
  {
    id: 'languages',
    label: { en: 'Languages', nl: 'Talen' },
    sublabel: {
      en: 'the tongues, daily.',
      nl: 'de talen, dagelijks.',
    },
    skills: [
      { name: 'TypeScript', highlight: true },
      { name: 'JavaScript', highlight: true },
      { name: 'Python', highlight: true },
      { name: 'PHP' },
      { name: 'C#' },
      { name: 'SQL' },
    ],
  },
  {
    id: 'frontend',
    label: { en: 'Frontend', nl: 'Frontend' },
    sublabel: {
      en: 'the surface where intent lives.',
      nl: 'het oppervlak waar de intentie woont.',
    },
    skills: [
      { name: 'React', highlight: true },
      { name: 'Next.js', highlight: true },
      { name: 'Vue 3' },
      { name: 'React Native' },
      { name: 'Tailwind CSS', highlight: true },
    ],
  },
  {
    id: 'backend',
    label: { en: 'Backend', nl: 'Backend' },
    sublabel: {
      en: 'the engine room.',
      nl: 'de machinekamer.',
    },
    skills: [
      { name: 'Laravel', highlight: true },
      { name: 'Node.js', highlight: true },
      { name: 'Express' },
      { name: 'REST APIs' },
      { name: 'GraphQL' },
      { name: 'WebSockets' },
      { name: 'Microservices' },
    ],
  },
  {
    id: 'ai',
    label: { en: 'AI / Agents', nl: 'AI / Agents' },
    sublabel: {
      en: 'the new kit, the production one.',
      nl: 'het nieuwe gereedschap, in productie.',
    },
    skills: [
      { name: 'LangChain', highlight: true },
      { name: 'LangGraph', highlight: true },
      { name: 'CrewAI' },
      { name: 'Vercel AI SDK' },
      { name: 'MCP', highlight: true },
      { name: 'Tool use', highlight: true },
      { name: 'RAG', highlight: true },
      { name: 'Multi-agent systems', highlight: true },
      { name: 'Context engineering', highlight: true },
      { name: 'Memory systems', highlight: true },
      { name: 'Human-in-the-loop' },
      { name: 'Evals & guardrails', highlight: true },
      { name: 'Observability' },
      { name: 'Computer vision (OCR)' },
      { name: 'Fine-tuning' },
      { name: 'Embeddings' },
      { name: 'GPT' },
      { name: 'Claude' },
      { name: 'Gemini' },
      { name: 'ElevenLabs', highlight: true },
      { name: 'Whisper' },
      { name: 'LangSmith' },
      { name: 'Ollama' },
      { name: 'On-prem LLMs' },
    ],
  },
  {
    id: 'data',
    label: { en: 'Data / Storage', nl: 'Data / Opslag' },
    sublabel: {
      en: 'where state lives between requests.',
      nl: 'waar state leeft tussen requests.',
    },
    skills: [
      { name: 'MySQL', highlight: true },
      { name: 'PostgreSQL' },
      { name: 'SQLite (WAL)' },
      { name: 'Supabase' },
      { name: 'Qdrant', highlight: true },
      { name: 'Redis' },
    ],
  },
  {
    id: 'infra',
    label: { en: 'Cloud / Infra', nl: 'Cloud / Infra' },
    sublabel: {
      en: 'where the work actually runs.',
      nl: 'waar het werk uiteindelijk draait.',
    },
    skills: [
      { name: 'Cloudflare', highlight: true },
      { name: 'Laravel Forge', highlight: true },
      { name: 'Vercel' },
      { name: 'Azure' },
      { name: 'Google Cloud' },
      { name: 'GitHub Actions' },
      { name: 'Docker' },
      { name: 'PM2 (Pi)' },
    ],
  },
];

/** Most reached for — the daily five, called out in the footer */
export const stackSignature = [
  'TypeScript',
  'Next.js',
  'Laravel',
  'LangChain',
  'Cloudflare',
];
