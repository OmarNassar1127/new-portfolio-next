export interface BilingualString {
  en: string;
  nl: string;
}

export interface Stat {
  value: string;
  label: BilingualString;
}

export interface VireliLinks {
  site: string;
  ai: string;
}

export interface Personal {
  name: string;
  title: BilingualString;
  tagline: BilingualString;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  virelio: VireliLinks;
  formspreeId: string;
  ga4Id: string;
  googleVerification: string;
  stats: Stat[];
  roles: {
    en: string[];
    nl: string[];
  };
}

export const personal: Personal = {
  name: "Omar Nassar",
  title: {
    en: "AI Engineer & Full Stack Developer",
    nl: "AI Engineer & Full Stack Developer",
  },
  tagline: {
    en: "I build AI that ships.",
    nl: "Ik bouw AI die levert.",
  },
  email: "omarnassar1127@gmail.com",
  location: "Amsterdam, Netherlands",
  github: "https://github.com/OmarNassar1127",
  linkedin: "https://www.linkedin.com/in/omar-nassar-93a176155/",
  twitter: "https://twitter.com/GodelTrabuco69",
  virelio: {
    site: "https://virelio.nl",
    ai: "https://virelio.nl",
  },
  formspreeId: "mqaqryyn",
  ga4Id: "G-4YTLRETV9G",
  googleVerification: "vUsv3yVLQhObsRneuyy_X5bxPT9KXehRU3tHnKt_tYc",
  stats: [
    {
      value: "€50K",
      label: {
        en: "Monthly Impact",
        nl: "Maandelijkse Impact",
      },
    },
    {
      value: "30+",
      label: {
        en: "AI Systems Built",
        nl: "AI Systemen Gebouwd",
      },
    },
    {
      value: "200+",
      label: {
        en: "Automations",
        nl: "Automatiseringen",
      },
    },
    {
      value: "7+",
      label: {
        en: "Years in Tech",
        nl: "Jaar in Tech",
      },
    },
  ],
  roles: {
    en: ["AI Agent Engineer", "Full Stack Developer", "Founder of Virelio"],
    nl: ["AI Agent Engineer", "Full Stack Developer", "Oprichter van Virelio"],
  },
};
