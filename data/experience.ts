export interface ExperienceEntry {
  id: number;
  year: string;
  period: {
    en: string;
    nl: string;
  };
  title: {
    en: string;
    nl: string;
  };
  subtitle: string;
  company: {
    en: string;
    nl: string;
  };
  /** Remix Icon class or image path */
  icon: string;
  /** Whether icon is a Remix Icon class (true) or image path (false) */
  iconType: 'remix' | 'image';
  /** Company website URL */
  companyUrl: string | null;
  color: string;
  technologies: string[];
  description: {
    en: string;
    nl: string;
  };
  current: boolean;
}

export const experienceData: ExperienceEntry[] = [
  {
    id: 1,
    year: "2017-2019",
    period: {
      en: "2017-2019",
      nl: "2017-2019",
    },
    title: {
      en: "Software Developer",
      nl: "Software Developer",
    },
    subtitle: "Frontend & Backend Development",
    company: {
      en: "Amstelland College",
      nl: "Amstelland College",
    },
    icon: "ri-graduation-cap-fill",
    iconType: "remix",
    companyUrl: null,
    color: "from-blue-500 to-blue-600",
    technologies: ["HTML/CSS", "JavaScript", "PHP", "MySQL", "C#", "WordPress"],
    description: {
      en: "Three years going deep on the fundamentals. The first half was frontend craft: HTML, CSS, and JavaScript until the browser felt like a familiar room. The second half flipped to backend: PHP, MySQL, and C#. Database schemas, CRUD operations, the unglamorous plumbing every real system runs on. The foundation everything else got stacked on top of.",
      nl: "Drie jaar diep duiken in de basis. De eerste helft was frontend-vakmanschap: HTML, CSS en JavaScript tot de browser voelde als een vertrouwde kamer. De tweede helft kantelde naar backend: PHP, MySQL en C#. Databaseschema's, CRUD-operaties, de onopvallende plumbing waar elk echt systeem op draait. Het fundament waar al het andere later bovenop kwam.",
    },
    current: false,
  },
  {
    id: 2,
    year: "2019-2021",
    period: {
      en: "2019-2021",
      nl: "2019-2021",
    },
    title: {
      en: "Frontend Developer",
      nl: "Frontend Ontwikkelaar",
    },
    subtitle: "Professional Start",
    company: {
      en: "CSDM",
      nl: "CSDM",
    },
    icon: "ri-code-box-fill",
    iconType: "remix",
    companyUrl: "https://www.csdigitalmedia.nl/",
    color: "from-green-500 to-green-600",
    technologies: ["ReactJS", "GraphQL", "Frontend Architecture"],
    description: {
      en: "Served as a front-end developer utilizing ReactJS and GraphQL. Gained valuable company insights through internship, then promoted to junior developer working with high-profile clients like Coca-Cola, Shell, and Schiphol.",
      nl: "Diende als front-end ontwikkelaar met ReactJS en GraphQL. Waardevolle bedrijfsinzichten opgedaan via stage, daarna gepromoveerd tot junior ontwikkelaar werkend met vooraanstaande klanten zoals Coca-Cola, Shell en Schiphol.",
    },
    current: false,
  },
  {
    id: 3,
    year: "2021",
    period: {
      en: "2021",
      nl: "2021",
    },
    title: {
      en: "Self-Development Year",
      nl: "Zelfontwikkelingsjaar",
    },
    subtitle: "Blockchain & Cryptography",
    company: {
      en: "Independent Study",
      nl: "Zelfstandige Studie",
    },
    icon: "ri-lightbulb-flash-fill",
    iconType: "remix",
    companyUrl: null,
    color: "from-purple-500 to-purple-600",
    technologies: ["Blockchain", "Smart Contracts", "Cryptography", "Web3"],
    description: {
      en: "Delved deep into blockchain and cryptography, gaining extensive knowledge about various blockchain types, consensus mechanisms, and the limitless possibilities of smart contracts for automating complex tasks.",
      nl: "Dook diep in blockchain en cryptografie, uitgebreide kennis opgedaan over verschillende blockchain-types, consensus mechanismen en de grenzeloze mogelijkheden van smart contracts voor het automatiseren van complexe taken.",
    },
    current: false,
  },
  {
    id: 4,
    year: "2021-2023",
    period: {
      en: "2021-2023",
      nl: "2021-2023",
    },
    title: {
      en: "Product Manager",
      nl: "Product Manager",
    },
    subtitle: "Entrepreneurship & Teaching",
    company: {
      en: "Bitsliced",
      nl: "Bitsliced",
    },
    icon: "ri-team-fill",
    iconType: "remix",
    companyUrl: null,
    color: "from-orange-500 to-orange-600",
    technologies: ["NFT", "Product Strategy", "Team Leadership", "Teaching"],
    description: {
      en: "Started teaching career sharing knowledge with aspiring learners. Co-founded Bitsliced, an NFT marketplace leveraging blockchain for real-world asset digitization. Assembled and managed a team of four professionals while overseeing project development and quality assurance.",
      nl: "Begon onderwijscarrière door kennis te delen met aspirant-leerlingen. Mede-oprichter van Bitsliced, een NFT-marktplaats die blockchain gebruikt voor digitalisering van echte assets. Team van vier professionals samengesteld en geleid terwijl projectontwikkeling en kwaliteitsborging werd overzien.",
    },
    current: false,
  },
  {
    id: 5,
    year: "2023-Present",
    period: {
      en: "2023-Present",
      nl: "2023-Nu",
    },
    title: {
      en: "AI & Backend Engineer",
      nl: "AI & Backend Engineer",
    },
    subtitle: "AI go-to · Voice · WhatsApp · Fraud",
    company: {
      en: "Vloto B.V.",
      nl: "Vloto B.V.",
    },
    icon: "ri-car-fill",
    iconType: "remix",
    companyUrl: "https://vloto.nl/",
    color: "from-teal-500 to-teal-600",
    technologies: [
      "Laravel",
      "LangChain",
      "OpenAI",
      "WhatsApp Business API",
      "ElevenLabs",
      "Voice AI",
      "Python",
      "MySQL",
    ],
    description: {
      en: "Leading multiple AI initiatives at Vloto. Some sit on the data side — pulling signal out of fleet, booking, and operations data to make sharper calls. Others sit on the user side — shipping features that move real metrics: the WhatsApp agent that deflects 55% of support across 80K+ users, the voice AI for fleet and fine inquiries, a fraud-prevention layer that has caught €50K+ in invoice fraud before payout. The work keeps expanding.",
      nl: "Meerdere AI-initiatieven leiden bij Vloto. Een deel zit aan de data-kant — signaal uit vloot-, boekings- en operationele data halen om scherpere keuzes te maken. Een ander deel aan de gebruikerskant — features bouwen die echt impact maken: de WhatsApp-agent die 55% van supportvolume afvangt bij 80K+ gebruikers, de voice AI voor vloot- en boetevragen, een fraudepreventielaag die €50K+ aan factuurfraude heeft gevangen vóór uitbetaling. Het werk blijft uitbreiden.",
    },
    current: true,
  },
  {
    id: 6,
    year: "2023-Present",
    period: {
      en: "2023-Present",
      nl: "2023-Nu",
    },
    title: {
      en: "AI Engineer & Co-Founder",
      nl: "AI Engineer & Co-Founder",
    },
    subtitle: "Production AI Systems",
    company: {
      en: "Virelio Agency",
      nl: "Virelio Agency",
    },
    icon: "ri-robot-2-fill",
    iconType: "remix",
    companyUrl: "https://virelio.nl/",
    color: "from-purple-600 to-pink-600",
    technologies: [
      "LangChain",
      "RAG",
      "Multi-Agent Systems",
      "CrewAI",
      "GPT-4",
      "Qdrant",
      "Python",
      "Azure",
    ],
    description: {
      en: "Co-founded AI agency delivering production-grade solutions for enterprises. Built Microsoft ecosystem integrations with Teams, SharePoint, and Outlook automation. Developed multi-agent workflows orchestrating complex business processes, enterprise RAG platforms achieving 95% accuracy on domain-specific queries, and medical compliance platforms reducing 3-month certification processes to 1 week. Shipped custom LLM integrations, intelligent document processing pipelines, and AI-powered analytics dashboards.",
      nl: "AI-bureau mede-opgericht dat productie-klare oplossingen levert voor enterprises. Microsoft ecosystem integraties gebouwd met Teams, SharePoint en Outlook automatisering. Multi-agent workflows ontwikkeld die complexe bedrijfsprocessen orkestreren, enterprise RAG-platformen met 95% accuracy op domein-specifieke queries, en medische compliance platformen die 3-maanden certificeringsprocessen terugbrengen naar 1 week. Custom LLM-integraties, intelligente documentverwerkingspipelines en AI-aangedreven analytics dashboards opgeleverd.",
    },
    current: true,
  },
];
