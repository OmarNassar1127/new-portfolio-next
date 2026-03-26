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
      en: "Education Journey",
      nl: "Opleidingsreis",
    },
    subtitle: "Frontend & Backend Development",
    company: {
      en: "MBO Amstelland",
      nl: "MBO Amstelland",
    },
    icon: "ri-graduation-cap-fill",
    iconType: "remix",
    companyUrl: null,
    color: "from-blue-500 to-blue-600",
    technologies: ["HTML/CSS", "JavaScript", "PHP", "MySQL", "C#", "WordPress"],
    description: {
      en: "Started with frontend development during the first 18 months, mastering HTML/CSS and JavaScript. The last 18 months focused on backend technologies including PHP, MySQL, and C#, learning database design and CRUD functionalities.",
      nl: "Begon met frontend-ontwikkeling in de eerste 18 maanden, beheersing van HTML/CSS en JavaScript. De laatste 18 maanden gericht op backend-technologieën waaronder PHP, MySQL en C#, leren van database-ontwerp en CRUD-functionaliteiten.",
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
      en: "Backend Developer",
      nl: "Backend Ontwikkelaar",
    },
    subtitle: "Backend, AI Integration & Automation",
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
      "AI/ML",
      "WhatsApp API",
      "Voice AI",
      "RESTful APIs",
      "Process Optimization",
    ],
    description: {
      en: "Joined luxury car-sharing service with fleet from Audi e-tron to Polestar 2 Dual Motor. Built AI-powered WhatsApp assistant and voice assistant serving 20K+ customers, reducing customer support calls by 70% in the first 3 months. Developed fraud prevention system recovering €50K+, streamlined fine processing workflows, enhanced internal dashboard with real-time analytics, and optimized booking algorithms improving fleet utilization by 30%.",
      nl: "Toegetreden tot luxe autodeel-service met vloot van Audi e-tron tot Polestar 2 Dual Motor. AI-aangedreven WhatsApp-assistent en voice assistant gebouwd voor 20K+ klanten, waardoor klantenservice-oproepen met 70% zijn verminderd in de eerste 3 maanden. Fraudepreventiesysteem ontwikkeld dat €50K+ recupereert, boeteverwerkingsworkflows gestroomlijnd, intern dashboard verbeterd met real-time analytics, en boekingsalgoritmen geoptimaliseerd met 30% betere vlootbenutting.",
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
