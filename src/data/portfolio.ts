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
  category?: string;
  image?: string;
  repo?: string;
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
    "Dhyan Ajay is a computer science student, founder of Hirevoy, and creator of the Zeno5 Emulator.",
};

export const profile = {
  name: "Dhyan Ajay",
  age: 19,
  role: "Computer Science Student",
  headline:
    "I turn ideas and systems experiments into useful software, guided by curiosity and a love of building.",
  shortPitch:
    "A builder for clients who want more than a template: polished interfaces, careful implementation, and product thinking from the first screen.",
  founderOf: "Hirevoy",
  currentProject: "Zeno5 Emulator",
  currentQuest: "Turn experimental ideas into polished, testable products",
  currentLearning: ["Asset extraction", "Reverse engineering"],
  hobby: "Chess",
  chessRating: "2,029 Elo (Chess.com)",
  chessPlatform: "Chess.com",
  personality: ["Curious", "Builder", "Problem Solver", "Always Learning"],
  contact: {
    email: "dhyan102006@gmail.com",
    github: "https://github.com/tossdace",
    linkedin: "https://www.linkedin.com/in/dhyan-ajay/",
    chess: "https://www.chess.com/member/dhyan-ajay",
    resume: undefined,
  },
};

export const navigation = [
  { label: "About", href: "#profile" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export const projects: Project[] = [
  {
    slug: "zeno5-emulator",
    title: "Zeno5 Emulator",
    eyebrow: "Flagship build",
    status: "In development",
    image: undefined,
    repo: "https://github.com/tossdace/Zeno5",
    summary:
      "An ongoing emulator project exploring systems research, asset pipelines, and reverse engineering.",
    impact:
      "I use Zeno5 to explore emulator architecture, asset pipelines, and reverse engineering through a long-term project.",
    techStack: [
      "Systems design",
      "Reverse engineering",
      "Asset pipeline research",
      "Debug tooling",
      "Architecture notes",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tossdace/Zeno5",
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
        "The research focuses on asset extraction, reverse-engineering workflows, emulator architecture, and ways to turn findings into development tasks.",
      planning:
        "The project is framed around progressive disclosure: first clarify scope, then document subsystems, then expose devlogs and visual proof as the build matures.",
      architecture:
        "The planned structure covers research notes, the asset pipeline, the execution core, debugging tools, a gallery, and a release roadmap.",
      development:
        "Current development emphasis is on learning, documentation quality, and building the confidence needed to turn the system into a shareable prototype.",
      challenges: [
        "Avoiding vague claims while the build is still research-heavy.",
        "Explaining reverse engineering work professionally.",
        "Balancing technical depth with recruiter/client readability.",
      ],
      results:
        "Zeno5 is in development. This case study outlines its current focus and the work still ahead.",
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
    image: "/assets/hirev.png",
    summary:
      "A hiring product concept focused on helping people present their work and making hiring journeys easier to understand and evaluate.",
    impact:
      "Building Hirevoy involves thinking about product direction, roadmap planning, and the needs of people using hiring platforms.",
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
        label: "Case study",
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
        "Hirevoy is a founder-led project in progress. Its direction, roadmap, and product details will develop as the work continues.",
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
    slug: "sign-language-gloves",
    title: "Sign Language Gloves",
    eyebrow: "Hardware + AI",
    status: "Completed / Prototype",
    category: "Hardware + AI",
    repo: "https://github.com/tossdace/Sign-language-gloves-",
    summary:
      "An AI-powered smart glove that uses sensors and machine learning to recognize sign language and support communication for people with hearing or speech impairments.",
    impact:
      "The project showcases embedded AI that bridges hardware design, sensor fusion, and accessibility-driven product thinking.",
    techStack: [
      "Arduino",
      "Python",
      "Machine Learning",
      "Embedded Systems",
      "IoT",
    ],
    image: undefined,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tossdace/Sign-language-gloves-",
      },
      {
        label: "Case Study",
        href: "/projects/sign-language-gloves",
      },
    ],
    challenges: [
      "Mapping gesture sensor input into reliable sign recognition.",
      "Delivering on-device inference for embedded hardware.",
      "Designing a wearable interface that feels natural and intuitive.",
    ],
    solutions: [
      "Built a sensor glove prototype with Arduino for real-time gesture capture.",
      "Trained a lightweight sign recognition model in Python and integrated it into the hardware flow.",
      "Focused on accessibility-first interaction design and robust error handling.",
    ],
    lessons: [
      "Hardware projects benefit from early prototyping and data-driven model validation.",
      "Machine learning on edge devices requires careful resource planning.",
      "Accessibility is stronger when technology adapts to people, not the other way around.",
    ],
    timeline: [
      "Prototype sensors and gesture mapping.",
      "Train an initial sign recognition model.",
      "Integrate the ML pipeline with the glove hardware.",
    ],
    future: [
      "Refine gesture accuracy with more training data.",
      "Add support for additional sign languages.",
      "Create a polished wearable enclosure and user flow.",
    ],
    caseStudy: {
      problem:
        "Communication barriers remain an accessibility challenge for people who are deaf or hard of hearing, as well as people with speech disabilities, particularly in everyday situations.",
      research:
        "The research focused on gesture detection, sensor placement, lightweight model selection, and real-time embedded inference.",
      planning:
        "The project was framed as a hardware-plus-AI prototype with an emphasis on usable glove mechanics and consistent sign recognition.",
      architecture:
        "The system is built with a sensor layer, an embedded processing layer, and a machine learning inference layer that maps gestures to digital responses.",
      development:
        "Development combined Arduino hardware design, Python-based model workflow, and iterative testing with real sign sequences.",
      challenges: [
        "Handling noisy sensor readings.",
        "Keeping the model small enough for on-device execution.",
        "Translating real gestures into reliable predictions.",
      ],
      results:
        "The prototype demonstrates a working path from glove input to sign recognition, making the idea tangible and ready for refinement.",
      improvements: [
        "Improve sensor calibration and gesture coverage.",
        "Add a more polished wearable enclosure.",
        "Collect user feedback from actual sign language users.",
      ],
    },
  },
  {
    slug: "project-yukino",
    title: "Project Yukino",
    eyebrow: "AI Assistant",
    status: "In development",
    category: "AI Assistant",
    repo: "https://github.com/tossdace/project_yukino",
    summary:
      "A desktop AI assistant for voice interaction, automation, and local AI workflows.",
    impact:
      "The project explores personal productivity through voice-driven workflows and automation powered by local AI models.",
    techStack: [
      "Python",
      "Whisper",
      "LLMs",
      "TTS",
      "Automation",
    ],
    image: undefined,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tossdace/project_yukino",
      },
      {
        label: "Case Study",
        href: "/projects/project-yukino",
      },
    ],
    challenges: [
      "Combining reliable voice recognition with local AI flows.",
      "Keeping the assistant responsive while respecting privacy.",
      "Designing natural conversational automation patterns.",
    ],
    solutions: [
      "Built voice input with Whisper and local LLM orchestration.",
      "Added text-to-speech feedback and task automation hooks.",
      "Designed the assistant around modular voice commands and local execution.",
    ],
    lessons: [
      "Local AI assistants need strong fallbacks for noisy voice input.",
      "Automation must be framed around concrete user tasks.",
      "Privacy-first design is easier with local model options.",
    ],
    timeline: [
      "Prototype voice capture and transcription.",
      "Build the assistant orchestration engine.",
      "Connect automation flows and test common tasks.",
    ],
    future: [
      "Add more advanced command templates.",
      "Support offline model execution.",
      "Publish a polished desktop launcher experience.",
    ],
    caseStudy: {
      problem:
        "Many AI assistants rely on cloud services and fragmented workflows, making them less useful for local, privacy-aware automation.",
      research:
        "Research explored voice models, local LLM toolchains, automation hooks, and desktop UX patterns.",
      planning:
        "The plan emphasizes a modular assistant that can handle voice interaction, task execution, and local AI workflows without unnecessary cloud dependence.",
      architecture:
        "The assistant uses a voice front-end, transcription layer, model orchestration layer, and automation engine for desktop tasks.",
      development:
        "Development focused on integrating Whisper, TTS, and command automation into a single responsive local assistant experience.",
      challenges: [
        "Keeping latency low for voice interactions.",
        "Maintaining reliability across different desktop environments.",
        "Balancing local performance with AI capability.",
      ],
      results:
        "The project is a working local AI assistant prototype that demonstrates voice interaction and automation for personal workflows.",
      improvements: [
        "Refine voice command accuracy and context handling.",
        "Add richer desktop automation templates.",
        "Polish the assistant UI and onboarding experience.",
      ],
    },
  },
  {
    slug: "portfolio-os",
    title: "Portfolio OS",
    eyebrow: "This website",
    status: "Interactive v1",
    image: undefined,
    summary:
      "An interactive portfolio that brings Dhyan's projects, skills, and contact information together in one place.",
    impact:
      "The site brings project case studies, section navigation, motion, and contact links together in one interface.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Lenis",
    ],
    links: [
      { label: "View portfolio", href: "/" },
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
        "The app uses Next.js routes, a central TypeScript content model, client-side motion, and dynamic project pages.",
      development:
        "The first version focuses on the homepage, Zeno5, Hirevoy, achievements, GitHub-ready integration, Easter eggs, and a configurable contact surface.",
      challenges: [
        "Avoiding invented personal links or project metrics.",
        "Keeping the page fast despite rich visuals.",
        "Making mobile feel designed, not merely compressed.",
      ],
      results:
        "The portfolio includes an interactive homepage, project case-study routes, and contact links.",
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
    items: ["Asset extraction", "Reverse engineering", "Emulator architecture", "Technical writing"],
  },
];

export const timeline = [
  {
    year: "2024",
    title: "IHRD Tech Fest",
    type: "Award",
    detail: "Dhyan earned third place at IHRD Tech Fest.",
  },
  {
    year: "2025",
    title: "KMEA College Tech Fest",
    type: "Award",
    detail: "Dhyan earned first place at KMEA College Tech Fest.",
  },
  {
    year: "Now",
    title: "Zeno5 Emulator",
    type: "Flagship project",
    detail: "Dhyan's current main project, focused on emulator research, asset pipelines, and reverse engineering.",
  },
  {
    year: "Now",
    title: "Hirevoy",
    type: "Founder track",
    detail: "Dhyan's founder-led project, with its product direction and roadmap in progress.",
  },
];

export const achievements = [
  {
    title: "First Prize",
    context: "KMEA College Tech Fest",
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
    title: "2,029 Elo",
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
    value: profile.contact.email || "Email address not provided",
  },
  ...(profile.contact.resume
    ? [{ label: "Resume", href: profile.contact.resume, value: "Download resume" }]
    : []),
  {
    label: "GitHub",
    href: profile.contact.github || undefined,
    value: profile.contact.github || "GitHub profile not provided",
  },
  {
    label: "LinkedIn",
    href: profile.contact.linkedin || undefined,
    value: profile.contact.linkedin || "LinkedIn profile not provided",
  },
  {
    label: "Chess.com",
    href: profile.contact.chess || undefined,
    value: profile.contact.chess || "Chess.com profile not provided",
  },
];

export const githubConfig = {
  username:
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
    profile.contact.github.replace(/^https?:\/\/github\.com\//, ""),
};
