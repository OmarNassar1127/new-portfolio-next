import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDescription(description: string): {
  intro: string;
  highlights: string[];
} {
  const sentences = description.split(". ").filter(Boolean);
  const intro = sentences.slice(0, 2).join(". ") + ".";
  const highlights = sentences.slice(2).map((s) => s.replace(/\.$/, ""));
  return { intro, highlights };
}

const techCategories: Record<string, string[]> = {
  Core: [
    "React", "Next.js", "Vue", "Angular", "Svelte", "TypeScript", "JavaScript",
    "Python", "PHP", "C++", "C#", "Java", "Go", "Rust", "Node.js", "Express",
    "Laravel", "FastAPI", "Django", "Flask", "Unity", "Vite",
  ],
  AI: [
    "OpenAI", "GPT-4", "Claude", "Gemini", "Llama", "Ollama", "LangChain",
    "LangGraph", "CrewAI", "AutoGPT", "RAG", "NLP", "Computer Vision",
    "TensorFlow", "Keras", "PyTorch", "MediaPipe", "Whisper", "ElevenLabs",
    "Stable Diffusion", "ControlNet", "Vision AI", "Machine Learning",
    "Anthropic API", "MCP Servers", "Artifacts", "Client-side AI",
    "Perplexity-style", "Memory Layers", "Tools API", "Local LLM",
    "Agents", "Multi-agent", "On-premise AI", "Regulatory AI",
    "Natural Language Processing", "Speech Synthesis", "Voice AI",
    "Customer Support AI", "Risk Analytics", "Compliance Automation",
  ],
  Infrastructure: [
    "Docker", "AWS", "Azure", "Vercel", "Render", "PostgreSQL", "MySQL",
    "MongoDB", "SQLite", "Qdrant", "Meilisearch", "Supabase", "Firebase",
    "Redis", "Tailwind CSS", "Bootstrap", "HTML/CSS", "Puppeteer",
    "Browserless", "Axios", "Nodemailer", "SerpAPI", "WhatsApp Business API",
    "Calendar API", "Outlook Graph", "WebRTC", "Markdown Export",
    "Unstructured.io", "Streamlit", "Composer", "Imagick", "RapidAPI",
    "Automation", "Web Scraping", "Real-time Processing", "Anti-detection",
    "Enterprise Security", "Backend Development", "API Integration",
    "Payment APIs", "Mollie", "Document Processing", "OCR",
    "SQL Database", "Windows API", "VPS Hosting", "eCommerce plugin",
    "Wordpress", "graphQL", "Ant Design",
  ],
};

export function categorizeTechs(
  technologies: string[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const tech of technologies) {
    let placed = false;
    for (const [category, techs] of Object.entries(techCategories)) {
      if (techs.some((t) => tech.toLowerCase().includes(t.toLowerCase()))) {
        if (!result[category]) result[category] = [];
        result[category].push(tech);
        placed = true;
        break;
      }
    }
    if (!placed) {
      if (!result["Core"]) result["Core"] = [];
      result["Core"].push(tech);
    }
  }
  return result;
}

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
