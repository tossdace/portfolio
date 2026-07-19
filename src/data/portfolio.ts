export type ProjectLink = {
  label: string;
  href?: string;
  disabledReason?: string;
};

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  status: string;
  image: string;
  summary: string;
  impact: string;
  techStack: string[];
  links: ProjectLink[];
  challenges: string[];
  solutions: string[];
  lessons: string[];
  timeline: string[];
  future: string[];
  caseStudy: {
    problem: string;
    research: string;
    planning: string;
    architecture: string;
    development: string;
    challenges: string[];
    results: string;
    improvements: string[];
  };
  logs?: string[];
};

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhyanajay.vercel.app",
  title: "Dhyan Ajay | Portfolio",
  description:
    "Am Dhyan Ajay just computer science student, founder of Hirevoy, and builder of Zeno5 Emulator.",
};

export const profile = {
  name: "Dhyan Ajay",
  age: 19,
  role: "Computer Science Student",
  headline:
    "I build everthing that comes to my mind , and systems experiments that turn curiosity into usable software.",
  shortPitch:
    "A builder for clients who want more than a template: polished interfaces, careful implementation, and product thinking from the first screen.",
  founderOf: "Hirevoy",
  currentProject: "Zeno5 Emulator",
  currentQuest: "Turn experimental ideas into polished, testable products",
  currentLearning: ["Asset ripping", "Reverse engineering"],
  hobby: "Chess",
  chessRating: "2029 elo (Chess.com)",
  chessPlatform: "Chess.com",
  personality: ["Curious", "Builder", "Problem Solver", "Always Learning"],
  contact: {
    email: "dhyan102006@gmail.com",
    github: "https://github.com/tossdace",
    linkedin: "https://www.linkedin.com/in/dhyan-ajay/",
    chess: "https://www.chess.com/member/dhyan-ajay",
    resume: "dm",
  },
};

export const navigation = [
  { label: "Profile", href: "#profile" },
  { label: "Projects", href: "#projects" },
  { label: "Zeno5", href: "#zeno5" },
  { label: "Hirevoy", href: "#hirevoy" },
  { label: "Chess", href: "#chess" },
  { label: "Contact", href: "#contact" },
];

export const projects: Project[] = [
  {
    slug: "zeno5-emulator",
    title: "Zeno5 Emulator",
    eyebrow: "Flagship build",
    status: "In development",
    image: "/assets/zeno5-emulator.png",
    summary:
      "A long-term emulator project that combines systems research, asset pipeline experiments, and reverse engineering practice into a serious learning build.",
    impact:
      "The project shows low-level curiosity, patience with hard technical unknowns, and the ability to document a complex build in public-ready form.",
    techStack: [
      "Systems design",
      "Reverse engineering",
      "Asset pipeline research",
      "Debug tooling",
      "Architecture notes",
    ],
    links: [
      {
        label: "Source",
        disabledReason: "Add the repository URL when the code is ready to share.",
      },
      {
        label: "Live demo",
        disabledReason: "Emulator preview is not published yet.",
      },
    ],
    challenges: [
      "Separating research notes from implementation decisions.",
      "Designing a project structure that can grow as emulator subsystems become clearer.",
      "Keeping reverse engineering work documented without making the page feel like a notebook dump.",
    ],
    solutions: [
      "Present the project as a Steam-like flagship page with architecture, devlogs, roadmap, and gallery blocks.",
      "Use clear status labels so visitors understand what is shipped, what is researched, and what is next.",
      "Treat uncertainty as part of the case study instead of hiding it behind inflated claims.",
    ],
    lessons: [
      "Hard projects earn trust when the process is visible.",
      "Research-heavy work needs careful scoping before code volume matters.",
      "A serious portfolio can show work-in-progress if the decisions are crisp.",
    ],
    timeline: [
      "Research: asset formats, emulator architecture, and toolchain notes.",
      "Prototype: isolate the first repeatable execution and inspection workflows.",
      "Public build: publish devlogs, screenshots, and technical writeups as milestones land.",
    ],
    future: [
      "Document the architecture in diagrams.",
      "Publish controlled development logs.",
      "Add a gallery of real screenshots when the prototype is visually meaningful.",
    ],
    caseStudy: {
      problem:
        "Emulator projects are intimidating because the visible result arrives late. The portfolio page needs to make the technical journey legible before a polished demo exists.",
      research:
        "The research layer focuses on asset ripping, reverse engineering habits, emulator architecture vocabulary, and a repeatable way to turn findings into implementation tasks.",
      planning:
        "The project is framed around progressive disclosure: first clarify scope, then document subsystems, then expose devlogs and visual proof as the build matures.",
      architecture:
        "The public architecture is designed as modules: research notes, asset pipeline, execution core, debug surfaces, gallery, and release roadmap.",
      development:
        "Current development emphasis is on learning, documentation quality, and building the confidence needed to turn the system into a shareable prototype.",
      challenges: [
        "Avoiding vague claims while the build is still research-heavy.",
        "Explaining reverse engineering work professionally.",
        "Balancing technical depth with recruiter/client readability.",
      ],
      results:
        "The page positions Zeno5 as the flagship proof of depth: it tells visitors what is being learned, why it matters, and how the project will become demonstrable.",
      improvements: [
        "Add real screenshots and short videos.",
        "Publish the first devlog with a dated milestone.",
        "Add diagrams for the asset and execution pipelines.",
      ],
    },
    logs: [
      "Researching asset extraction workflows and documentation structure.",
      "Mapping project modules before public demos are promised.",
      "Preparing a devlog format that rewards actual progress over noise.",
    ],
  },
  {
    slug: "hirevoy",
    title: "Hirevoy",
    eyebrow: "Founder project",
    status: "Founder-led product",
    image: "/assets/hirevoy-dashboard.png",
    summary:
      "A startup direction around making hiring journeys easier to understand, present, and evaluate for people building real things.",
    impact:
      "Hirevoy gives the portfolio a founder signal: Dhyan is not only learning tools, he is practicing product framing, roadmap thinking, and market empathy.",
    techStack: [
      "Product strategy",
      "Web platform design",
      "Roadmapping",
      "User journeys",
      "Founder research",
    ],
    links: [
      {
        label: "Product",
        disabledReason: "Add the product URL when a public page is ready.",
      },
      {
        label: "Roadmap",
        href: "/projects/hirevoy",
      },
    ],
    challenges: [
      "A founder project needs a sharper point of view than a normal portfolio card.",
      "The mission must sound useful without overclaiming traction that is not documented yet.",
      "The roadmap needs enough specificity to feel real and enough flexibility to evolve.",
    ],
    solutions: [
      "Frame Hirevoy as a product journey with problem, mission, progress, and next bets.",
      "Use founder notes and roadmap blocks instead of pretending there are finished metrics.",
      "Keep the page client-facing: a recruiter or freelance client should understand the ambition quickly.",
    ],
    lessons: [
      "Product clarity is a design feature.",
      "A good startup page should make the next decision easier.",
      "Founder work benefits from showing constraints, not just vision.",
    ],
    timeline: [
      "Define the audience and core hiring problem.",
      "Prototype product flows and content architecture.",
      "Validate which user journey deserves the first public release.",
    ],
    future: [
      "Add landing page experiments.",
      "Publish product screenshots when the UI reaches alpha quality.",
      "Collect early feedback and turn it into a roadmap update.",
    ],
    caseStudy: {
      problem:
        "Hiring signals are noisy. Hirevoy needs to clarify what a candidate or builder can actually do, then turn that clarity into a product experience.",
      research:
        "The research direction is audience-first: identify who struggles most, what proof they need, and where current hiring workflows waste attention.",
      planning:
        "The plan is to keep the first public version narrow: one strong journey, one clear value proposition, and a roadmap that can be validated.",
      architecture:
        "The product architecture should separate profiles, proof of work, opportunities, feedback loops, and admin workflows so the platform can grow without becoming a cluttered dashboard.",
      development:
        "The portfolio version acts as the first product narrative: it explains why Hirevoy exists and what needs to be built next.",
      challenges: [
        "Avoiding generic startup language.",
        "Choosing a specific audience before adding features.",
        "Turning an idea into a credible product system.",
      ],
      results:
        "Hirevoy is positioned as a serious founder track rather than a vague side project, with room for progress updates, screenshots, and user validation.",
      improvements: [
        "Write a sharper one-sentence positioning line after audience validation.",
        "Add a public roadmap with dated milestones.",
        "Add testimonials or user feedback once real users are involved.",
      ],
    },
    logs: [
      "Clarifying the hiring problem before expanding the feature list.",
      "Designing roadmap sections that can absorb real user feedback.",
      "Preparing product storytelling for clients and recruiters.",
    ],
  },
  {
    slug: "portfolio-os",
    title: "Portfolio OS",
    eyebrow: "This website",
    status: "Interactive v1",
    image: "/assets/hero-command-deck.png",
    summary:
      "A premium interactive portfolio system designed to sell freelance skill, surface serious projects, and make Dhyan memorable without becoming gimmicky.",
    impact:
      "The site itself becomes proof of frontend taste: performance-minded, accessible, responsive, and built around a focused hire-me journey.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Lenis",
    ],
    links: [
      { label: "Explore", href: "/" },
      {
        label: "Source",
        disabledReason: "Add the portfolio repository URL after publishing.",
      },
    ],
    challenges: [
      "Creating a game-inspired portfolio that still feels professional.",
      "Making many sections feel connected instead of bloated.",
      "Using animation as a trust builder, not decoration.",
    ],
    solutions: [
      "Design the homepage as a command deck with clear missions and conversion paths.",
      "Use a single content model so achievements, projects, and profile details are easy to update.",
      "Add purposeful interactions: terminal, keyboard shortcuts, section navigation, and reveal states.",
    ],
    lessons: [
      "A portfolio is a product, not a brochure.",
      "Dark futuristic design needs restraint to stay premium.",
      "The strongest personal sites make contact feel like the obvious next step.",
    ],
    timeline: [
      "Scaffold the Next.js application.",
      "Create original hero and project visuals.",
      "Build the interactive homepage, project pages, and conversion flow.",
    ],
    future: [
      "Add MDX devlogs and blog posts.",
      "Connect real GitHub data after a username is added.",
      "Add analytics, testimonials, and a CMS-backed project editor.",
    ],
    caseStudy: {
      problem:
        "The prompt asked for a portfolio that feels like a premium indie game while still attracting freelance clients and internship recruiters.",
      research:
        "The design direction combines dark AAA UI, founder storytelling, chess identity, and developer credibility while avoiding fake progress bars and noisy effects.",
      planning:
        "The site is organized around the visitor journey: arrival, curiosity, exploration, trust, and hiring intent.",
      architecture:
        "The app uses Next.js app routes, a central TypeScript content model, generated local image assets, client-side motion components, and dynamic project pages.",
      development:
        "The first version focuses on the homepage, Zeno5, Hirevoy, achievements, GitHub-ready integration, Easter eggs, and a configurable contact surface.",
      challenges: [
        "Avoiding invented personal links or project metrics.",
        "Keeping the page fast despite rich visuals.",
        "Making mobile feel designed, not merely compressed.",
      ],
      results:
        "The portfolio now has a premium interactive foundation with real content hooks, case-study routes, and clear places to add public links.",
      improvements: [
        "Replace pending contact links with real URLs.",
        "Add real project screenshots and videos.",
        "Create MDX devlogs for Zeno5 and Hirevoy.",
      ],
    },
  },
];

export const skillGroups = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion UI", "Accessibility"],
  },
  {
    label: "Backend",
    items: ["API design", "Data modelling", "Auth flows", "Server rendering", "Product logic"],
  },
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "C fundamentals", "Python scripting", "SQL basics"],
  },
  {
    label: "Tools",
    items: ["Git", "VS Code", "Figma handoff", "Chrome DevTools", "Performance profiling"],
  },
  {
    label: "AI",
    items: ["AI-assisted prototyping", "Prompt workflows", "LLM UX patterns", "Automation ideas"],
  },
  {
    label: "Embedded Systems",
    items: ["Low-level thinking", "Debugging habits", "Architecture notes", "Hardware curiosity"],
  },
  {
    label: "Learning",
    items: ["Asset ripping", "Reverse engineering", "Emulator architecture", "Technical writing"],
  },
];

export const timeline = [
  {
    year: "2024",
    title: "IHRD Tech Fest",
    type: "Award",
    detail: "Third Prize - a competitive milestone that belongs near the trust-building portion of the portfolio.",
  },
  {
    year: "2025",
    title: "KEAM College Tech Fest",
    type: "Award",
    detail: "First Prize - the strongest achievement currently provided and a clear proof point for recruiters.",
  },
  {
    year: "Now",
    title: "Zeno5 Emulator",
    type: "Flagship project",
    detail: "Current main project centered on emulator research, asset pipeline learning, and reverse engineering.",
  },
  {
    year: "Now",
    title: "Hirevoy",
    type: "Founder track",
    detail: "Startup direction that shows product ambition, roadmap thinking, and founder energy.",
  },
];

export const achievements = [
  {
    title: "First Prize",
    context: "KEAM College Tech Fest",
    year: "2025",
    rarity: "Gold",
  },
  {
    title: "Third Prize",
    context: "IHRD Tech Fest",
    year: "2024",
    rarity: "Bronze",
  },
  {
    title: "2029 Rated",
    context: "Chess.com",
    year: "Current",
    rarity: "Strategist",
  },
  {
    title: "Founder",
    context: "Hirevoy",
    year: "Current",
    rarity: "Builder",
  },
];

export const chess = {
  rating: profile.chessRating,
  platform: profile.chessPlatform,
  openings: [] as string[],
  lessons: [
    "Candidate moves first, code second.",
    "A blunder-check habit catches bugs before they become expensive.",
    "Long games teach patience with unclear positions and unclear products.",
    "Pattern recognition gets stronger when every decision has a post-mortem.",
  ],
};

export const contactActions = [
  {
    label: "Email",
    href: profile.contact.email ? `mailto:${profile.contact.email}` : undefined,
    value: profile.contact.email || "Add email in src/data/portfolio.ts",
  },
  {
    label: "Resume",
    href: profile.contact.resume || undefined,
    value: profile.contact.resume || "Add resume PDF to public/resume.pdf",
  },
  {
    label: "GitHub",
    href: profile.contact.github || undefined,
    value: profile.contact.github || "Connect GitHub profile",
  },
  {
    label: "LinkedIn",
    href: profile.contact.linkedin || undefined,
    value: profile.contact.linkedin || "Connect LinkedIn profile",
  },
  {
    label: "Chess.com",
    href: profile.contact.chess || undefined,
    value: profile.contact.chess || "Connect Chess.com profile",
  },
];

export const githubConfig = {
  username:
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
    profile.contact.github.replace(/^https?:\/\/github\.com\//, ""),
};
