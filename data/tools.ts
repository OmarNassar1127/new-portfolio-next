export interface ToolPackage {
  status: 'live' | 'soon';
  name: string;
  version: string | null;
  downloads: string | null;
  tagline: { en: string; nl: string };
  description: { en: string; nl: string };
  install: string;
  npmUrl: string | null;
  ghUrl: string | null;
}

export const toolPackages: ToolPackage[] = [
  {
    status: 'live',
    name: 'skillsync-team',
    version: 'v3.1.3',
    downloads: '2k+',
    tagline: {
      en: 'Git-native skill sharing for AI coding agents.',
      nl: 'Git-native skill-uitwisseling voor AI coding agents.',
    },
    description: {
      en: "Skills you build for your AI coding agent normally die on your laptop. SkillSync turns your team's skill library into something Git-native: push yours to a shared repo, pull what your teammates shipped, stay in sync without anyone copy-pasting markdown around.",
      nl: 'Skills die je bouwt voor je AI coding agent blijven normaal op je laptop steken. SkillSync maakt van de skill-bibliotheek van je team iets Git-native: push die van jou naar een gedeelde repo, pull wat je teamgenoten hebben gemaakt, alles in sync zonder dat iemand markdown hoeft te kopiëren.',
    },
    install: 'npm i -g skillsync-team',
    npmUrl: 'https://www.npmjs.com/package/skillsync-team',
    ghUrl: 'https://github.com/OmarNassar1127/skillsync-team',
  },
  {
    status: 'live',
    name: 'claude-pin',
    version: 'v0.7.7',
    downloads: '2k+',
    tagline: {
      en: 'Bookmarks for the sessions worth keeping.',
      nl: 'Bookmarks voor de sessies die je wilt bewaren.',
    },
    description: {
      en: "Claude Code's --resume window is short. claude-pin keeps the sessions you care about reachable past it: pinned, noted, retrievable. Ships /pin, /unpin, /pins and /note slash commands, plus the cpin CLI with an interactive picker.",
      nl: 'Het --resume venster van Claude Code is kort. claude-pin houdt de sessies waar je om geeft bereikbaar voorbij dat venster: gepind, voorzien van notities, terugvindbaar. Levert /pin, /unpin, /pins en /note slash commands, plus de cpin CLI met een interactieve picker.',
    },
    install: 'npm i -g claude-pin',
    npmUrl: 'https://www.npmjs.com/package/claude-pin',
    ghUrl: 'https://github.com/OmarNassar1127/claude-pin',
  },
  {
    status: 'live',
    name: 'huurradar',
    version: 'v1.0.4',
    downloads: '1k+',
    tagline: {
      en: 'The Dutch rental market, minus the refreshing.',
      nl: 'De Nederlandse huurmarkt, zonder het eindeloze refreshen.',
    },
    description: {
      en: 'Good listings are gone within hours and sit on platforms that share nothing with each other. HuurRadar watches six of them on a schedule, filters to your criteria, has AI read the income requirements buried three paragraphs down, and emails you whatever survives while it is still available.',
      nl: 'Goede woningen zijn binnen een paar uur weg en staan verspreid over platforms die niets met elkaar delen. HuurRadar checkt er zes volgens een schema, filtert op jouw criteria, laat AI de inkomenseisen lezen die drie alinea’s verderop staan, en mailt je wat overblijft zolang het nog beschikbaar is.',
    },
    install: 'npx huurradar',
    npmUrl: 'https://www.npmjs.com/package/huurradar',
    ghUrl: 'https://github.com/OmarNassar1127/huurradar',
  },
  {
    status: 'live',
    name: 'huischeck',
    version: 'v1.0.3',
    downloads: '500+',
    tagline: {
      en: 'Paste a listing. Get the verdict the ad won’t give you.',
      nl: 'Plak een advertentie. Krijg het oordeel dat de makelaar niet geeft.',
    },
    description: {
      en: 'Every listing looks good: wide-angle photos, copy written by an agent. HuisCheck takes one link and works out what actually decides it: the commute at 08:30 in real traffic, whether the erfpacht runs out, what the neighbourhood is like after dark, what you can borrow. Every euro figure is computed in code, never guessed by a model.',
      nl: 'Elke woning ziet er goed uit: groothoekfoto’s, tekst geschreven door de makelaar. HuisCheck neemt één link en zoekt uit wat het echt bepaalt: de reistijd om 08:30 in de spits, of de erfpacht afloopt, hoe de buurt is na zonsondergang, wat je kunt lenen. Elk bedrag wordt in code berekend, nooit gegokt door een model.',
    },
    install: 'npx huischeck',
    npmUrl: 'https://www.npmjs.com/package/huischeck',
    ghUrl: 'https://github.com/OmarNassar1127/huischeck-nl',
  },
  {
    status: 'soon',
    name: 'featuresync',
    version: null,
    downloads: null,
    tagline: {
      en: 'Developer handoff, without the rebuild.',
      nl: 'Developer-handoff, zonder opnieuw te bouwen.',
    },
    description: {
      en: 'Sister tool to SkillSync, with a bigger ambition: make handoff between developers stop hurting. Pass the actual work (context, agent state, threads in progress) so whoever picks up next starts where you really were, not where the Git branch left them.',
      nl: 'Zustertool van SkillSync, met een grotere ambitie: zorgen dat handoff tussen developers niet meer pijn doet. Geef het echte werk door (context, agent-status, lopende threads) zodat wie het overneemt verdergaat waar jij écht was, niet waar de Git-branch hem achterliet.',
    },
    install: 'npm i -g featuresync',
    npmUrl: null,
    ghUrl: null,
  },
];
